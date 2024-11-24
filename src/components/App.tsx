import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Box, Button, Container, Dialog, SimpleGrid, Tabs, Text } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { useEffect, useState } from "react";
import { MdHome, MdMusicNote, MdPowerSettingsNew } from "react-icons/md";
import { useSubscription } from "@apollo/client";

import classes from "./App.module.css";
import { ConnectErrorOverlay, PoweredOffOverlay } from "./MessageOverlay";
import { LoungeMonitor } from "./TempMonitor";
import Piano from "./Piano";

import { GLOBAL_EVENTS } from "../graphql/other";
import { handleError } from "../client";


export default function App() {
  const [poweredOff, setPoweredOff] = useState(false);
  const [powerOffDialogOpened, powerOffDialog] = useDisclosure(false);

  const { data: events, error: eventsError } = useSubscription(GLOBAL_EVENTS);
  useEffect(() => {
    if (events?.globalEvents == "SHUTDOWN") {
      setPoweredOff(true);
    }
  }, [events]);
  useEffect(() => handleError(eventsError), [eventsError]);

  const [powerOffRequested, setPowerOffRequested] = useState(false);
  useEffect(() => {
    if (!powerOffRequested) return;

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

  const [activeTab, setActiveTab] = useLocalStorage({
    key: "active-tab",
    defaultValue: "home",
  });

  const onTabChange = (tab: string | null) => {
    if (!tab) return;
    setActiveTab(tab);
    if (tab != "home") powerOffDialog.close();
  };

  return (
    <Box className={classes.body}>
      <ConnectErrorOverlay />
      <PoweredOffOverlay hidden={!poweredOff} />

      <Tabs color="var(--mantine-color-white)" value={activeTab} onChange={onTabChange}>
        <Tabs.List className={classes.tabsList}>
          <Tabs.Tab className={classes.tab} value="home" leftSection={<MdHome />}>
            Homie Home
          </Tabs.Tab>
          <Tabs.Tab className={classes.tab} value="piano" leftSection={<MdMusicNote />}>
            Piano
          </Tabs.Tab>
        </Tabs.List>

        <Container maw={800}>
          <Tabs.Panel value="home" pt={15}>
            <LoungeMonitor />
            <Button mt={15} variant="outline" leftSection={<MdPowerSettingsNew />} fullWidth
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
  );
}
