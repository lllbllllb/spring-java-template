import { SimpleTemplate } from "../../SimpleTemplate";
import { FormatHelpers } from "@asyncapi/modelina";

export class KafkaListenerConfigurationPropertiesTemplate extends SimpleTemplate {
    static TYPE = 'KafkaConfigurationProperties';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const channelId = this.channel.id();
        const topicPattern = channelId.replaceAll(/{[0-9a-zA-Z]*}/gm, '\.\*');

        return KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            topicPattern,
            channelId
        );
    }

    getType() {
        return KafkaListenerConfigurationPropertiesTemplate.TYPE;
    }
}

const KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic, channel) => `
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.processing.Generated;

@Data
@EqualsAndHashCode(callSuper = true)
@Component
@ConfigurationProperties("asyncapi.kafka.consumer.${FormatHelpers.toParamCase(operationId)}")
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} extends KafkaProperties.Consumer {

    private String topic = "${topic}";
    
    private String channel = "${channel}";

    private Class<?> keyDeserializer= ByteArrayDeserializer.class;

}
`;