import { formatTimestampToTime } from '../utils/util.js';
import { discoverFeatures, trustPing } from 'zetrix-didcomm';

export function processMessage(message) {

    if (message.type && message.type.includes('discover-features/2.0/queries')) {
        // send response disclose
        return discoverFeatures.createDisclose(message.to[0], message.from, message.id, null)
    } else if (message.type && message.type === ('https://didcomm.org/trust-ping/2.0/ping')) {
        // send ping response
        return trustPing.createPingResponse(message.to[0], message.from, message.id)
    } else {
        return null
    }

}

export function setRecipientMessage(message, recipientDid, comm) {
    
    if (message.type.includes('discover-features/2.0/queries')) {
        // save message
        const recipientMsg = {
            recipientDid: recipientDid,
            title: 'Feature Query',
            time: formatTimestampToTime(message.created_time),
            type: 'text',
            content: 'Requesting features of type "protocol" matching "https://didcomm.org/*"',
            rawMsg: message,
            comm: comm
        }

        return recipientMsg;

    } else if (message.type.includes('discover-features/2.0/disclose')) {
        // save message
        const recipientMsg = {
            recipientDid: recipientDid,
            title: 'Feature Disclose',
            time: formatTimestampToTime(message.created_time),
            type: 'list',
            items: message.body.disclosures,
            rawMsg: message,
            comm: comm
        }

        return recipientMsg;

    } else if (message.type.includes('basicmessage/2.0/message')) {
        // save message
        const recipientMsg = {
            recipientDid: recipientDid,
            title: 'Basic Message',
            time: formatTimestampToTime(message.created_time),
            type: 'text',
            content: message.body.content,
            rawMsg: message,
            comm: comm
        }

        return recipientMsg;

    } else if (message.type.includes('trust-ping/2.0/ping-response')) {
        // save message
        const recipientMsg = {
            recipientDid: recipientDid,
            title: 'Pong',
            time: formatTimestampToTime(message.created_time),
            type: 'text',
            rawMsg: message,
            comm: comm
        }

        return recipientMsg;

    } else if (message.type.includes('trust-ping/2.0/ping')) {
        // save message
        const recipientMsg = {
            recipientDid: recipientDid,
            title: 'Ping',
            time: formatTimestampToTime(message.created_time),
            type: 'text',
            rawMsg: message,
            comm: comm
        }

        return recipientMsg;

    }  else {
        return null
    }

}

