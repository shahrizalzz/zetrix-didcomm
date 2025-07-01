import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createPing(from, to) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/trust-ping/2.0/ping",
        from: from,
        body: {
            response_requested: true
        },
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createPingResponse(from, to, thid) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/trust-ping/2.0/ping-response",
        from: from,
        body: {},
        to: [to],
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}