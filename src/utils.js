const { verifyKey } = require('discord-interactions');

const getJsonResponse = (data, status) => {
    return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

const handleInteractionVerification = (request, bodyBuffer) => {
    const timestamp = request.headers.get('X-Signature-Timestamp') || '';
    const signature = request.headers.get('X-Signature-Ed25519') || '';
    return verifyKey(bodyBuffer, signature, timestamp, process.env.CLIENT_PUBLIC_KEY);
};

module.exports = {
    getJsonResponse: getJsonResponse,
    handleInteractionVerification: handleInteractionVerification
}