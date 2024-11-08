import { Flex, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { IconType } from "react-icons";
import {
  MdBattery0Bar, MdBattery1Bar, MdBattery2Bar, MdBattery3Bar, MdBattery4Bar,
  MdBattery5Bar, MdBattery6Bar, MdBatteryFull
} from "react-icons/md";

export default function TempMonitor() {
  return (
    <Paper p={15}>
      <Grid mb={15}>
        <Grid.Col span={10}>
          <Text c="gray.5">Lounge Temperature and Humidity Monitor</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex justify="flex-end" c="gold">
            <MdBattery0Bar />
          </Flex>
        </Grid.Col>
      </Grid>
      <Stack gap={0}>
        <Title fw={500}>&#x2013; °C</Title>
        <Text>Humidity: &#x2013; %</Text>
      </Stack>
    </Paper>
  );
}

function getBatteryIcon(percents: number): IconType {
  if (percents > 90) {
    return MdBatteryFull;
  } else if (percents > 80) {
    return MdBattery6Bar;
  } else if (percents > 60) {
    return MdBattery5Bar;
  } else if (percents > 40) {
    return MdBattery4Bar;
  } else if (percents > 30) {
    return MdBattery3Bar;
  } else if (percents > 15) {
    return MdBattery2Bar;
  } else if (percents > 5) {
    return MdBattery1Bar;
  } else {
    return MdBattery0Bar;
  }
}
