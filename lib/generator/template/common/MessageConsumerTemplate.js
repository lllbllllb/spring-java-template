import { SimpleTemplate } from "../SimpleTemplate";

export class MessageConsumerTemplate extends SimpleTemplate {
    constructor(channel) {
        super(channel, 'KafkaMessageConsumer');
    }

    getResult() {
        return MESSAGE_CONSUMER_TEMPLATE(
            this.getClassName(),
            this.getPayloadClassName()
        );
    }
}

const MESSAGE_CONSUMER_TEMPLATE = (className, payloadClassName) => `
import java.util.Map;
import java.util.function.BiConsumer;

public interface ${className} extends BiConsumer<${payloadClassName}, Map<String, String>> {}
`;
