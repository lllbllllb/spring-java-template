module.exports = {
    'generate:before': generator => {

        checkProtocol(generator);
    }
};

function checkProtocol(generator) {
    [...generator.asyncapi.servers()]
        .forEach(server => {
            const protocol = server.protocol();
            const supportedProtocols = [...generator.templateConfig.supportedProtocols];

            if (protocol && !supportedProtocols.includes(protocol.toLowerCase())) {
                throw new Error(`Protocol ${protocol} not supported`);
            }
        })
}