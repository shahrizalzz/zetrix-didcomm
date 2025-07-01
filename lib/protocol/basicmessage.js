import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createBasicMessage(from, to, content) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/basicmessage/2.0/message",
        from: from,
        lang: "en",
        body: {
            content: content
        },
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}