export class SimpleTemplateFactory {
    templates = [];

    constructor(channels, templateFunctions) {
        this.templates = channels
            .flatMap(channel => {
                const channelTemplates = templateFunctions
                    .map(templateFunction => templateFunction(channel))

                channelTemplates.forEach(template => template.setDependencies(channelTemplates));

                return channelTemplates;
            });
    }

    getTemplates() {
        return this.templates;
    }
}