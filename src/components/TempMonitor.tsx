import { Flex, Grid, Paper, Stack, Text, Title } from "@mantine/core";
import {
  MdBattery0Bar, MdBattery1Bar, MdBattery2Bar, MdBattery3Bar, MdBattery4Bar,
  MdBattery5Bar, MdBattery6Bar, MdBatteryFull
} from "react-icons/md";

function TempMonitor() {
  return (
    <Paper p={15}>
      <Grid mb={15}>
        <Grid.Col span={10}>
          <Text c="gray.5">Temperature and humidity monitor</Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex justify="flex-end" c="gold">{batteryIcon(0)}</Flex>
        </Grid.Col>
      </Grid>
      <Stack gap={0}>
        <Title fw={500}>0 °C</Title>
        <Text>Humidity: 0 %</Text>
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
