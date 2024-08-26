import { File, Text } from '@asyncapi/generator-react-sdk';
import { JavaKafkaGenerator } from "../lib/generator/JavaKafkaGenerator";

const {getDefaultJavaPackage, getFilePackage} = require('../lib/util.js');
const {addFile} = require('../lib/state.js');

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

    return new JavaKafkaGenerator(asyncapi, baseJavaPackage).generate()
        .map(model => getModelFile(model, baseJavaPackage));
}

function getModelFile(model, baseJavaPackage) {
    const subDir = model.model.name.toLowerCase();
    const name = `${model.modelName}.java`;

    addFile(subDir, name);

    return <File name={name}>
        <Text newLines={2}>{getFilePackage(baseJavaPackage, subDir)}</Text>
        <Text>{model.result}</Text>
    </File>;
}