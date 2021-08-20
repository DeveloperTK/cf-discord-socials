const WorkersSentry = require('workers-sentry/worker');
const scheduled = require("../events/scheduled");
const { getJsonResponse } = require("../utils");

/**
 * Manually triggers the action executed by a cron event
 * @param event Cloudflare Event
 * @param {WorkersSentry} sentry
 */
module.exports = async function(event, sentry) {
    let status = 200;
    
    await scheduled(event, sentry).then(result => {
        status = result.status;
    }).catch(err => {
        sentry.captureException(err);
        console.error(err);
        message = "ERROR";
        status = 500;
    });

    return getJsonResponse({
        youtube: {
            status: result.status,
            message: result.status == 200 ? "PUBLISHED" : "ACK BUT DID NOT PUBLISH"
        }
    });
}
