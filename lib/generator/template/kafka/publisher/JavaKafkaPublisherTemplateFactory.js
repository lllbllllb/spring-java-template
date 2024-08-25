import { SimpleTemplateFactory } from "../../SimpleTemplateFactory";
import { KafkaPublisherConfigurationTemplate } from "./KafkaPublisherConfigurationTemplate";
import { KafkaPublisherConfigurationPropertiesTemplate } from "./KafkaPublisherConfigurationPropertiesTemplate";
import { KafkaMessagePublisherTemplate } from "./KafkaMessagePublisherTemplate";
import { MessagePublisherTemplate } from "../../common/MessagePublisherTemplate";

export class JavaKafkaPublisherTemplateFactory extends SimpleTemplateFactory {
    constructor(model, javaBasePackage) {
        super(
            model.channels().filterByReceive(),
            [
                (channel) => new KafkaMessagePublisherTemplate(channel, javaBasePackage),
                (channel) => new KafkaPublisherConfigurationPropertiesTemplate(channel, javaBasePackage),
                (channel) => new KafkaPublisherConfigurationTemplate(channel, javaBasePackage),
                (channel) => new MessagePublisherTemplate(channel, javaBasePackage),
            ]
        );
    }
}