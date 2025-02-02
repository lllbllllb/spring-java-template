import { SimpleTemplate } from "../SimpleTemplate";

export class SimpleListenerTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getOperation() {
        return this.channel.operations().filterBySend()[0];
    }
}