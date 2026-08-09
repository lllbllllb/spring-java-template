import { KafkaListenerConfigurationPropertiesTemplate } from "./KafkaListenerConfigurationPropertiesTemplate";
import { SimpleListenerTemplate } from "../../common/SimpleListenerTemplate";

export class KafkaListenerConfigurationTemplate extends SimpleListenerTemplate {
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
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import javax.annotation.processing.Generated;

@Slf4j
@Configuration
@ComponentScan
@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")
public class ${className} {

    @Bean
    ConsumerFactory<byte[], ${payloadClassName}> ${operationId}ConsumerFactory(
            KafkaProperties kafkaProperties,
            ${propertiesClassName} properties,
            ObjectProvider<SslBundles> sslBundlesProvider

    ) {
        var sslBundles = sslBundlesProvider.getIfAvailable();
        var consumerProperties = new HashMap<>(kafkaProperties.buildConsumerProperties(sslBundles));
        consumerProperties.putAll(properties.buildProperties(sslBundles));
        consumerProperties.put(JsonDeserializer.VALUE_DEFAULT_TYPE, ${payloadClassName}.class.getName());
        consumerProperties.put(JsonDeserializer.TRUSTED_PACKAGES, ${payloadClassName}.class.getPackageName());
        
        log.debug("${operationId} vas created with properties: {}", consumerProperties);

        return new DefaultKafkaConsumerFactory<>(consumerProperties);
    }

    /**
     * A container built directly, rather than through a listener container factory, does not pick
     * up a {@link CommonErrorHandler} bean from the context on its own: it falls back to the
     * framework default of ten immediate retries followed by log-and-skip, which turns a brief
     * outage of whatever the listener writes to into silently committed, unprocessed records.
     * Declare a {@code CommonErrorHandler} bean to choose the retry and recovery policy; without
     * one the framework default still applies.
     */
    @Bean
    KafkaMessageListenerContainer<byte[], ${payloadClassName}> ${operationId}KafkaMessageListenerContainer(
            ConsumerFactory<byte[], ${payloadClassName}> ${operationId}ConsumerFactory,
            ${propertiesClassName} properties,
            MessageListener<byte[], ${payloadClassName}> genericMessageListener,
            ObjectProvider<CommonErrorHandler> commonErrorHandlerProvider
    ) {
        var topic = properties.getTopic();
        var containerProperties = new ContainerProperties(topic);
        containerProperties.setMessageListener(genericMessageListener);

        var container = new KafkaMessageListenerContainer<>(${operationId}ConsumerFactory, containerProperties);

        commonErrorHandlerProvider.ifAvailable(commonErrorHandler -> {
            container.setCommonErrorHandler(commonErrorHandler);

            log.info("${operationId} container uses error handler {}", commonErrorHandler.getClass().getName());
        });

        return container;
    }
}
`;
