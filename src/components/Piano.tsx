import { ActionIcon, Group, Paper, ScrollArea, Text } from "@mantine/core";
import { useEffect } from "react";
import { MdDownload, MdPause, MdPlayArrow } from "react-icons/md";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import {
  PAUSE_PLAYER, PLAYBACK_STATUS, PLAY_RECORDING, RECORDINGS, RESUME_PLAYER, STATUS
} from "../graphql/piano";
import { handleError } from "../client";


export default function Piano() {
  const { data: status, error: statusErr } = useSubscription(STATUS);
  useEffect(() => handleError(statusErr), [statusErr]);

  const { data: playbackStatus, error: playbackStatusErr } = useSubscription(PLAYBACK_STATUS);
  useEffect(() => handleError(playbackStatusErr), [playbackStatusErr]);
  const isPlaying = playbackStatus?.pianoPlaybackStatus.isPlaying;
  const lastPlayedRecording = playbackStatus?.pianoPlaybackStatus.lastPlayedRecording;

  const [playRecording, { error: playRecordingErr }] = useMutation(PLAY_RECORDING);
  useEffect(() => handleError(playRecordingErr), [playRecordingErr]);

  const [resumePlayer, { error: resumePlayerErr }] = useMutation(RESUME_PLAYER);
  useEffect(() => handleError(resumePlayerErr), [resumePlayerErr]);

  const [pausePlayer, { error: pausePlayerErr }] = useMutation(PAUSE_PLAYER);
  useEffect(() => handleError(pausePlayerErr), [pausePlayerErr]);

  const {
    data: recordings,
    refetch: refetchRecordings,
    error: recordingsErr,
  } = useQuery(RECORDINGS);
  useEffect(() => handleError(recordingsErr), [recordingsErr]);

  const recordingsList = recordings?.piano.recordings.map(recording => {
    return (
      <Paper mt={10} p={10} key={recording.id}>
        <Group>
          <ActionIcon
            onClick={() => {
              if (recording.id == lastPlayedRecording?.id) {
                isPlaying ? pausePlayer() : resumePlayer();
              } else {
                playRecording({ variables: { id: recording.id } });
              }
            }}
            disabled={!status?.pianoStatus.hasPlayer}
          >
            {isPlaying && recording.id == lastPlayedRecording?.id ? <MdPause /> : <MdPlayArrow />}
          </ActionIcon>
          <ActionIcon onClick={() => open(recording.apiEndpoint)}>
            <MdDownload />
          </ActionIcon>
          <Text style={{ flexGrow: 1 }}>{recording.humanCreationDate}</Text>
          <Text c="gray">{recording.humanDuration}</Text>
        </Group>
      </Paper>
    );
  });

  return (<>
    <ScrollArea h="calc(100vh - var(--mantine-tab-height))" pb={10}>
      {recordingsList}
    </ScrollArea>
  </>);
}
