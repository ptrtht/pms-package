import OpenAI from 'openai';
import { makeInterceptable } from './InterceptorFactory';
import { checkOverride, logAICall } from './shared';

// Usage
export interface PromptableOptions {
  promptableKey: string;
}

export const OpenAIPMS = makeInterceptable(OpenAI, async (methodName, args, proceed, instance) => {
  if (!instance.promptable_api_key) {
    console.error('------------------------------------------');
    console.error('      ❗️ No promptable_api_key set ❗️      ');
    console.error('------------------------------------------');
    console.error('     Proceeding without intercepting...   ');
    console.error('------------------------------------------');
    return await proceed();
  }

  const input = await checkOverride({
    input: args[0],
    promptable_api_key: instance.promptable_api_key,
  });

  const result = await proceed();

  try {
    // insert into db:
    await logAICall({
      input,
      output: result,
      provider: 'openai',
      promptable_api_key: instance.promptable_api_key,
    });
  } catch (error) {
    console.error('Promptable Error: ', error);
  }

  return result;
});
