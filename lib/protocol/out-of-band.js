import { createUUID, base64UrlEncode, base64UrlDecode } from '../../utils/util.js';

export function createInvitation(from, goalCode, goal, accept, attachments) {
    const message = {
        id: createUUID(),
        type: "https://didcomm.org/out-of-band/2.0/invitation",
        from: from,
        body: {
            goal_code: goalCode,
            goal: goal,
            accept: accept
        },
    };

    if (Array.isArray(attachments) && attachments.length > 0) {
        message.attachments = attachments;
    }

    return JSON.stringify(message);
}

export function encodeInvitation(message) {
    return base64UrlEncode(message);
}  

export function decodeInvitation(encodedMessage) {
    return JSON.parse(base64UrlDecode(encodedMessage));
}

export function createUrl(baseUrl, message) {
    const url = baseUrl + '?_oob=' + encodeInvitation(message);
    return url;
}   
