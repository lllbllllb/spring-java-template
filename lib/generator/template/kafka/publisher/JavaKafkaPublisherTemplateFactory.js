import { SimpleTemplateFactory } from "../../SimpleTemplateFactory";
import { KafkaPublisherConfigurationTemplate } from "./KafkaPublisherConfigurationTemplate";
import { KafkaPublisherConfigurationPropertiesTemplate } from "./KafkaPublisherConfigurationPropertiesTemplate";
import { KafkaMessagePublisherTemplate } from "./KafkaMessagePublisherTemplate";
import { MessagePublisherTemplate } from "../../common/MessagePublisherTemplate";

export class JavaKafkaPublisherTemplateFactory extends SimpleTemplateFactory {
    constructor(model) {
        super(
            model.channels().filterByReceive(),
            [
                (channel) => new KafkaMessagePublisherTemplate(channel),
                (channel) => new KafkaPublisherConfigurationPropertiesTemplate(channel),
                (channel) => new KafkaPublisherConfigurationTemplate(channel),
                (channel) => new MessagePublisherTemplate(channel),
            ]
        );
    }
}