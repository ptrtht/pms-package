export type Provicer = 'openai';
// export const BASE_URL = 'https://app.getpromptable.com';
export const BASE_URL = 'http://localhost:5175';
export const logAICall = async ({
  input,
  output,
  provider,
  promptable_api_key,
}: {
  input: Record<string, any>;
  output: Record<string, any>;
  provider: Provicer;
  promptable_api_key: string;
}) => {
  await fetch(BASE_URL + '/api/v0/external/captureOpenaiLog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': promptable_api_key,
    },
    body: JSON.stringify({
      input,
      output,
      provider,
    }),
  });
};

export const checkOverride = async ({
  input,
  promptable_api_key,
}: {
  input: Record<string, any>;
  promptable_api_key: string;
}) => {
  const res = await fetch(BASE_URL + '/api/v0/external/checkOverride', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': promptable_api_key,
    },
    body: JSON.stringify({
      input,
    }),
  });

  //   replies with the same "input" if no override is found. Otherwise, replies with the override.
  const data = (await res.json()) as { input: Record<string, any> };

  return data.input;
};
