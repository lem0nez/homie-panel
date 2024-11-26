import {
  ActionIcon, Button, Container, Group, Paper, ScrollArea, Slider, Text
} from "@mantine/core";
import { useEffect } from "react";
import { MdDownload, MdPause, MdPlayArrow, MdStop } from "react-icons/md";
import { RiRecordCircleLine } from "react-icons/ri";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import {
  EVENTS, PAUSE_PLAYER, PLAYBACK_STATUS, PLAY_RECORDING, RECORD, RECORDINGS, RESUME_PLAYER,
  SEEK_PLAYER, STATUS, STOP_RECORDER
} from "../graphql/piano";
import { handleError } from "../client";


export default function Piano({ height }: { height: string; }) {
  const { data: status, error: statusErr } = useSubscription(STATUS);
  useEffect(() => handleError(statusErr), [statusErr]);
  const isRecording = status?.pianoStatus.isRecording;

  const { data: playbackStatus, error: playbackStatusErr } = useSubscription(PLAYBACK_STATUS);
  useEffect(() => handleError(playbackStatusErr), [playbackStatusErr]);
  const isPlaying = playbackStatus?.pianoPlaybackStatus.isPlaying;
  const playbackPos = playbackStatus?.pianoPlaybackStatus.position;
  const lastPlayedRecording = playbackStatus?.pianoPlaybackStatus.lastPlayedRecording;

  const [playRecording, { error: playRecordingErr }] = useMutation(PLAY_RECORDING);
  useEffect(() => handleError(playRecordingErr), [playRecordingErr]);
  const [resume, { error: resumeErr }] = useMutation(RESUME_PLAYER);
  useEffect(() => handleError(resumeErr), [resumeErr]);
  const [pause, { error: pauseErr }] = useMutation(PAUSE_PLAYER);
  useEffect(() => handleError(pauseErr), [pauseErr]);
  const [seek, { error: seekErr }] = useMutation(SEEK_PLAYER);
  useEffect(() => handleError(seekErr), [seekErr]);

  const [record, { error: recordErr }] = useMutation(RECORD);
  useEffect(() => handleError(recordErr), [recordErr]);
  const [stopRecorder, { error: stopRecorderErr }] = useMutation(STOP_RECORDER);
  useEffect(() => handleError(stopRecorderErr), [stopRecorderErr]);

  const {
    data: recordings,
    refetch: refetchRecordings,
    error: recordingsErr,
  } = useQuery(RECORDINGS);
  useEffect(() => handleError(recordingsErr), [recordingsErr]);

  const { data: event, error: eventErr } = useSubscription(EVENTS);
  useEffect(() => {
    const pianoEvent = event?.pianoEvents;
    if (pianoEvent == "NEW_RECORDING_SAVED" || pianoEvent == "OLD_RECORDINGS_REMOVED") {
      refetchRecordings();
    }
  }, [event, refetchRecordings]);
  useEffect(() => handleError(eventErr), [eventErr]);

  const recordingsList = recordings?.piano.recordings.map(recording => {
    return (
      <Paper m="xs" p="xs" key={recording.id}>
        <Group wrap="nowrap">
          <ActionIcon variant="subtle"
            onClick={() => {
              if (playbackPos && recording.id == lastPlayedRecording?.id) {
                isPlaying ? pause() : resume();
              } else {
                playRecording({ variables: { id: recording.id } });
              }
            }}
            disabled={!status?.pianoStatus.hasPlayer}
          >
            {isPlaying && recording.id == lastPlayedRecording?.id ? <MdPause /> : <MdPlayArrow />}
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

  return (<>
    <ScrollArea h={`calc(${height} - 5rem)`}>
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
        disabled={!playbackPos}
        onClick={() => isPlaying ? pause() : resume()}
      >
        {isPlaying ? <MdPause size="1.5rem" /> : <MdPlayArrow size="1.5rem" />}
      </ActionIcon>
      <Text style={{ flexGrow: 1 }} truncate>{
        !status?.pianoStatus.connected
          ? "Piano not connected"
          : playbackPos && lastPlayedRecording
            ? lastPlayedRecording.humanCreationDate
            : "Choose a recording"
      }</Text>
      <Button
        variant={isRecording ? "filled" : "light"}
        disabled={!status?.pianoStatus.hasRecorder}
        leftSection={
          isRecording ? <MdStop size="1.2rem" /> : <RiRecordCircleLine size="1.2rem" />
        }
        onClick={() => isRecording ? stopRecorder() : record()}
      >
        {isRecording ? "Stop" : "Record"}
      </Button>
    </Group>
  </>);
}
