import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { useSubscription } from "@apollo/client";

import {
  MdBattery0Bar, MdBattery1Bar, MdBattery2Bar, MdBattery3Bar, MdBattery4Bar,
  MdBattery5Bar, MdBattery6Bar, MdBatteryFull
} from "react-icons/md";
import { RiSofaLine } from "react-icons/ri";

import { handleError } from "../client";
import { LOUNGE_DATA } from "../graphql/temp_monitor";
import { MiTempMonitorData } from "../__generated__/graphql";


export function LoungeMonitor() {
  const { data, error } = useSubscription(LOUNGE_DATA);
  useEffect(() => handleError(error), [error]);
  return TempMonitor({
    title: "Lounge monitor",
    icon: <RiSofaLine />,
    data: data?.loungeTempMonitorData ? data.loungeTempMonitorData : undefined,
  });
}

interface Props {
  title: string;
  icon: JSX.Element;
  data?: MiTempMonitorData;
}

function TempMonitor({ title, icon, data }: Props) {
  return (
    <Paper p="md">
      <Group wrap="nowrap">
        <Group style={{ flexGrow: 1 }} wrap="nowrap" c="gray">{icon}{title}</Group>
        <Box c="primary">{batteryIcon(data ? data.batteryPercents : 0)}</Box>
      </Group>
      <Stack mt="md" gap={0}>
        <Title fw="lighter">{data ? data.tempCelsius : "\u2013"} °C</Title>
        <Text>Humidity: {data ? data.humidityPercents : 0} %</Text>
      </Stack>
    </Paper>
  );
}

function batteryIcon(percents: number) {
  if (percents > 90) {
    return <MdBatteryFull />;
  } else if (percents > 80) {
    return <MdBattery6Bar />;
  } else if (percents > 60) {
    return <MdBattery5Bar />;
  } else if (percents > 40) {
    return <MdBattery4Bar />;
  } else if (percents > 30) {
    return <MdBattery3Bar />;
  } else if (percents > 15) {
    return <MdBattery2Bar />;
  } else if (percents > 5) {
    return <MdBattery1Bar />;
  } else {
    return <MdBattery0Bar />;
  }
}
