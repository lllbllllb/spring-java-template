import { SimplePublisherTemplate } from "./SimplePublisherTemplate";

export class MessagePublisherTemplate extends SimplePublisherTemplate {
    static TYPE = 'MessagePublisher';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const parameters = [...this.channel.parameters()]
            .map(p => p.id().trim())
            .filter(p => !!p);

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

const MESSAGE_CONSUMER_SERVICE_TEMPLATE = (className, payloadClassName, javaBasePackage, parameters) => `
import ${javaBasePackage}.model.${payloadClassName};

import org.springframework.kafka.support.SendResult;

import java.util.concurrent.CompletableFuture;
import javax.annotation.processing.Generated;

@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public interface ${className} {

    /**
     * Hands the record to the producer and returns without waiting for the broker.
     *
     * @return the send's result, which completes when the broker acknowledges the record and completes exceptionally
     * when the record is refused or the producer gives up on it. A caller may ignore it, which leaves the send
     * fire-and-forget; a caller whose record may not be lost waits on it, with a timeout of its own.
     */
    CompletableFuture<SendResult<byte[], ${payloadClassName}>> publish(${[
    'byte[] key',
    payloadClassName + ' payload',
    parameters.map(paramName => 'String ' + paramName)
        .join(', ')
]
    .filter(p => !!p)
    .join(', ')});
}
`;