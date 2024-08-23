export const MESSAGE_CONSUMER_SERVICE_TEMPLATE = (className, payloadClassName, ...parameters) => `

public interface ${className} {

    void publish(String key, ${payloadClassName} operationIdPayload, ${parameters.map(paramName => 'String ' + paramName).reduce((p1, p2) => p1 + ', ' + p2)}) {};
}
`;