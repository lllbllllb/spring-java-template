export const MESSAGE_CONSUMER_SERVICE_TEMPLATE = (className, payloadClassName) => `
import java.util.Map;
import java.util.function.BiConsumer;

public interface ${className} extends BiConsumer<${payloadClassName}, Map<String, String>> {}
`;