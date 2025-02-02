import { SimpleTemplate } from "../SimpleTemplate";

export class SimplePublisherTemplate extends SimpleTemplate {
    constructor(channel, javaBasePackage) {
        super(channel, javaBasePackage);
    }

    getOperation() {
        return this.channel.operations().filterByReceive()[0];
    }
}