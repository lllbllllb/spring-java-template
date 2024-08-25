import { SimpleTemplate } from "../SimpleTemplate";

export class MessageConsumerTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, 'KafkaMessageConsumer', javaBasePackage);
    }

    getResult() {
        return MESSAGE_CONSUMER_TEMPLATE(
            this.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage()
        );
    }
}

const MESSAGE_CONSUMER_TEMPLATE = (className, payloadClassName, javaBasePackage) => `
import ${javaBasePackage}.model.${payloadClassName};

import java.util.Map;
import java.util.function.BiConsumer;

public interface ${className} extends BiConsumer<${payloadClassName}, Map<String, String>> {}
`;
