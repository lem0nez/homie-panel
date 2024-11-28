import { gql } from "../__generated__";

export const GLOBAL_EVENTS = gql(`
  subscription OnGlobalEvent {
    globalEvents
  }
`);

export const PREFERENCES = gql(`
  query Preferences {
    preferences {
      hotspotHandlingEnabled
      piano {
        soundsVolume
        recordAmplitudeScale
        recordingsArtist
      }
    }
  }
`);

export const UPDATE_PREFERENCES = gql(`
  mutation UpdatePreferences(
    $hotspotHandlingEnabled: Boolean
    $pianoSoundsVolume: Float
    $pianoRecordAmplitudeScale: OptionalFloatUpdate
    $pianoRecordingsArtist: OptionalStringUpdate
  ) {
    updatePreferences(update: {
      hotspotHandlingEnabled: $hotspotHandlingEnabled
      piano: {
        soundsVolume: $pianoSoundsVolume
        recordAmplitudeScale: $pianoRecordAmplitudeScale
        recordingsArtist: $pianoRecordingsArtist
      }}
    )
  }
`);
