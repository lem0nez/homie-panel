import {
  ActionIcon, Container, Flex, Grid, Group, Paper, ScrollArea, Slider, Text
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdDownload, MdPause, MdPlayArrow } from "react-icons/md";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import {
  PAUSE_PLAYER, PLAYBACK_STATUS, PLAY_RECORDING, RECORDINGS, RESUME_PLAYER, Recording, STATUS
} from "../graphql/piano";
import { handleError } from "../client";

export default function Piano() {
  const [selectedRecordingId, setSelectedRecordingId] = useState<number>();
  const [isPlaying, setPlaying] = useState(false);

  const { data: status, error: statusError } = useSubscription(STATUS);
  useEffect(() => handleError(statusError), [statusError]);

  const { data: playbackStatus, error: playbackStatusError } = useSubscription(PLAYBACK_STATUS);
  useEffect(() => {
    const status = playbackStatus?.pianoPlaybackStatus;
    if (status) {
      setPlaying(status.isPlaying);
      if (!status.position) {
        setSelectedRecordingId(undefined);
      }
    }
  }, [playbackStatus]);
  useEffect(() => handleError(playbackStatusError), [playbackStatusError]);

  const [
    playRecording,
    { data: playRecordingResult, error: playRecordingError }
  ] = useMutation(PLAY_RECORDING);
  useEffect(() => {
    if (playRecordingResult) {
      setSelectedRecordingId(playRecordingResult.piano.playRecording);
      setPlaying(true);
    }
  }, [playRecordingResult]);
  useEffect(() => handleError(playRecordingError), [playRecordingError]);

  const [
    resumePlayer,
    { data: resumePlayerResult, error: resumePlayerError }
  ] = useMutation(RESUME_PLAYER);
  useEffect(() => {
    if (resumePlayerResult) setPlaying(true);
  }, [resumePlayerResult]);
  useEffect(() => handleError(resumePlayerError), [resumePlayerError]);

  const [
    pausePlayer,
    { data: pausePlayerResult, error: pausePlayerError }
  ] = useMutation(PAUSE_PLAYER);
  useEffect(() => {
    if (pausePlayerResult) setPlaying(false);
  }, [pausePlayerResult]);
  useEffect(() => handleError(pausePlayerError), [pausePlayerError]);

  const {
    data: recordings,
    refetch: refetchRecordings,
    error: recordingsError,
  } = useQuery(RECORDINGS);
  useEffect(() => handleError(recordingsError), [recordingsError]);

  const recordingsList = recordings?.piano.recordings.map((recording: Recording) => {
    return (
      <Paper mt={10} p={10}>
        <Group>
          <ActionIcon
            onClick={() => {
              if (recording.id == selectedRecordingId) {
                if (isPlaying) {
                  pausePlayer();
                } else {
                  resumePlayer();
                }
              } else {
                playRecording({ variables: { "id": recording.id } });
              }
            }}
            disabled={!status?.pianoStatus.hasPlayer}
          >
            {isPlaying && recording.id == selectedRecordingId ? <MdPause /> : <MdPlayArrow />}
          </ActionIcon>
          <ActionIcon onClick={() => open(recording.apiEndpoint)}>
            <MdDownload />
          </ActionIcon>
          <Grid style={{ flexGrow: 1 }}>
            <Grid.Col span={10}>
              <Text>{recording.humanCreationDate}</Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Flex justify="flex-end">
                <Text c="gray">{recording.humanDuration}</Text>
              </Flex>
            </Grid.Col>
          </Grid>
        </Group>
      </Paper>
    );
  });

  return (
    <>
      <ScrollArea h="calc(100vh - var(--mantine-tab-height) - 5em)" pb={10}>
        {recordingsList}
      </ScrollArea>
      <Container h="5em">
        <Slider disabled={!playbackStatus?.pianoPlaybackStatus.position}
          max={playbackStatus?.pianoPlaybackStatus.position?.totalMs}
          value={playbackStatus?.pianoPlaybackStatus.position?.currentMs} />
      </Container>
    </>
  );
}
