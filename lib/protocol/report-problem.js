import { createUUID } from '../../utils/util.js';

export function createProblemReport(pthid, code, comment) {
    const message = {
        id: createUUID(),
        type: "https://didcomm.org/report-problem/2.0/problem-report",
        pthid: pthid,
        body: {
            code: code,
            comment: comment, 
        }
    };

    return JSON.stringify(message);
}
