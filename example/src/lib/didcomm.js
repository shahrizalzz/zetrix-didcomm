import { CONSTANTS } from "@/constants/constants";
import { mapMutations } from "vuex";
import websocket from '@/utils/websocket';
import { setRecipientMessage } from '../lib/messageHandler'
import { packMessage, unpackMessage, basicMessage, coordinateMediation, discoverFeatures, routing, trustPing, messagePickup } from 'zetrix-didcomm';

export default {
    mixins: [websocket],
    data() {
        return {
            didData: sessionStorage.getItem("didData"),
            did: null,
            errorMsg: null,
        };
    },

    updated() {
    },

    methods: {
        ...mapMutations([
            "setMsgWrapper",
            "addToMsgWrapper"
        ]),

        async checkDid() {
            if (this.didData == null) {
                try {
                    const response = await this.$store.dispatch('zid/createZid');
                    if (response != null) {
                        const didData = {
                            id: response.id,
                            address: response.ztxAddress,
                            privateKey: response.ztxPrivateKey,
                        };
                        this.didData = JSON.stringify(didData)
                        this.did = didData.id
                        sessionStorage.setItem("didData", this.didData);
                        await this.mediateRequest()
                    }
                } catch (error) {
                    console.error('Error creating did:', error);
                    return null;
                }
            } else {
                this.did = JSON.parse(this.didData).id
                await this.mediateRequest()
            }
        },

        getMediatorDid() {
            this.$store
                .dispatch('zid/resolveMediator')
                .then((response) => {
                    if (response != null) {
                        console.log(response);
                    }
                })
        },

        async mediateRequest() {
            const message = coordinateMediation.createMediateRequest(this.did, CONSTANTS.MEDIATOR_DID)
            this.$store.dispatch("addLogMessage", 'Establishing mediation with mediator: ' + CONSTANTS.MEDIATOR_DID);
            this.$store.dispatch("addLogMessage", 'DID Generated: ' + this.did);
            this.$store.dispatch("addSentMessage", message);
            const didDataJson = JSON.parse(this.didData)
            const skid = didDataJson.id + '#delegateKey-1'
            const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY, skid, CONSTANTS.MEDIATOR_KID, message)
            const response = await this.sendMessageDidComm(jwe)
            this.$store.dispatch("addLogMessage", 'Message sent successfully.');
            if (response && response.recipients && response.iv && response.ciphertext) {
                // unpack message
                const respMessage = unpackMessage.unpackAuthCrypt(response, didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY)
                this.$store.dispatch("addReceivedMessage", respMessage);
                if (respMessage.type.includes('mediate-grant')) {
                    this.connectToWebsocket()
                }
            }
            else if (response && response.id && response.type && response.body) {
                // problem report
                this.$store.dispatch("addReceivedMessage", response);
            } else {
                this.$store.dispatch("addLogMessage", 'Failed to get response from mediator.');
            }
        },

        async queryDiscoverFeature(recipientDid, recipientPubKey) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = discoverFeatures.createQueries(didDataJson.id, recipientDid)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#delegateKey-1'
            const kid = recipientDid + '#delegateKey-1'

            const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async sendBasicMessage(recipientDid, recipientPubKey, content) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = basicMessage.createBasicMessage(didDataJson.id, recipientDid, content)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#delegateKey-1'
            const kid = recipientDid + '#delegateKey-1'

            const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async sendPing(recipientDid, recipientPubKey) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = trustPing.createPing(didDataJson.id, recipientDid)
            this.$store.dispatch("addSentMessage", message);
            const recipientMsg = setRecipientMessage(JSON.parse(message), recipientDid, 'Sent')
            this.$store.dispatch("addRecipientMessage", recipientMsg);
            const skid = didDataJson.id + '#delegateKey-1'
            const kid = recipientDid + '#delegateKey-1'

            const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, recipientPubKey, skid, kid, message)
            await this.forwardMessage(recipientDid, jwe)
        },

        async forwardMessage(recipientDid, recipientJwe) {
            const didDataJson = JSON.parse(sessionStorage.getItem("didData"))
            const message = routing.createForward(didDataJson.id, recipientDid, CONSTANTS.MEDIATOR_DID, JSON.stringify(recipientJwe))
            this.$store.dispatch("addSentMessage", message);
            const jwe = packMessage.packAnonCrypt(CONSTANTS.MEDIATOR_PUB_KEY, CONSTANTS.MEDIATOR_KID, message)
            const response = await this.sendMessageDidComm(jwe)
            this.$store.dispatch("addLogMessage", 'Message sent successfully.');
            if (response && response.id && response.type && response.body) {
                // problem report
                this.$store.dispatch("addReceivedMessage", response);
            }
        },

        async sendMessageDidComm(jwe) {
            try {
                const response = await this.$store.dispatch('zid/sendMessage', { jwe });
                return response || null;
            } catch (error) {
                console.error('Error sending message:', error);
                return null;
            }
        },

        async addContact(recipient) {
            try {
                const response = await this.$store.dispatch('zid/resolveRecipient', { zid: recipient });
                if (response && response.didDocument) {
                    // Find the first verification method with type "X25519KeyAgreementKey2020"
                    const keyAgreementMethod = response.didDocument.verificationMethod.find(vm => vm.type === "X25519KeyAgreementKey2020");
                    
                    console.log('keyAgreement', keyAgreementMethod);
                    
                    if (keyAgreementMethod && keyAgreementMethod.publicKeyMultibase) {
                        const recipientPubKey = keyAgreementMethod.publicKeyMultibase;
                        console.log('recipientPubKey', recipientPubKey);
                        this.$store.dispatch("addRecipient", { did: recipient, pubKey: recipientPubKey });
                        await this.queryDiscoverFeature(recipient, recipientPubKey);
                        return true;
                    } else {
                        // Recipient does not support DIDComm
                        this.errorMsg = 'Recipient DID does not support DIDComm';
                        return false;
                    }
                } else {
                    // Recipient DID does not exist
                    this.errorMsg = 'Recipient DID does not exist';
                    return false;
                }
            } catch (error) {
                console.error('Error resolving recipient:', error);
                this.errorMsg = 'Error adding contact: ' + error;
                return false;
            }
        },

        async connectToWebsocket() {
            const message = messagePickup.createLiveDeliveryChange(this.did, CONSTANTS.MEDIATOR_DID, true)
            const didDataJson = JSON.parse(this.didData)
            const skid = this.did + '#delegateKey-1'
            const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY, skid, CONSTANTS.MEDIATOR_KID, message)
            this.$store.dispatch("addLogMessage", 'Connecting to mediator: ' + CONSTANTS.MEDIATOR_DID);
            this.$store.dispatch("addLogMessage", 'Discovered WS endpoint: ' + process.env.VUE_APP_WS_URL);
            this.connect(jwe, didDataJson)
        }
    },
};
