import { ActionIcon, Group, Paper, ScrollArea, Slider, Text } from "@mantine/core";
import { useEffect } from "react";
import { MdDownload, MdPause, MdPlayArrow } from "react-icons/md";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import {
  PAUSE_PLAYER, PLAYBACK_STATUS, PLAY_RECORDING, RECORDINGS, RESUME_PLAYER, SEEK_PLAYER, STATUS
} from "../graphql/piano";
import { handleError } from "../client";


export default function Piano({ height }: { height: string; }) {
  const { data: status, error: statusErr } = useSubscription(STATUS);
  useEffect(() => handleError(statusErr), [statusErr]);

  const { data: playbackStatus, error: playbackStatusErr } = useSubscription(PLAYBACK_STATUS);
  useEffect(() => handleError(playbackStatusErr), [playbackStatusErr]);
  const isPlaying = playbackStatus?.pianoPlaybackStatus.isPlaying;
  const position = playbackStatus?.pianoPlaybackStatus.position;
  const lastPlayedRecording = playbackStatus?.pianoPlaybackStatus.lastPlayedRecording;

  const [playRecording, { error: playRecordingErr }] = useMutation(PLAY_RECORDING);
  useEffect(() => handleError(playRecordingErr), [playRecordingErr]);
  const [resume, { error: resumeErr }] = useMutation(RESUME_PLAYER);
  useEffect(() => handleError(resumeErr), [resumeErr]);
  const [pause, { error: pauseErr }] = useMutation(PAUSE_PLAYER);
  useEffect(() => handleError(pauseErr), [pauseErr]);
  const [seek, { error: seekErr }] = useMutation(SEEK_PLAYER);
  useEffect(() => handleError(seekErr), [seekErr]);

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
              if (position && recording.id == lastPlayedRecording?.id) {
                isPlaying ? pause() : resume();
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
    <ScrollArea h={`calc(${height} - 5rem)`} pb={10}>
      {recordingsList}
    </ScrollArea>
    <Slider value={position?.currentMs} max={position?.totalMs ? position.totalMs : 1}
      disabled={!position} label={humanDuration}
      onChangeEnd={millis => seek({ variables: { posMs: millis } })} />
  </>);
}

function humanDuration(millis: number) {
  const formatNum = (num: number) => Math.trunc(num).toString().padStart(2, "0");
  const secs = millis / 1000;
  return `${formatNum(secs / 60)}:${formatNum(secs % 60)}`;
}
