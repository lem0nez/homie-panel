import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import {
  Box, Button, Container, Dialog, MantineProvider, SimpleGrid, Tabs, Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications, Notifications } from "@mantine/notifications";

import { useEffect, useState } from "react";
import { MdHome, MdMusicNote, MdPowerSettingsNew } from "react-icons/md";
import { useSubscription } from "@apollo/client";

import { theme, variablesResolver } from "../theme";
import { GLOBAL_EVENTS } from "../graphql/other";
import { handleError } from "../client";

import classes from "./App.module.css";
import { ConnectErrorOverlay, PoweredOffOverlay } from "./MessageOverlay";
import { LoungeMonitor } from "./TempMonitor";
import Piano from "./Piano";

export default function App() {
  const [poweredOff, setPoweredOff] = useState(false);
  const [powerOffDialogOpened, powerOffDialog] = useDisclosure(false);

  const { data: eventsData, error: eventsError } = useSubscription(GLOBAL_EVENTS);
  useEffect(() => {
    if (eventsData?.globalEvents == "SHUTDOWN") {
      setPoweredOff(true);
    }
  }, [eventsData]);
  useEffect(() => handleError(eventsError), [eventsError]);

  const [powerOffRequested, setPowerOffRequested] = useState(false);
  useEffect(() => {
    if (!powerOffRequested) {
      return;
    }

    fetch("/api/poweroff", { method: "POST" }).then((response) => {
      powerOffDialog.close();
      setPowerOffRequested(false);

      if (response.ok) {
        setPoweredOff(true);
      } else {
        notifications.show({
          title: "Shutdown request failed",
          message: response.statusText,
          color: "red",
        });
      }
    });
  }, [powerOffRequested, powerOffDialog]);

  return (
    <MantineProvider theme={theme} cssVariablesResolver={variablesResolver}
      defaultColorScheme="dark"
    >
      <Notifications />
      <Box className={classes.body}>
        <ConnectErrorOverlay />
        <PoweredOffOverlay hidden={!poweredOff} />

        <Tabs defaultValue="home" color="var(--mantine-color-white)">
          <Tabs.List className={classes.tabs}>
            <Tabs.Tab h="var(--mantine-tab-height)" fz="h5"
              value="home" leftSection={<MdHome />}
            >
              Homie Home
            </Tabs.Tab>
            <Tabs.Tab h="var(--mantine-tab-height)" fz="h5"
              value="piano" leftSection={<MdMusicNote />} onClick={() => powerOffDialog.close()}
            >
              Piano
            </Tabs.Tab>
          </Tabs.List>

          <Container maw={800}>
            <Tabs.Panel value="home">
              <LoungeMonitor />
              <Button
                mt={20}
                variant="outline"
                leftSection={<MdPowerSettingsNew />}
                fullWidth
                onClick={() => powerOffDialog.open()}
              >
                Shut down the hub
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="piano">
              <Piano />
            </Tabs.Panel>
          </Container>
        </Tabs>

        <Dialog opened={powerOffDialogOpened}>
          <Text>Do you really want to shut down the hub?</Text>
          <SimpleGrid mt={15} cols={2}>
            <Button loading={powerOffRequested} onClick={() => setPowerOffRequested(true)}>
              Shut down
            </Button>
            <Button variant="outline" onClick={() => powerOffDialog.close()}>Cancel</Button>
          </SimpleGrid>
        </Dialog>
      </Box>
    </MantineProvider>
  );
}
