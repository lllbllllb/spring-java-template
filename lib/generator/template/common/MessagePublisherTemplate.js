import { SimpleTemplate } from "../SimpleTemplate";

export class MessagePublisherTemplate extends SimpleTemplate {
    static TYPE = 'MessagePublisher';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
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

    getType() {
        return MessagePublisherTemplate.TYPE;
    }
}

const MESSAGE_CONSUMER_SERVICE_TEMPLATE = (className, payloadClassName, javaBasePackage, ...parameters) => `
import ${javaBasePackage}.model.${payloadClassName};

import javax.annotation.processing.Generated;

@Generated(value="com.asyncapi.generator.template.spring", date="${new Date().toUTCString()}")
public interface ${className} {

    void publish(String key, ${payloadClassName} payload, ${parameters.map(paramName => 'String ' + paramName).reduce((p1, p2) => p1 + ', ' + p2)}) {};
}
`;