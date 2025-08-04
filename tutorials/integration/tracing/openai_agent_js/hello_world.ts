import { Agent, BatchTraceProcessor, run, setTraceProcessors, withTrace } from '@openai/agents';
import { KeywordsAIOpenAIAgentsTracingExporter } from '@keywordsai/exporter-openai-agents';

setTraceProcessors([
  new BatchTraceProcessor(
    new KeywordsAIOpenAIAgentsTracingExporter(),
  ),
]);

async function main() {
  const agent = new Agent({
    name: 'Assistant',
    instructions: 'You only respond in haikus.',
  });

  const result = await withTrace('Hello World', async () => {
    return run(agent, 'Tell me about recursion in programming.');
  });
  console.log(result.finalOutput);
}

main().catch(console.error);