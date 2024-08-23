export const KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic) => `
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