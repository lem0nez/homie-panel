import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Box, Button, Container, Dialog, Group, ScrollArea, Tabs, Text } from "@mantine/core";
import { useDisclosure, useLocalStorage, useViewportSize } from "@mantine/hooks";
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
  const [contentHeight, setContentHeight] = useState("(100vh - var(--mantine-tab-height))");
  // Take care about the auto-hiding URL bar on mobile devices.
  const { height } = useViewportSize();
  useEffect(() => {
    if (height != 0) {
      setContentHeight("(" + height + "px - var(--mantine-tab-height))");
    }
  }, [height]);

  const [poweredOff, setPoweredOff] = useState(false);
  const [powerOffDialogOpened, powerOffDialog] = useDisclosure(false);

  const { data: event, error: eventErr } = useSubscription(GLOBAL_EVENTS);
  useEffect(() => {
    if (event?.globalEvents == "SHUTDOWN") {
      setPoweredOff(true);
    }
  }, [event]);
  useEffect(() => handleError(eventErr), [eventErr]);

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

  const [activeTab, setActiveTab] = useLocalStorage({
    key: "active-tab",
    defaultValue: "home",
  });

  const onTabChange = (tab: string | null) => {
    if (!tab) {
      return;
    }
    setActiveTab(tab);
    if (tab != "home") {
      powerOffDialog.close();
    }
  };

  return (
    <Box className={classes.body}>
      <ConnectErrorOverlay />
      <PoweredOffOverlay hidden={!poweredOff} />

      <Tabs radius={0} color="var(--mantine-color-white)" value={activeTab} onChange={onTabChange}>
        <ScrollArea type="never">
          <Tabs.List className={classes.tabsList}>
            <Tabs.Tab className={classes.tab} value="home" leftSection={<MdHome />}>
              Homie Home
            </Tabs.Tab>
            <Tabs.Tab className={classes.tab} value="piano" leftSection={<MdMusicNote />}>
              Piano
            </Tabs.Tab>
          </Tabs.List>
        </ScrollArea>

        <Container maw="var(--mantine-max-width)" p={0}>
          <Tabs.Panel value="home" p="sm">
            <LoungeMonitor />
            <Button mt="md" variant="outline" fullWidth leftSection={<MdPowerSettingsNew />}
              onClick={() => powerOffDialog.open()}
            >
              Shut down the hub
            </Button>
          </Tabs.Panel>
          <Tabs.Panel value="piano">
            <Piano height={contentHeight} />
          </Tabs.Panel>
        </Container>
      </Tabs>

      <Dialog opened={powerOffDialogOpened}>
        <Text>Do you really want to shut down the hub?</Text>
        <Group mt="md" grow>
          <Button loading={powerOffRequested} onClick={() => setPowerOffRequested(true)}>
            Shut down
          </Button>
          <Button variant="outline" onClick={() => powerOffDialog.close()}>Cancel</Button>
        </Group>
      </Dialog>
    </Box>
  );
}
