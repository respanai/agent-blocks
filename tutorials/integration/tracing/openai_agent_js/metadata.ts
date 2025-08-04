import { Agent, BatchTraceProcessor, run, setTraceProcessors, withTrace } from '@openai/agents';
import { KeywordsAIOpenAIAgentsTracingExporter } from '@keywordsai/exporter-openai-agents';

setTraceProcessors([
  new BatchTraceProcessor(
    new KeywordsAIOpenAIAgentsTracingExporter(),
  ),
]);

const agent = new Agent({
  model: "gpt-4o-mini",
  name: "Apple Agent",
  instructions: "You are a helpful assistant who knows about apples.",
});

const secondAgent = new Agent({
  model: "gpt-4o-mini",
  name: "Banana Agent",
  instructions: "You are a helpful assistant who knows about bananas.",
});

async function main() {
  await withTrace("My Trace", async () => {
    const response = await run(agent, "Hello, what fruit do you like?");
    console.log(response.finalOutput);
    const secondResponse = await run(secondAgent, "Hello, what fruit do you like?");
    console.log(secondResponse.finalOutput);
  }, {
    metadata: {
      foo: "bar",
    }
  });
}

main().catch(console.error);