const interactions = require("../handlers/interactions");
const trigger = require("../handlers/trigger");
const { getJsonResponse } = require("../utils")

/**
 * Handles the Cloudflare fetch event.
 * 
 * @param event the fetch event
 * @returns {Response}
 */
module.exports = async function(event, sentry) {
    const url = new URL(event.request.url);

    // POST Requests
    if (event.request.method === 'POST') {
        // manual cron trigger
        if (url.pathname === '/trigger') {
            return trigger(event, sentry);
        // discord interaction
        } else if (url.pathname === '/interactions') {
            return interactions(event, sentry);
        }
    // GET Requests
    } else if (event.request.method === 'GET') {
        // i forgor 💀
    }
    
    return getJsonResponse({
        status: "404",
        error: "NOT FOUND"
    }, 404);
}