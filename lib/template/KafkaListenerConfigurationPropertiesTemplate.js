export const KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic, channel) => `
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