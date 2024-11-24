import { gql } from "./__generated__";

export const GLOBAL_EVENTS = gql(`
  subscription OnGlobalEvent {
    globalEvents
  }
`);
