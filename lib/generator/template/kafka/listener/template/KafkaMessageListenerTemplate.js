export const KAFKA_MESSAGE_LISTENER_TEMPLATE = (className, upperOperationId, payloadClassName) => `
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ${className} implements MessageListener<String, ${payloadClassName}> {

    private final ${upperOperationId}RecordConsumer consumer;

    private final ${upperOperationId}KafkaConfigurationProperties properties;

    @Override
    public void onMessage(ConsumerRecord<String, ${payloadClassName}> consumerRecord) {
        log.debug("Consumed: {}", consumerRecord.toString());
        var topicParams = decompileTopic(consumerRecord.topic());

        consumer.accept(consumerRecord.value(), topicParams);
    }

    private Map<String, String> decompileTopic(String topic) {
        var topicPattern = properties.getTopic().replaceAll("\\.\\*", "(.*)");
        var pattern = Pattern.compile(topicPattern);
        var values = new ArrayList<String>();
        var valuesMatcher = pattern.matcher(topic);

        if (valuesMatcher.find()) {
            for (int i = 0; i < valuesMatcher.groupCount(); i++) {
                values.add(valuesMatcher.group(i + 1));
            }
        }

        var keys = new ArrayList<String>();
        var keyMatcher = pattern.matcher(topic);

        if (keyMatcher.find()) {
            for (int i = 0; i < valuesMatcher.groupCount(); i++) {
                var val = valuesMatcher.group(i + 1);
                keys.add(val.substring(1, val.length() - 2));
            }
        }

        var  params = new HashMap<String, String>();

        for (int i = 0; i < values.size(); i++) {
            params.put(keys.get(i), values.get(i));
        }

        return params;
    }
}
`;
