import { createUUID, getCurrentTimestampMillis, encodeToBase64 } from '../../utils/util.js';


export function createForward(from, recipient, to, jwe) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/routing/2.0/forward",
        from: from,
        body: {
            next: recipient
        },
        attachments: [
            {
                id: createUUID(),
                base64: encodeToBase64(jwe)
            }
        ],
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
