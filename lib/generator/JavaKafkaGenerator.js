import { ConstrainedAnyModel, OutputModel } from "@asyncapi/modelina";
import { JavaKafkaListenerTemplateFactory } from "./template/kafka/listener/JavaKafkaListenerTemplateFactory";
import { JavaKafkaPublisherTemplateFactory } from "./template/kafka/publisher/JavaKafkaPublisherTemplateFactory";

export class JavaKafkaGenerator {

    constructor(model) {
        this.model = model;
        this.listenerTemplatesFactory = new JavaKafkaListenerTemplateFactory(model);
        this.publisherTemplatesFactory = new JavaKafkaPublisherTemplateFactory(model);
    }

    generate() {
        return [
            ...this.listenerTemplatesFactory.getTemplates(),
            ...this.publisherTemplatesFactory.getTemplates()
        ]
            .map(template => {
                return OutputModel.toOutputModel({
                    result: template.getResult(),
                    model: new ConstrainedAnyModel(template.getOperationId(), template.getChannel(), {}, template.getType()),
                    modelName: template.getClassName(),
                    inputModel: this.model,
                    dependencies: []
                });
            })
    }
}