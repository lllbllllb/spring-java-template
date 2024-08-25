import { SimpleTemplateFactory } from "../../SimpleTemplateFactory";
import { KafkaListenerConfigurationPropertiesTemplate } from "./KafkaListenerConfigurationPropertiesTemplate";
import { KafkaListenerConfigurationTemplate } from "./KafkaListenerConfigurationTemplate";
import { KafkaMessageListenerTemplate } from "./KafkaMessageListenerTemplate";
import { MessageConsumerTemplate } from "../../common/MessageConsumerTemplate";

export class JavaKafkaListenerTemplateFactory extends SimpleTemplateFactory {
    constructor(model) {
        super(
            model.channels().filterBySend(),
            [
                (channel) => new KafkaListenerConfigurationPropertiesTemplate(channel),
                (channel) => new KafkaListenerConfigurationTemplate(channel),
                (channel) => new KafkaMessageListenerTemplate(channel),
                (channel) => new MessageConsumerTemplate(channel),
            ]
        );
    }
}