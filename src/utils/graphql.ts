import { notifications } from '@mantine/notifications'
import { ExecutionResult } from 'graphql'
import { createClient } from 'graphql-ws'

type Result<Data> = ExecutionResult<Data>

class Error {
  message: string
  code?: string
}

const client = createClient({
  url: window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    + window.location.host
    + '/api/graphql'
})

export async function query<Data>(
  query: string,
  variables?: Record<string, unknown>,
  dataCallback?: (data: Data) => void,
  errorCallback?: (error: Error) => void
) {
  const resultIter: AsyncIterableIterator<Result<Data>> = client.iterate({ query, variables })
  try {
    for await (const result of resultIter) {
      if (result.errors != undefined) {
        result.errors.forEach((graphqlError) => {
          const error = new Error();
          error.message = graphqlError.message
          if (graphqlError.extensions?.code != undefined) {
            error.code = graphqlError.extensions.code as string
          }

          errorCallback?.(error)
          notifyError(error.message)
        })
      }
      if (result.data != undefined) {
        dataCallback?.(result.data)
      }
    }
  } catch (err) {
    console.error(err)
    notifyError('Server is unreachable')
  }

}

function notifyError(message: string) {
  notifications.show({
    color: 'red',
    title: 'Error',
    message
  })
}
