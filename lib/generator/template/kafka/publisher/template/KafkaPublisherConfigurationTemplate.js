export const KAFKA_PUBLISHER_CONFIGURATION_TEMPLATE = (className, operationId, upperOperationId, payloadClassName) => `
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.ssl.SslBundles;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;

@Slf4j
@Configuration
@ComponentScan
public class ${className} {

    @Bean
    ProducerFactory<String, ${payloadClassName}> ${operationId}ProducerFactory(
            KafkaProperties kafkaProperties,
            ${upperOperationId}KafkaConfigurationProperties ${operationId}KafkaConfigurationProperties,
            ObjectProvider<SslBundles> sslBundlesProvider
    ) {
        var sslBundles = sslBundlesProvider.getIfAvailable();
        // See https://kafka.apache.org/documentation/#producerconfigs for more properties
        var properties = new HashMap<>(kafkaProperties.buildProducerProperties(sslBundles));
        properties.putAll(${operationId}KafkaConfigurationProperties.buildProperties(sslBundles));

        log.debug("${operationId} vas created with properties: {}", properties);

        return new DefaultKafkaProducerFactory<>(properties);
    }

    @Bean
    KafkaTemplate<String, ${payloadClassName}> ${operationId}KafkaTemplate(ProducerFactory<String, ${payloadClassName}> ${operationId}ProducerFactory) {
        return new KafkaTemplate<>(${operationId}ProducerFactory);
    }

}
`;