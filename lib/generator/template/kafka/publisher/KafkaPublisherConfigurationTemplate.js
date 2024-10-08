import { SimpleTemplate } from "../../SimpleTemplate";
import { KafkaPublisherConfigurationPropertiesTemplate } from "./KafkaPublisherConfigurationPropertiesTemplate";

export class KafkaPublisherConfigurationTemplate extends SimpleTemplate {
    static TYPE = "KafkaPublisherConfiguration";

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const propertiesTemplate = this.getDependencyByType(KafkaPublisherConfigurationPropertiesTemplate.TYPE);

        return KAFKA_PUBLISHER_CONFIGURATION_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            propertiesTemplate.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage()
        );
    }

    getType() {
        return KafkaPublisherConfigurationTemplate.TYPE;
    }
}

const KAFKA_PUBLISHER_CONFIGURATION_TEMPLATE = (className, operationId, propertiesClassName, payloadClassName, javaBasePackage) => `
import ${javaBasePackage}.model.${payloadClassName};

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
import javax.annotation.processing.Generated;

@Slf4j
@Configuration
@ComponentScan
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} {

    @Bean
    ProducerFactory<byte[], ${payloadClassName}> ${operationId}ProducerFactory(
            KafkaProperties kafkaProperties,
            ${propertiesClassName} properties,
            ObjectProvider<SslBundles> sslBundlesProvider
    ) {
        var sslBundles = sslBundlesProvider.getIfAvailable();
        // See https://kafka.apache.org/documentation/#producerconfigs for more properties
        var producerProperties = new HashMap<>(kafkaProperties.buildProducerProperties(sslBundles));
        producerProperties.putAll(properties.buildProperties(sslBundles));

        log.debug("${operationId} vas created with properties: {}", producerProperties);

        return new DefaultKafkaProducerFactory<>(producerProperties);
    }

    @Bean
    KafkaTemplate<byte[], ${payloadClassName}> ${operationId}KafkaTemplate(ProducerFactory<byte[], ${payloadClassName}> ${operationId}ProducerFactory) {
        return new KafkaTemplate<>(${operationId}ProducerFactory);
    }

}
`;