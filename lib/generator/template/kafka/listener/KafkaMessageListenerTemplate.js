import { SimpleTemplate } from "../../SimpleTemplate";
import { MessageConsumerTemplate } from "../../common/MessageConsumerTemplate";
import { KafkaListenerConfigurationPropertiesTemplate } from "./KafkaListenerConfigurationPropertiesTemplate";

export class KafkaMessageListenerTemplate extends SimpleTemplate {
    static TYPE = 'KafkaMessageListener';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const consumerTemplate = this.getDependencyByType(MessageConsumerTemplate.TYPE);
        const propertiesTemplate = this.getDependencyByType(KafkaListenerConfigurationPropertiesTemplate.TYPE);

        return  KAFKA_MESSAGE_LISTENER_TEMPLATE(
            this.getClassName(),
            consumerTemplate.getClassName(),
            propertiesTemplate.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage(),
        );
    }

    getType() {
        return KafkaMessageListenerTemplate.TYPE;
    }
}

const KAFKA_MESSAGE_LISTENER_TEMPLATE = (className, consumerClassName, propertiesClassName, payloadClassName, javaBasePackage) => `
import ${javaBasePackage}.model.${payloadClassName};

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;
import javax.annotation.processing.Generated;

@Slf4j
@Service
@RequiredArgsConstructor
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} implements MessageListener<byte[], ${payloadClassName}> {

    private final ${consumerClassName} consumer;

    private final ${propertiesClassName} properties;

    @Override
    public void onMessage(ConsumerRecord<byte[], ${payloadClassName}> consumerRecord) {
        log.debug("Consumed: {}", consumerRecord.toString());
        var topicParams = decompileTopic(consumerRecord.topic());

        consumer.accept(consumerRecord.value(), topicParams);
    }

    private Map<String, String> decompileTopic(String topic) {
        var topicPattern = properties.getTopic().replaceAll("\\\\.\\\\*", "(.*)");
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
