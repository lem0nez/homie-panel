import { gql } from "@apollo/client";

export const GLOBAL_EVENTS = gql`
  subscription {
    globalEvents
  }
`;
