# Spring Java Template

AsyncAPI code generator template written in Node.js. Generates Spring Boot Java source files from AsyncAPI YAML specifications for Kafka-based messaging.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Generated Output](#generated-output)
- [Hooks](#hooks)
- [Usage](#usage)
- [Integration](#integration)
- [Template Parameters](#template-parameters)

## Overview

The spring-java-template is an AsyncAPI Generator template (using the React renderer, API v3) that produces Spring Boot Java source code for Kafka-based message publishing and consumption. It is consumed by the `asyncapi-generator-maven-plugin` from the sibling `api-generator` project.

Given an AsyncAPI YAML file with Kafka channels, this template generates:
- Publisher classes for sending messages to Kafka topics
- Listener classes for consuming messages from Kafka topics
- Configuration classes for Kafka producer and consumer factories
- Message type interfaces for typed message exchange

**Supported protocol: Kafka only** (validated at template processing time).

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `@asyncapi/generator` | ^2.3.0 | AsyncAPI code generator engine |
| `@asyncapi/generator-react-sdk` | ^1.1.0 | React renderer for templates |
| `@asyncapi/modelina` | ^3.7.0 | Model/code generation library |
| `@asyncapi/parser` | ^3.2.2 | AsyncAPI specification parser |
| `@asyncapi/generator-hooks` | ^0.1.0 | Template hook utilities |
| `debug` | ^4.3.6 | Debug logging |
| `rimraf` | ^5.0.0 | File cleanup |

## Directory Structure

```
spring-java-template/
├── package.json                                    # NPM package definition
├── hooks/
│   ├── pre-process.js                              # Protocol validation (Kafka only)
│   └── post-process.js                             # File reorganization into packages
├── lib/
│   ├── util.js                                     # Helpers: package resolution, file moves
│   ├── state.js                                    # In-memory file registry
│   └── generator/
│       ├── JavaKafkaGenerator.js                   # Main orchestrator
│       └── template/
│           ├── SimpleTemplate.js                   # Base template class
│           ├── SimpleTemplateFactory.js            # Template factory
│           ├── common/                             # Shared templates
│           │   ├── MessagePublisherTemplate.js
│           │   ├── MessageConsumerTemplate.js
│           │   ├── SimplePublisherTemplate.js
│           │   └── SimpleListenerTemplate.js
│           └── kafka/                              # Kafka-specific templates
│               ├── publisher/
│               │   ├── JavaKafkaPublisherTemplateFactory.js
│               │   ├── KafkaMessagePublisherTemplate.js
│               │   ├── KafkaPublisherConfigurationTemplate.js
│               │   └── KafkaPublisherConfigurationPropertiesTemplate.js
│               └── listener/
│                   ├── JavaKafkaListenerTemplateFactory.js
│                   ├── KafkaMessageListenerTemplate.js
│                   ├── KafkaListenerConfigurationTemplate.js
│                   └── KafkaListenerConfigurationPropertiesTemplate.js
├── template/
│   ├── models.js                                   # Entry point for model generation
│   └── kafkaComponents.js                          # Entry point for Kafka components
└── test/
    └── fixtures/
        └── asyncapi.yml                            # Sample AsyncAPI spec for testing
```

## Generated Output

For each AsyncAPI channel, the template generates code on both the **publisher** (producer) and **listener** (consumer) sides.

### Publisher Side (for `publish` operations)

| Generated File | Annotation | Description |
|---|---|---|
| `MessagePublisher` interface | (none) | Interface with `publish(key, payload, ...params)` method |
| `KafkaMessagePublisher` | `@Service` | Implements `MessagePublisher` using `KafkaTemplate` |
| `KafkaPublisherConfigurationProperties` | `@ConfigurationProperties` | Extends `KafkaProperties.Producer`, holds producer config |
| `KafkaPublisherConfiguration` | `@Configuration` | Defines `ProducerFactory` + `KafkaTemplate` beans |

### Listener Side (for `subscribe` operations)

| Generated File | Annotation | Description |
|---|---|---|
| `MessageConsumer` interface | (none) | `BiConsumer<Payload, Map<String, String>>` functional interface |
| `KafkaMessageListener` | `@Service` | Implements `MessageListener`, deserializes topic parameters |
| `KafkaListenerConfigurationProperties` | `@ConfigurationProperties` | Extends `KafkaProperties.Consumer`, holds consumer config |
| `KafkaListenerConfiguration` | `@Configuration` | Defines `ConsumerFactory` + `KafkaMessageListenerContainer` beans |

### Generated Java Features

- `@Generated` annotation on all generated classes
- Lombok annotations: `@Getter`, `@Setter`, `@Accessors(chain = true)`
- Jackson annotations: `@JsonProperty`, `@JsonIgnoreProperties`
- Jakarta validation: `@NotNull`, `@NotBlank`, etc.
- Spring Boot conventions: `@Service`, `@Configuration`, `@ConfigurationProperties`

## Hooks

### Pre-Process Hook (`hooks/pre-process.js`)

Validates that the AsyncAPI specification uses only the Kafka protocol. If other protocols (HTTP, WebSocket, MQTT, etc.) are detected, the template rejects the specification.

### Post-Process Hook (`hooks/post-process.js`)

Rearranges generated files into proper Java package subdirectories. The AsyncAPI generator places files in a flat output directory; this hook moves them into the package structure determined by the `javaPackage` parameter.

## Usage

### Local Testing

```bash
# Install dependencies
npm install

# Run tests (cleans, generates, and compiles)
npm run test
```

The test script runs:
1. `npm run test:clean` — Removes previous output directory
2. `npm run test:generate` — Generates code from `test/fixtures/asyncapi.yml`

### Via AsyncAPI CLI

```bash
# Generate Spring Kafka code from an AsyncAPI spec
asyncapi generate fromTemplate my-asyncapi.yaml ./ \
  -o output/ \
  -p javaPackage=com.example \
  --force-write
```

### Via Maven Plugin

The template is referenced by the `asyncapi-generator-maven-plugin` via its GitHub URL:

```
https://github.com/lllbllllb/spring-java-template
```

The Maven plugin resolves and clones the template during the `generate-sources` phase.

## Integration

### Integration with api-generator-maven-plugin

The `asyncapi-generator-maven-plugin` references this template via its default template URL. During Maven's `generate-sources` phase:

1. The plugin reads AsyncAPI YAML spec files (from local file or Maven artifact)
2. It invokes `@asyncapi/generator` with this template
3. The template processes each channel in the spec and generates Java source files
4. `api-generator-common` registers the output directory as a compile source
5. The Java files are compiled as part of the normal build

### Template Resolution

When no explicit template URL is configured, the `AsyncApiGeneratorAgent` uses the default template:

```
https://github.com/lllbllllb/spring-java-template
```

This can be overridden per-spec:

```xml
<spec>
    <template>https://github.com/custom/template</template>
    <packageName>com.example.messaging</packageName>
    <location type="file">asyncapi/my-api.yaml</location>
</spec>
```

## Template Parameters

| Parameter | Required | Description | Example |
|---|---|---|---|
| `javaPackage` | Yes | Base Java package for all generated code | `com.example.messaging` |

The `javaPackage` parameter is the only required parameter. All generated classes are placed under this package (e.g., `com.example.messaging.publisher.KafkaMessagePublisher`).
