import { File, Text } from '@asyncapi/generator-react-sdk';
import { JavaKafkaGenerator } from "../lib/generator/JavaKafkaGenerator";

const {getDefaultJavaPackage, getFilePackage} = require('../lib/util.js');

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
    const baseJavaPackage = getDefaultJavaPackage(asyncapi, params) + '.generated';

    return new JavaKafkaGenerator(asyncapi).generate()
        .map(model => getModelFile(model, baseJavaPackage));
}

function getModelFile(model, baseJavaPackage) {
    const name = `${model.modelName}.java`;

    return <File name={name}>
        <Text newLines={2}>{getFilePackage(baseJavaPackage)}</Text>
        <Text>{model.result}</Text>
    </File>;
}