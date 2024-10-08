import { File, Text } from '@asyncapi/generator-react-sdk';
import {
    FormatHelpers,
    JAVA_COMMON_PRESET,
    JAVA_CONSTRAINTS_PRESET,
    JAVA_JACKSON_PRESET,
    JavaGenerator
} from '@asyncapi/modelina';

const {getDefaultJavaPackage, getFilePackage} = require('../lib/util.js');
const {addFile} = require('../lib/state.js');

const javaGenerator = new JavaGenerator({
    processorOptions: {
        interpreter: {
            ignoreAdditionalProperties: true
        }
    },
    collectionType: "List",
    presets: [
        {
            preset: JAVA_COMMON_PRESET,
            options: {
                classToString: true
            }
        },
        {
            preset: JAVA_CONSTRAINTS_PRESET,
            options: {
                useJakarta: true
            }
        },
        {
            preset: JAVA_JACKSON_PRESET
        }
    ]
});

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
    const models = await javaGenerator.generate(asyncapi);
    const files = [];

    for (const model of models) {
        files.push(getModelFile(model, baseJavaPackage));
    }

    return files;
}

function getModelFile(model, baseJavaPackage) {
    const name = `${FormatHelpers.toPascalCase(model.modelName)}.java`;

    addFile('model', name);

    return <File name={name}>
        <Text newLines={2}>{getFilePackage(baseJavaPackage, 'model')}</Text>
        <Text>{'import javax.annotation.processing.Generated;'}</Text>
        <List list={model.dependencies} newLines={1}/>
        <LombokFluent result={model.result}/>
        <Text>{`@Generated(value="com.asyncapi.generator.spring.java.template", date="${new Date().toUTCString()}")`}</Text>
        <Text newLines={2}>{model.result} </Text>
    </File>;
}

function List({list = [], newLines = 1}) {
    return <Text newLines={newLines}>
        {list.map(item => <Text newLines={1}>{item}</Text>)}
    </Text>
}

function LombokFluent({result, newLines = 0}) {
    if (result.match(/^\s*public\s+enum\s+.+$/gm)) {
        return <Text newLines={0}/>
    }

    return <Text newLines={newLines}>
        <Text newLines={1}>@lombok.Getter</Text>
        <Text newLines={1}>@lombok.Setter</Text>
        <Text newLines={1}>@lombok.experimental.Accessors(fluent=true)</Text>
    </Text>
}