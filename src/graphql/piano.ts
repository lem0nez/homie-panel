import { gql } from "@apollo/client";

const RECORDINGS = gql`{
  piano {
    recordings {
      id
      apiEndpoint
      humanCreationDate
      humanDuration
    }
  }
}`;

const PLAY_RECORDING = gql`
  query ($id: Int64!) {
    piano {
      playRecording(id: $id)
    }
  }
`;
