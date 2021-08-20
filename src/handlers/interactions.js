const { InteractionType, InteractionResponseType, InteractionResponseFlags, verifyKey } = require('discord-interactions');
const { getJsonResponse } = require('../utils');
const handleCommands = require('./commands');
const handleComponents = require('./components');

module.exports = async function(event, sentry) {
    // Get the body as a buffer and as text
    const bodyBuffer = await event.request.arrayBuffer();
    const bodyText = (new TextDecoder('utf-8')).decode(bodyBuffer);

    // Store the request body in Sentry if something goes wrong
    sentry.setRequestBody(bodyText);

    // Verify a legitimate request
    if (!handleInteractionVerification(event.request, bodyBuffer))
        return new Response(null, { status: 401 });

    // Work with JSON body going forward
    const body = JSON.parse(bodyText);
    sentry.setRequestBody(body);

    // Handle different interaction types
    switch (body.type) {
        // Handle a PING
        case InteractionType.PING:
            return getJsonResponse({
                type: InteractionResponseType.PONG,
            });

        // Handle a command
        case InteractionType.APPLICATION_COMMAND:
            return handleCommands(event, body, sentry);

        // Handle a component
        case InteractionType.MESSAGE_COMPONENT:
            return handleComponents(event, body, sentry);

        // Unknown
        default:
            return getJsonResponse({ status: 501, error: "NOT IMPLEMENTED" }, 501);
    }
};
