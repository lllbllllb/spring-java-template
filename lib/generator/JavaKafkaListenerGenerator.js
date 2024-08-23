import { ConstrainedAnyModel, FormatHelpers, OutputModel } from '@asyncapi/modelina';
import {
    KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE
} from "./template/kafka/listener/template/KafkaListenerConfigurationPropertiesTemplate";
import { KAFKA_LISTENER_CONFIGURATION_TEMPLATE } from "./template/kafka/listener/template/KafkaListenerConfigurationTemplate";
import { KAFKA_MESSAGE_LISTENER_TEMPLATE } from "./template/kafka/listener/template/KafkaMessageListenerTemplate";


export class JavaKafkaListenerGenerator {

    constructor() {
    }

    generate(model) {
        const channels = model.channels().filterBySend();

        return [
            ...this.renderConfigurations(channels),
            ...this.renderConfigurationProperties(channels),
            ...this.renderKafkaMessageListeners(channels)
        ];
    }

    renderKafkaMessageListeners(channels) {
        return channels.map(ch => this.renderKafkaMessageListener(ch));
    }

    renderKafkaMessageListener(channel) {
        const operationId = channel.operations()[0].id();
        const upperOperationId = `${FormatHelpers.toPascalCase(operationId)}`;
        const className = `${upperOperationId}KafkaMessageListener`;
        const payloadId = channel.operations()[0].messages()[0].payload().id();
        const payloadClassName = `${FormatHelpers.toPascalCase(payloadId)}`;
        const result = KAFKA_MESSAGE_LISTENER_TEMPLATE(className, upperOperationId, payloadClassName);

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
        const channelId = channel.id();
        const topicPattern = channelId.replaceAll(/{[0-9a-zA-Z]*}/gm, '\.\*');
        const result = KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE(className, operationId, topicPattern, channelId);

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
        const result = KAFKA_LISTENER_CONFIGURATION_TEMPLATE(className, operationId, upperOperationId, payloadClassName);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaService'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });

    }
}
