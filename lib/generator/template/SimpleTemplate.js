import { FormatHelpers } from "@asyncapi/modelina";

export class SimpleTemplate {
    #dependencies = [];

    constructor(channel, javaBasePackage) {
        this.channel = channel;
        this.javaBasePackage = javaBasePackage;
    }

    getResult() {
        throw new Error('Method "getResult()" must be implemented.')
    }

    getType() {
        throw new Error('Method "getType()" must be implemented.')
    }

    getClassName() {
        const upperOperationId = FormatHelpers.toPascalCase(this.getOperationId());

        return `${upperOperationId}${this.getType()}`;
    }

    getOperationId() {
        return this.channel.operations()[0].id();
    }

    getPayloadClassName() {
        return FormatHelpers.toPascalCase(this.channel.operations()[0].messages()[0].payload().id());
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

    getJavaBasePackage() {
        return this.javaBasePackage;
    }
}