export const KAFKA_MESSAGE_PUBLISHER_TEMPLATE = (className, operationId, upperOperationId, payloadClassName, ...parameters) => `
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ${className} implements ${upperOperationId}KafkaMessagePublisher {

    private final KafkaTemplate<String, ${payloadClassName}> ${operationId}KafkaTemplate;

    private final ${upperOperationId}KafkaConfigurationProperties properties;

    public void publish(String key, ${payloadClassName} payload, ${parameters.map(paramName => 'String ' + paramName).join(', ')}) {
        var parameters = new HashMap<String, String>();
        ${parameters.map(parameter => 'parameters.add("' + parameter + '", ' + parameter + ');').join('\n')}
        
        var topic = applyParameters(properties.getTopic(), parameters);
        var message = MessageBuilder.withPayload(payload)
                .setHeader(KafkaHeaders.KEY, key)
                .setHeader(KafkaHeaders.TOPIC, topic)
                .build();

        ${operationId}KafkaTemplate.send(message).whenComplete((result, ex) -> {
            if (ex != null) {
                log.error(ex.getMessage(), ex);
            } else {
                log.debug("${operationId} message {} was sent successfully", message);
            }
        });
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