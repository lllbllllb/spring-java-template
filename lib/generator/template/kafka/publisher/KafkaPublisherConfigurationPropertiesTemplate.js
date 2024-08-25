import { SimpleTemplate } from "../../SimpleTemplate";

export class KafkaPublisherConfigurationPropertiesTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, 'KafkaConfigurationProperties', javaBasePackage);
    }

    getResult() {
        const topicPattern = this.channel.id().replaceAll(/{[0-9a-zA-Z]*}/gm, '\.\*');

        return KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            topicPattern
        );
    }
}

const KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic) => `
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@EqualsAndHashCode(callSuper = true)
@Component
@ConfigurationProperties("asyncapi.kafka.producer.${operationId}")
public class ${className} extends KafkaProperties.Producer {

    private String topic = "${topic}";

}
`;