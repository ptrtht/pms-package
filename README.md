## Promptable Core

### Usage:

```js
import { OpenAI } from '@getpromptable/core';
// import { OpenAI } from 'openai'; // interchangable!
import { key } from './key.js';

const client = new OpenAI({
  apiKey: key,
});
client.promptable_api_key = 'YOUR API KEY';

async function generateText(prompt) {
  try {
    // everything is the same as the OpenAI API. All methods are the same.
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage example
const prompt = 'What is the capital of France?';

generateText(prompt)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```
