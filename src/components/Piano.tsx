import {
  ActionIcon, Box, Button, Container, Group, Loader, Paper, ScrollArea, Slider, Text
} from "@mantine/core";
import { useEffect, useState } from "react";
import { MdDownload, MdPause, MdPlayArrow, MdStop } from "react-icons/md";
import { RiRecordCircleLine } from "react-icons/ri";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import {
  EVENTS, PAUSE_PLAYER, PLAYBACK_STATUS, PLAY_RECORDING, RECORD, RECORDINGS, RESUME_PLAYER,
  SEEK_PLAYER, STATUS, STOP_RECORDER
} from "../graphql/piano";
import { handleError } from "../client";


export default function Piano({ height }: { height: string; }) {
  const { data: statusResponse, error: statusErr } = useSubscription(STATUS);
  useEffect(() => handleError(statusErr), [statusErr]);
  const status = statusResponse?.pianoStatus;

  const {
    data: playbackStatusResponse, error: playbackStatusErr
  } = useSubscription(PLAYBACK_STATUS);
  useEffect(() => handleError(playbackStatusErr), [playbackStatusErr]);
  const playbackStatus = playbackStatusResponse?.pianoPlaybackStatus;
  const playbackPos = playbackStatus?.position;
  const lastPlayedRecording = playbackStatus?.lastPlayedRecording;

  const [playerLoading, setPlayerLoading] = useState(false);
  const [
    playRecording, { data: playRecordingResponse, error: playRecordingErr }
  ] = useMutation(PLAY_RECORDING);
  useEffect(() => {
    playRecordingResponse && setPlayerLoading(false);
  }, [playRecordingResponse]);
  useEffect(() => {
    setPlayerLoading(false);
    handleError(playRecordingErr);
  }, [playRecordingErr]);

  const [resume, { error: resumeErr }] = useMutation(RESUME_PLAYER);
  useEffect(() => handleError(resumeErr), [resumeErr]);
  const [pause, { error: pauseErr }] = useMutation(PAUSE_PLAYER);
  useEffect(() => handleError(pauseErr), [pauseErr]);
  const [seek, { error: seekErr }] = useMutation(SEEK_PLAYER);
  useEffect(() => handleError(seekErr), [seekErr]);

  const [record, { error: recordErr }] = useMutation(RECORD);
  useEffect(() => handleError(recordErr), [recordErr]);

  const [recorderStopping, setRecorderStopping] = useState(false);
  const [
    stopRecorder, { data: stopRecorderResponse, error: stopRecorderErr }
  ] = useMutation(STOP_RECORDER);
  useEffect(() => {
    stopRecorderResponse && setRecorderStopping(false);
  }, [stopRecorderResponse]);
  useEffect(() => {
    setRecorderStopping(false);
    handleError(stopRecorderErr);
  }, [stopRecorderErr]);

  const {
    data: recordings,
    refetch: refetchRecordings,
    error: recordingsErr,
  } = useQuery(RECORDINGS);
  useEffect(() => handleError(recordingsErr), [recordingsErr]);

  const { data: eventResponse, error: eventErr } = useSubscription(EVENTS);
  useEffect(() => {
    const event = eventResponse?.pianoEvents;
    if (event == "NEW_RECORDING_SAVED" || event == "OLD_RECORDINGS_REMOVED") {
      refetchRecordings();
    }
  }, [eventResponse, refetchRecordings]);
  useEffect(() => handleError(eventErr), [eventErr]);

  const recordingsList = recordings?.piano.recordings.map(recording => {
    return (
      <Paper m="xs" p="xs" key={recording.id}>
        <Group wrap="nowrap">
          <ActionIcon variant="subtle"
            onClick={() => {
              if (playbackPos && recording.id == lastPlayedRecording?.id) {
                playbackStatus?.isPlaying ? pause() : resume();
              } else {
                setPlayerLoading(true);
                playRecording({ variables: { id: recording.id } });
              }
            }}
            disabled={!status?.hasPlayer || playerLoading}
          >
            {playbackStatus?.isPlaying && recording.id == lastPlayedRecording?.id
              ? <MdPause /> : <MdPlayArrow />}
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={() => open(recording.apiEndpoint)}>
            <MdDownload />
          </ActionIcon>
          <Text style={{ flexGrow: 1 }}>{recording.humanCreationDate}</Text>
          <Text c="gray">{recording.humanDuration}</Text>
        </Group>
      </Paper>
    );
  });

  const listHeight = `calc(${height} - 5rem)`;
  return (<>
    <ScrollArea h={listHeight}>
      <Box ta="center" h={listHeight} hidden={recordings != undefined}>
        <Loader mt={`calc(${listHeight} / 2 - var(--loader-size) / 2)`} />
      </Box>
      {recordingsList}
    </ScrollArea>

    <Container h="1.5rem" p="xs">
      <Slider
        disabled={!playbackPos}
        value={playbackPos?.currentMs}
        max={playbackPos?.totalMs ? playbackPos.totalMs : 1}
        label={playbackPos?.currentHuman}
        onChangeEnd={posMs => playbackPos && seek({ variables: { posMs } })} />
    </Container>

    <Group h="3.5rem" p="xs" pb="sm" wrap="nowrap">
      <ActionIcon variant="default" bg="transparent" bd={0}
        styles={{ loader: { background: "transparent" } }}
        loading={playerLoading}
        disabled={!playbackPos}
        onClick={() => playbackStatus?.isPlaying ? pause() : resume()}
      >
        {playbackStatus?.isPlaying ? <MdPause size="1.5rem" /> : <MdPlayArrow size="1.5rem" />}
      </ActionIcon>
      <Text style={{ flexGrow: 1 }} truncate>{
        !status?.connected
          ? "Piano isn't connected"
          : !status?.hasPlayer
            ? "Player isn't available"
            : playbackPos && lastPlayedRecording
              ? lastPlayedRecording.humanCreationDate
              : "Choose a recording"
      }</Text>
      <Button
        variant={status?.isRecording ? "filled" : "light"}
        loading={recorderStopping}
        disabled={!status?.hasRecorder}
        leftSection={
          status?.isRecording ? <MdStop size="1.2rem" /> : <RiRecordCircleLine size="1.2rem" />
        }
        onClick={() => {
          if (status?.isRecording) {
            setRecorderStopping(true);
            stopRecorder();
          } else {
            record();
          }
        }}
      >
        {status?.isRecording ? "Stop" : "Record"}
      </Button>
    </Group>
  </>);
}
