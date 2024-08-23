import { File, Text, render, Indent } from '@asyncapi/generator-react-sdk';
import { JavaCommonConsumerGenerator } from "../lib/generator/JavaCommonConsumerGenerator";
import { JavaCommonPublisherGenerator } from "../lib/generator/JavaCommonPublisherGenerator";

const {getDefaultJavaPackage, getFilePackage} = require('../lib/util.js');

const javaCommonConsumerGenerator = new JavaCommonConsumerGenerator();
const javaCommonPublisherGenerator = new JavaCommonPublisherGenerator();

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

    javaCommonConsumerGenerator.generate(asyncapi, params).forEach(model => {
        const file = getModelFile(model, baseJavaPackage);
        files.push(file);
    });

    javaCommonPublisherGenerator.generate(asyncapi, params).forEach(model => {
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