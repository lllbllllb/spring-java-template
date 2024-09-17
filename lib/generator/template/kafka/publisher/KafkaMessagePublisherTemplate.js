import { SimpleTemplate } from "../../SimpleTemplate";
import { MessagePublisherTemplate } from "../../common/MessagePublisherTemplate";
import { KafkaPublisherConfigurationPropertiesTemplate } from "./KafkaPublisherConfigurationPropertiesTemplate";

export class KafkaMessagePublisherTemplate extends SimpleTemplate {
    static TYPE = "KafkaMessagePublisher";

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const parameters = [...this.channel.parameters()]
            .map(p => p.id().trim())
            .filter(p => !!p);
        const parent = this.getDependencyByType(MessagePublisherTemplate.TYPE);
        const properties = this.getDependencyByType(KafkaPublisherConfigurationPropertiesTemplate.TYPE);

        return KAFKA_MESSAGE_PUBLISHER_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            parent.getClassName(),
            properties.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage(),
            parameters
        );
    }

    getType() {
        return KafkaMessagePublisherTemplate.TYPE;
    }
}

const KAFKA_MESSAGE_PUBLISHER_TEMPLATE = (className, operationId, parentClassName, propertiesClassName, payloadClassName, javaBasePackage, parameters) => `
import ${javaBasePackage}.model.${payloadClassName};

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import javax.annotation.processing.Generated;

@Slf4j
@Service
@RequiredArgsConstructor
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} implements ${parentClassName} {

    private final KafkaTemplate<byte[], ${payloadClassName}> ${operationId}KafkaTemplate;

    private final ${propertiesClassName} properties;

    public void publish(${[
        'byte[] key', 
        payloadClassName + ' payload', 
        parameters.map(paramName => 'String ' + paramName)
            .join(', ')
    ]
    .filter(p => !!p)
    .join(', ')}) {
        var parameters = new HashMap<String, String>();
        ${!parameters ? '' : parameters.map(parameter => `parameters.put("${parameter}", ${parameter});`).join('\n')}
        var topic = applyParameters(properties.getTopic(), parameters);
        var record = new ProducerRecord(topic, key, payload);

        publishRoomConfigurationChangeEventKafkaTemplate.send(record);
    }

    private String applyParameters(String topic, Map<String, String> parameters) {
        var compiledTopic = topic;

        for (String key : parameters.keySet()) {
            compiledTopic = compiledTopic.replace("{" + key + "}", parameters.get(key));
        }

        return compiledTopic;
    }
}
`;