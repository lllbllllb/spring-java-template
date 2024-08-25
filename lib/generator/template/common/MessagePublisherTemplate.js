import { SimpleTemplate } from "../SimpleTemplate";

export class MessagePublisherTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, 'MessagePublisher', javaBasePackage);
    }

    getResult() {
        const parameters = [...this.channel.parameters()]
            .map(p => p.id());

        return MESSAGE_CONSUMER_SERVICE_TEMPLATE(
            this.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage(),
            parameters
        );
    }


}

const MESSAGE_CONSUMER_SERVICE_TEMPLATE = (className, payloadClassName, javaBasePackage, ...parameters) => `
import ${javaBasePackage}.model.${payloadClassName};

public interface ${className} {

    void publish(String key, ${payloadClassName} payload, ${parameters.map(paramName => 'String ' + paramName).reduce((p1, p2) => p1 + ', ' + p2)}) {};
}
`;