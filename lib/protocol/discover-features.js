import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createQueries(from, to) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/discover-features/2.0/queries",
        from: from,
        body: {
            queries: [
                {
                    "feature-type": "protocol",
                    match: "https://didcomm.org/*"
                }
            ]
        },
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}

export function createDisclose(from, to, thid, disclosures) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/discover-features/2.0/disclose",
        from: from,
        body: {
            disclosures: disclosures || [
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/discover-features/2.0"
                },
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/trust-ping/2.0"
                },
                {
                    "feature-type": "protocol",
                    id: "https://didcomm.org/basicmessage/2.0"
                }
            ]
        },
        to: [to],
        thid: thid,
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
