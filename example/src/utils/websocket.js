import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { CONSTANTS } from "@/constants/constants";
import { decodeFromBase64 } from './util.js';
import { processMessage, setRecipientMessage } from '../lib/messageHandler'
import { packMessage, unpackMessage } from "zetrix-didcomm";

export default {
  data() {
    return {
      connected: false,
      socket: null,
      stompClient: null,
      didData: sessionStorage.getItem("didData"),
    };
  },
  methods: {
    getRecipientDid(senderKey) {
      return senderKey.split("#")[0];
    },
    async getSenderPublicKey(senderKey) {
      try {
        const sender = this.getRecipientDid(senderKey);

        // Check if sender DID already exists
        const exists = this.$store.getters["hasRecipient"](sender);
        if (exists) {
          const existingRecipient = this.$store.state.recipientDid.find(
            (recipient) => recipient.did === sender
          );
          return existingRecipient.publicKey;
        }

        const response = await this.$store.dispatch("zid/resolveRecipient", { zid: sender });
        if (response != null && response.didDocument != null) {
          // Find the first X25519KeyAgreementKey2020 key
          const senderKeyAgreement = response.didDocument.verificationMethod.find(
            (method) => method.type === "X25519KeyAgreementKey2020"
          );

          if (senderKeyAgreement && senderKeyAgreement.publicKeyMultibase) {
            const senderPubKey = senderKeyAgreement.publicKeyMultibase;
            this.$store.dispatch("addRecipient", { did: sender, pubKey: senderPubKey });
            return senderPubKey;
          } else {
            // Recipient does not support DIDComm
            return false;
          }
        } else {
          // Recipient DID does not exist
          return false;
        }
      } catch (error) {
        console.error("Error retrieving sender public key:", error);
        return false;
      }
    },
    async send(jwe) {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.send('/app/didcomm/message', JSON.stringify(jwe), {});
      }
    },
    async connect(jwe, didDataJson) {
      this.socket = new SockJS(process.env.VUE_APP_WS_URL);
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        async (frame) => {
          this.connected = true;
          this.$store.dispatch("addLogMessage", 'Connect WS success.');

          this.stompClient.subscribe('/user/queue/didcomm/message', async (message) => {
            const messageBody = JSON.parse(message.body); // Convert message body to JSON

            if (messageBody && messageBody.recipients && messageBody.iv && messageBody.ciphertext) {
              // Decode the protected header
              const decodeStr = decodeFromBase64(messageBody.protected);

              const protectedJson = JSON.parse(decodeStr);

              if (protectedJson.skid != null) { // Unpack with authcrypt
                if (protectedJson.skid === CONSTANTS.MEDIATOR_KID) {
                  const respMessage = unpackMessage.unpackAuthCrypt(messageBody, didDataJson.privateKey, CONSTANTS.MEDIATOR_PUB_KEY);
                  this.$store.dispatch("addReceivedMessage", respMessage);
                } else {
                  try {
                    // Wait for sender's public key
                    const senderPubKey = await this.getSenderPublicKey(protectedJson.skid);
                    if (senderPubKey) {
                      const respMessage = unpackMessage.unpackAuthCrypt(messageBody, didDataJson.privateKey, senderPubKey);
                      this.$store.dispatch("addReceivedMessage", respMessage);
                      const recipientMsg = setRecipientMessage(respMessage, this.getRecipientDid(protectedJson.skid), 'Received')
                      if (recipientMsg != null) {
                        this.$store.dispatch("addRecipientMessage", recipientMsg);
                      }

                      const newMessage = processMessage(respMessage)
                      if (newMessage != null) {
                        const recipientMsg2 = setRecipientMessage(JSON.parse(newMessage), this.getRecipientDid(protectedJson.skid), 'Sent')
                        if (recipientMsg2 != null) {
                          this.$store.dispatch("addRecipientMessage", recipientMsg2);
                        }

                        const skid = didDataJson.id + '#delegateKey-1'
                        const jwe = packMessage.packAuthCrypt(didDataJson.privateKey, senderPubKey, skid, protectedJson.skid, newMessage)
                        this.$store.dispatch("addSentMessage", newMessage);
                        await this.forwardMessage(respMessage.from, jwe)
                      }
                    } else {
                      console.error('Sender public key not available.');
                    }
                  } catch (error) {
                    console.error('Error resolving sender public key:', error);
                  }
                }
              } else { // Unpack with anoncrypt
                const respMessage = unpackMessage.unpackAnonCrypt(messageBody, didDataJson.privateKey);
                this.$store.dispatch("addReceivedMessage", respMessage);
              }
            } else if (messageBody && messageBody.id && messageBody.type && messageBody.body) {
              // Problem report
              this.$store.dispatch("addReceivedMessage", messageBody);
            } else {
              // Handle other cases if needed
            }
          });

          await this.send(jwe);
        },
        (error) => {
          console.error(error);
          this.connected = false;
          this.$store.dispatch("addLogMessage", 'Connect WS failed.');
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    },
  },
};
