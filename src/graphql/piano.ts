import { gql } from "@apollo/client";

export const STATUS = gql`
  subscription {
    pianoStatus {
      connected
      hasPlayer
      hasRecorder
      isRecording
    }
  }
`;

export const RECORDINGS = gql`{
  piano {
    recordings {
      id
      apiEndpoint
      humanCreationDate
      humanDuration
    }
  }
}`;

export class Recording {
  id: number;
  apiEndpoint: string;
  humanCreationDate: string;
  humanDuration: string;
}

export const PLAYBACK_STATUS = gql`
  subscription {
    pianoPlaybackStatus {
      isPlaying
      position {
        currentMs
        totalMs
      }
    }
  }
`;

// Returns the same recording ID on success.
export const PLAY_RECORDING = gql`
  mutation ($id: Int64!) {
    piano {
      playRecording(id: $id)
    }
  }
`;

export const RESUME_PLAYER = gql`
  mutation {
    piano {
      resumePlayer
    }
  }
`;

export const PAUSE_PLAYER = gql`
  mutation {
    piano {
      pausePlayer
    }
  }
`;
