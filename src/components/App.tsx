import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import {
  Box, Button, Container, Dialog, MantineProvider, SimpleGrid, Tabs, Text
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { MdHome, MdMusicNote, MdPowerSettingsNew } from "react-icons/md";

import { useEffect, useState } from "react";
import { useSubscription } from "@apollo/client";

import classes from "./App.module.css";
import { theme } from "../theme";
import { ConnectErrorOverlay, PoweredOffOverlay } from "./MessageOverlay";
import { GLOBAL_EVENTS } from "../graphql/other";
import { handleApolloError } from "../client";

export default function App() {
  const [
    shutdownDialogOpened,
    { open: openShutdownDialog, close: closeShutdownDialog }
  ] = useDisclosure(false);

  const [poweredOff, setPoweredOff] = useState(false);
  const { data, error } = useSubscription(GLOBAL_EVENTS);
  useEffect(() => {
    if (data != undefined && data.globalEvents == "SHUTDOWN") {
      setPoweredOff(true);
    }
  }, [data]);
  useEffect(() => handleApolloError(error), [error]);

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
              onClick={closeShutdownDialog}
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
                onClick={openShutdownDialog}
              >
                Shut down the server
              </Button>
            </Tabs.Panel>
            <Tabs.Panel value="piano"> </Tabs.Panel>
          </Container>
        </Tabs>

        <Dialog opened={shutdownDialogOpened}>
          <Text>Do you really want to shut down the server?</Text>
          <SimpleGrid mt={15} cols={2}>
            <Button>Shut down</Button>
            <Button variant="outline" onClick={closeShutdownDialog}>Cancel</Button>
          </SimpleGrid>
        </Dialog>
      </Box>
    </MantineProvider>
  );
}
