const { getJsonResponse } = require("../../utils")

module.exports = async function(event, body, sentry) {
    return new Response(null, 501);
}