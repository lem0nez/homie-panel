import { gql } from "../__generated__";

export const EVENTS = gql(`
  subscription OnPianoEvent {
    pianoEvents
  }
`);

export const STATUS = gql(`
  subscription OnPianoStatus {
    pianoStatus {
      connected
      hasPlayer
      hasRecorder
      isRecording
    }
  }
`);

export const PLAYBACK_STATUS = gql(`
  subscription OnPianoPlaybackStatus {
    pianoPlaybackStatus {
      isPlaying
      lastPlayedRecording {
        id
        humanCreationDate
      }
      position {
        currentMs
        currentHuman
        totalMs
      }
    }
  }
`);

export const RECORDINGS = gql(`
  query Recordings {
    piano {
      recordings {
        id
        apiEndpoint
        humanCreationDate
        humanDuration
      }
    }
  }
`);

export const PLAY_RECORDING = gql(`
  mutation PlayRecording($id: Int64!) {
    piano {
      playRecording(id: $id)
    }
  }
`);

export const RESUME_PLAYER = gql(`
  mutation ResumePlayer {
    piano { resumePlayer }
  }
`);

export const PAUSE_PLAYER = gql(`
  mutation PausePlayer {
    piano { pausePlayer }
  }
`);

export const SEEK_PLAYER = gql(`
  mutation SeekPlayer($posMs: Int!) {
    piano {
      seekPlayerToPosition(posMs: $posMs)
    }
  }
`);

export const RECORD = gql(`
  mutation Record {
    piano { record }
  }
`);

export const STOP_RECORDER = gql(`
  mutation StopRecorder {
    piano {
      stopRecorder { id }
    }
  }
`);
