import { ConstrainedAnyModel, FormatHelpers, OutputModel } from '@asyncapi/modelina';
import { MESSAGE_CONSUMER_SERVICE_TEMPLATE } from "./template/common/template/MessagePublisherTemplate";


export class JavaCommonPublisherGenerator {

    constructor() {
    }

    generate(model) {
        const channels = model.channels().filterByReceive();

        return [
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
        const result = MESSAGE_CONSUMER_SERVICE_TEMPLATE(className, payloadClassName, parameters);

        return OutputModel.toOutputModel({
            result: result,
            model: new ConstrainedAnyModel('', channel, {}, 'javaMessagePublisher'),
            modelName: className,
            inputModel: channel,
            dependencies: []
        });
    }
}
