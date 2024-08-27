import { SimpleTemplate } from "../../SimpleTemplate";
import { KafkaListenerConfigurationPropertiesTemplate } from "./KafkaListenerConfigurationPropertiesTemplate";

export class KafkaListenerConfigurationTemplate extends SimpleTemplate {
    static TYPE = 'KafkaConfiguration';

    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getResult() {
        const propertiesTemplate = this.getDependencyByType(KafkaListenerConfigurationPropertiesTemplate.TYPE);

        return  KAFKA_LISTENER_CONFIGURATION_TEMPLATE(
            this.getClassName(),
            this.getOperationId(),
            propertiesTemplate.getClassName(),
            this.getPayloadClassName(),
            this.getJavaBasePackage()
        );
    }

    getType() {
        return KafkaListenerConfigurationTemplate.TYPE;
    }
}

const KAFKA_LISTENER_CONFIGURATION_TEMPLATE = (className, operationId, propertiesClassName, payloadClassName, javaBasePackage) => `
import ${javaBasePackage}.model.${payloadClassName};

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
import javax.annotation.processing.Generated;

@Slf4j
@Configuration
@ComponentScan
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} {

    @Bean
    ConsumerFactory<String, ${payloadClassName}> ${operationId}ConsumerFactory(
            KafkaProperties kafkaProperties,
            ${propertiesClassName} properties,
            ObjectProvider<SslBundles> sslBundlesProvider

    ) {
        var sslBundles = sslBundlesProvider.getIfAvailable();
        var consumerProperties = new HashMap<>(kafkaProperties.buildConsumerProperties(sslBundles));
        consumerProperties.putAll(properties.buildProperties(sslBundles));

        log.debug("${operationId} vas created with properties: {}", consumerProperties);

        return new DefaultKafkaConsumerFactory<>(consumerProperties);
    }

    @Bean
    KafkaMessageListenerContainer<String, ${payloadClassName}> ${operationId}KafkaMessageListenerContainer(
            ConsumerFactory<String, ${payloadClassName}> ${operationId}ConsumerFactory,
            ${propertiesClassName} properties
    ) {
        var topic = properties.getTopic();
        var containerProps = new ContainerProperties(topic);

        return new KafkaMessageListenerContainer<>(${operationId}ConsumerFactory, containerProps);

    }
}
`;
