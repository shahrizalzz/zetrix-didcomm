import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';

/**
 * Creates a DIDComm mediate request message.
 * @param {string} did - The DID of the sender.
 * @returns {string} - The JSON stringified mediate request message.
 */
export function createMediateRequest(from, to) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/coordinate-mediation/3.0/mediate-request",
        body: {},
        from: from,
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
