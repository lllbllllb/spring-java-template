import { FormatHelpers } from "@asyncapi/modelina";

export class SimpleTemplate {
    #dependencies = [];

    constructor(channel, classSuffix) {
        this.channel = channel;
        this.classSuffix = classSuffix;
    }

    getResult() {
        throw new Error('Method "getResult()" must be implemented.')
    }

    getClassName() {
        const upperOperationId = FormatHelpers.toPascalCase(this.getOperationId());;

        return `${upperOperationId}${this.classSuffix}`;
    }

    getOperationId() {
        return this.channel.operations()[0].id();
    }

    getPayloadClassName() {
        return FormatHelpers.toPascalCase(this.channel.operations()[0].messages()[0].payload().id());
    }

    getType() {
        return this.classSuffix;
    }

    setDependencies(dependencies) {
        this.#dependencies.push(...dependencies);
    }

    getDependencyByType(type) {
        return this.#dependencies.find(dependency => dependency.getType() === type);
    }

    getChannel() {
        return this.channel;
    }
}