import { createClient } from "graphqurl";

class Response<Type> {
  data: Type | undefined;
  errors: Error[] | undefined;
}

class Error {
  message: string;
  extensions: Extensions;
}

class Extensions {
  code: string;
}

const client = createClient({
  endpoint: '/api/graphql',
  websocket: {
    endpoint:
      window.location.protocol === 'https:' ? 'wss://' : 'ws://'
        + window.location.host
        + '/api/graphql',
  }
});

async function query<Type>(
  query: string, variables?: Record<string, unknown>
): Promise<Response<Type>> {
  let response = {} as Response<Type>;
  await client.query({ query, variables })
    .catch((err) => response = err)
    .then((val) => response = val);
  return response;
}
