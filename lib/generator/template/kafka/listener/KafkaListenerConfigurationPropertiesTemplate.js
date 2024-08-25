import { SimpleTemplate } from "../../SimpleTemplate";

export class KafkaListenerConfigurationPropertiesTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, 'KafkaConfigurationProperties', javaBasePackage);
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
}

const KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic, channel) => `
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@EqualsAndHashCode(callSuper = true)
@Component
@ConfigurationProperties("asyncapi.kafka.consumer.${operationId}")
public class ${className} extends KafkaProperties.Consumer {

    private String topic = "${topic}";
    
    private String channel = "${channel}";

}
`;