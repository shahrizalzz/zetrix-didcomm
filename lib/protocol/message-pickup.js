import { createUUID, getCurrentTimestampMillis } from '../../utils/util.js';


export function createLiveDeliveryChange(from, to, isLive) {
    // Define the message object with the required fields
    const message = {
        id: createUUID(),
        typ: "application/didcomm-plain+json",
        type: "https://didcomm.org/messagepickup/3.0/live-delivery-change",
        from: from,
        body: {
            live_delivery: isLive ? isLive : false,
        },
        to: [to],
        created_time: getCurrentTimestampMillis(),
    };

    // Convert the message object to a JSON string
    return JSON.stringify(message);
}
