import { FormatHelpers } from "@asyncapi/modelina";
import { SimplePublisherTemplate } from "../../common/SimplePublisherTemplate";

export class KafkaPublisherConfigurationPropertiesTemplate extends SimplePublisherTemplate {
    static TYPE = 'KafkaConfigurationProperties';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const topicPattern = this.channel.id().replaceAll(/{[0-9a-zA-Z]*}/gm, '\.\*');

        return KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            topicPattern
        );
    }

    getType() {
        return KafkaPublisherConfigurationPropertiesTemplate.TYPE;
    }
}

const KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE = (className, operationId, topic) => `
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.kafka.common.serialization.ByteArraySerializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.processing.Generated;
import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@Component
@ConfigurationProperties("asyncapi.kafka.producer.${FormatHelpers.toParamCase(operationId)}")
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} extends KafkaProperties.Producer {

    private String topic = "${topic}";

    private Class<?> keySerializer = ByteArraySerializer.class;

    private Class<?> valueSerializer = JsonSerializer.class;

    private final Map<String, String> properties = new HashMap<>(Map.of(
        JsonSerializer.ADD_TYPE_INFO_HEADERS, "false"
    ));
}
`;