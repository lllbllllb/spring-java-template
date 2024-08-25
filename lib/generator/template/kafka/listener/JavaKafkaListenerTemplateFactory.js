import { SimpleTemplateFactory } from "../../SimpleTemplateFactory";
import { KafkaListenerConfigurationPropertiesTemplate } from "./KafkaListenerConfigurationPropertiesTemplate";
import { KafkaListenerConfigurationTemplate } from "./KafkaListenerConfigurationTemplate";
import { KafkaMessageListenerTemplate } from "./KafkaMessageListenerTemplate";
import { MessageConsumerTemplate } from "../../common/MessageConsumerTemplate";

export class JavaKafkaListenerTemplateFactory extends SimpleTemplateFactory {
    constructor(model, javaBasePackage) {
        super(
            model.channels().filterBySend(),
            [
                (channel) => new KafkaListenerConfigurationPropertiesTemplate(channel, javaBasePackage),
                (channel) => new KafkaListenerConfigurationTemplate(channel, javaBasePackage),
                (channel) => new KafkaMessageListenerTemplate(channel, javaBasePackage),
                (channel) => new MessageConsumerTemplate(channel, javaBasePackage),
            ]
        );
    }
}