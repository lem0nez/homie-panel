import { useEffect, useState } from "react";
import {
  MdBattery0Bar, MdBattery1Bar, MdBattery2Bar, MdBattery3Bar, MdBattery4Bar,
  MdBattery5Bar, MdBattery6Bar, MdBatteryFull
} from "react-icons/md";
import { RiSofaLine } from "react-icons/ri";

import { Flex, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { useSubscription } from "@apollo/client";

import { handleError } from "../client";
import { Data, LOUNGE_DATA } from "../graphql/temp_monitor";

export function LoungeMonitor() {
  const [data, setData] = useState(new Data());
  const { data: subscriptionData, error } = useSubscription(LOUNGE_DATA);

  useEffect(() => {
    if (subscriptionData) setData(subscriptionData.loungeTempMonitorData);
  }, [subscriptionData]);
  useEffect(() => handleError(error), [error]);

  return TempMonitor({ title: "Lounge monitor", icon: <RiSofaLine />, data });
}

interface Props {
  title: string;
  icon: JSX.Element;
  data: Data;
}

function TempMonitor({ title, icon, data }: Props) {
  return (
    <Paper mt={10} p={15}>
      <Grid mb={15}>
        <Grid.Col span={10}>
          <Group c="gray.5">{icon}{title}</Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex justify="flex-end" c="primary">{batteryIcon(data.batteryPercents)}</Flex>
        </Grid.Col>
      </Grid>
      <Stack gap={0}>
        <Title fw={500}>{data.tempCelsius} °C</Title>
        <Text>Humidity: {data.humidityPercents} %</Text>
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
