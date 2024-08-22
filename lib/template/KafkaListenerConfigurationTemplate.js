export const KAFKA_LISTENER_CONFIGURATION_TEMPLATE = (className, operationId, upperOperationId, payloadClassName) => `
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;

import java.util.HashMap;

@Slf4j
@Configuration
@ComponentScan
public class ${className} {

    @Bean
    ConsumerFactory<String, ${payloadClassName}> ${operationId}ConsumerFactory(
            KafkaProperties kafkaProperties,
            ${upperOperationId}KafkaConfigurationProperties ${operationId}KafkaConsumerConfigurationProperties,
            ObjectProvider<SslBundles> sslBundlesProvider

    ) {
        var sslBundles = sslBundlesProvider.getIfAvailable();
        var properties = new HashMap<>(kafkaProperties.buildConsumerProperties(sslBundles));
        properties.putAll(${operationId}KafkaConsumerConfigurationProperties.buildProperties(sslBundles));

        return new DefaultKafkaConsumerFactory<>(properties);
    }

    @Bean
    KafkaMessageListenerContainer<String, ${payloadClassName}> ${operationId}KafkaMessageListenerContainer(
            ConsumerFactory<String, String> ${operationId}ConsumerFactory,
            ${upperOperationId}KafkaConfigurationProperties ${operationId}KafkaConfigurationProperties
    ) {
        var topic = ${operationId}KafkaConsumerConfigurationProperties.getTopic();
        var containerProps = new ContainerProperties(topic);

        return new KafkaMessageListenerContainer<>(${operationId}ConsumerFactory, containerProps);

    }
}
`;
