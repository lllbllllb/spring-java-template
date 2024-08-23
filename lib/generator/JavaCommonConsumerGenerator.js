import { ConstrainedAnyModel, FormatHelpers, OutputModel } from '@asyncapi/modelina';
import {
    KAFKA_LISTENER_CONFIGURATION_PROPERTIES_TEMPLATE
} from "./template/kafka/listener/template/KafkaListenerConfigurationPropertiesTemplate";
import { KAFKA_LISTENER_CONFIGURATION_TEMPLATE } from "./template/kafka/listener/template/KafkaListenerConfigurationTemplate";
import { KAFKA_MESSAGE_LISTENER_TEMPLATE } from "./template/kafka/listener/template/KafkaMessageListenerTemplate";
import { MESSAGE_CONSUMER_SERVICE_TEMPLATE } from "./template/common/template/MessageConsumerTemplate";


export class JavaCommonConsumerGenerator {

    constructor() {
    }

    generate(model) {
        const channels = model.channels().filterBySend();

        return [
            ...this.renderMessageConsumers(channels)
        ];
    }

    renderMessageConsumers(channels) {
        return channels.map(channel => this.renderMessageConsumer(channel))
    }

    renderMessageConsumer(channel) {
        const operationId = channel.operations()[0].id();
        const upperOperationId = `${FormatHelpers.toPascalCase(operationId)}`;
        const className = `${upperOperationId}KafkaMessageConsumer`;
        const payloadId = channel.operations()[0].messages()[0].payload().id();
        const payloadClassName = `${FormatHelpers.toPascalCase(payloadId)}`;
        const result = MESSAGE_CONSUMER_SERVICE_TEMPLATE(className, payloadClassName);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaMessageConsumer'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });
    }

}
