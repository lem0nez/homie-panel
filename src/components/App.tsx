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

import classes from "./App.module.css";
import { theme } from "../theme";
import { ConnectErrorOverlay, PoweredOffOverlay } from "./MessageOverlay";
import { GLOBAL_EVENTS } from "../graphql/other";
import { handleApolloError } from "../client";

export default function App() {
  const [poweredOff, setPoweredOff] = useState(false);
  const [powerOffDialogOpened, powerOffDialog] = useDisclosure(false);

  const { data: eventsData, error: eventsError } = useSubscription(GLOBAL_EVENTS);
  useEffect(() => {
    if (eventsData != undefined && eventsData.globalEvents == "SHUTDOWN") {
      setPoweredOff(true);
    }
  }, [eventsData]);
  useEffect(() => handleApolloError(eventsError), [eventsError]);

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
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <Box className={classes.background}>
        <ConnectErrorOverlay />
        <PoweredOffOverlay hidden={!poweredOff} />

        <Tabs defaultValue="home" color="var(--mantine-color-white)">
          <Tabs.List className={classes.tabs}>
            <Tabs.Tab value="home" fz="h5" leftSection={<MdHome />}>Homie Home</Tabs.Tab>
            <Tabs.Tab value="piano" fz="h5" leftSection={<MdMusicNote />}
              onClick={() => powerOffDialog.close()}
            >
              Piano
            </Tabs.Tab>
          </Tabs.List>

          <Container p={15} maw={800}>
            <Tabs.Panel value="home">
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
            <Tabs.Panel value="piano"> </Tabs.Panel>
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
