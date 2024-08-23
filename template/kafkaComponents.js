import { File, Text, render, Indent } from '@asyncapi/generator-react-sdk';
import { JavaKafkaListenerGenerator } from "../lib/generator/JavaKafkaListenerGenerator";
import { JavaKafkaPublisherGenerator } from "../lib/generator/JavaKafkaPublisherGenerator";

const {getDefaultJavaPackage, getFilePackage} = require('../lib/util.js');

const javaKafkaListenerGenerator = new JavaKafkaListenerGenerator();
const javaKafkaPublisherGenerator = new JavaKafkaPublisherGenerator();

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi document object received from the generator.
 */

/**
 * Render all schema models
 * @param {RenderArgument} param0
 * @returns
 */
export default async function schemaRender({asyncapi, params}) {
    const baseJavaPackage = getDefaultJavaPackage(asyncapi, params);
    const files = [];

    javaKafkaListenerGenerator.generate(asyncapi, params).forEach(model => {
        const file = getModelFile(model, baseJavaPackage);
        files.push(file);
    });

    javaKafkaPublisherGenerator.generate(asyncapi, params).forEach(model => {
        const file = getModelFile(model, baseJavaPackage);
        files.push(file);
    });

    return files;
}

function getModelFile(model, baseJavaPackage) {
    const name = `${model.modelName}.java`;

    return <File name={name}>
        <Text newLines={2}>{getFilePackage(baseJavaPackage)}</Text>
        <Text>{model.result}</Text>
    </File>;
}