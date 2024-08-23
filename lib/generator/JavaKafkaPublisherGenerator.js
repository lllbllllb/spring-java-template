import { ConstrainedAnyModel, FormatHelpers, OutputModel } from '@asyncapi/modelina';
import {
    KAFKA_PUBLISHER_CONFIGURATION_TEMPLATE
} from "./template/kafka/publisher/template/KafkaPublisherConfigurationTemplate";
import {
    KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE
} from "./template/kafka/publisher/template/KafkaPublisherConfigurationPropertiesTemplate";
import { KAFKA_MESSAGE_LISTENER_TEMPLATE } from "./template/kafka/listener/template/KafkaMessageListenerTemplate";
import { KAFKA_MESSAGE_PUBLISHER_TEMPLATE } from "./template/kafka/publisher/template/KafkaMessagePublisherTemplate";


export class JavaKafkaPublisherGenerator {

    constructor() {
    }

    generate(model) {
        const channels = model.channels().filterByReceive();

        return [
            ...this.renderConfigurations(channels),
            ...this.renderConfigurationProperties(channels),
            ...this.renderKafkaMessagePublishers(channels)
        ];
    }

    renderKafkaMessagePublishers(channels) {
        return channels.map(ch => this.renderKafkaMessagePublisher(ch));
    }

    renderKafkaMessagePublisher(channel) {
        const operationId = channel.operations()[0].id();
        const upperOperationId = `${FormatHelpers.toPascalCase(operationId)}`;
        const className = `${upperOperationId}KafkaMessagePublisher`;
        const payloadId = channel.operations()[0].messages()[0].payload().id();
        const payloadClassName = `${FormatHelpers.toPascalCase(payloadId)}`;
        const parameters = [...channel.parameters()].map(p => p.id());
        const result = KAFKA_MESSAGE_PUBLISHER_TEMPLATE(className, upperOperationId, payloadClassName, parameters);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaKafkaMessageListener'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });
    }

    renderConfigurationProperties(channels) {
        return channels.map(ch => this.renderConfigurationProperty(ch));
    }

    renderConfigurationProperty(channel) {
        const operationId = channel.operations()[0].id();
        const upperOperationId = `${FormatHelpers.toPascalCase(operationId)}`;
        const className = `${upperOperationId}KafkaConfigurationProperties`;
        const topicPattern = channel.id().replaceAll(/{[0-9a-zA-Z]*}/gm, '\.\*');
        const result = KAFKA_PUBLISHER_CONFIGURATION_PROPERTIES_TEMPLATE(className, operationId, topicPattern);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaConfigurationProperties'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });
    }

    renderConfigurations(channels) {
        return channels.map(ch => this.renderChannelConfiguration(ch));
    }

    renderChannelConfiguration(channel) {
        const operationId = channel.operations()[0].id();
        const upperOperationId = `${FormatHelpers.toPascalCase(operationId)}`;
        const className = `${upperOperationId}KafkaConfiguration`;
        const payloadId = channel.operations()[0].messages()[0].payload().id();
        const payloadClassName = `${FormatHelpers.toPascalCase(payloadId)}`;

        const result = KAFKA_PUBLISHER_CONFIGURATION_TEMPLATE(className, operationId, upperOperationId, payloadClassName);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaService'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });

    }
}
