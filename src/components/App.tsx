import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
  ActionIcon, Box, Button, Center, Container, Dialog, Group, Modal, ScrollArea, Tabs, Text,
  useComputedColorScheme, useMantineColorScheme, useMantineTheme
} from "@mantine/core";
import { useDisclosure, useLocalStorage, useViewportSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { useEffect, useState } from "react";
import {
  MdHome, MdMusicNote, MdOutlineNightlight, MdOutlineWbSunny, MdPowerSettingsNew, MdQrCode
} from "react-icons/md";
import QRCode from "react-qr-code";
import { useSubscription } from "@apollo/client";

import classes from "./App.module.css";
import Lazy from "./Lazy";
import { ConnectErrorOverlay, PoweredOffOverlay } from "./MessageOverlay";
import { LoungeMonitor } from "./TempMonitor";
import Piano from "./Piano";

import { GLOBAL_EVENTS } from "../graphql/other";
import { handleError } from "../client";
import { getSiteAccessUrl } from "../utils";


export default function App() {
  const [contentHeight, setContentHeight] = useState("calc(100vh - var(--mantine-tab-height))");
  // Take care about the auto-hiding URL bar on mobile devices.
  const { height } = useViewportSize();
  useEffect(() => {
    if (height != 0) {
      setContentHeight("calc(" + height + "px - var(--mantine-tab-height))");
    }
  }, [height]);

  const [shareAccessModalOpened, shareAccessModal] = useDisclosure(false);
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

    fetch("/api/poweroff", { method: "POST" }).then(response => {
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

  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();
  const theme = useMantineTheme();

  return (
    <Box className={classes.body}>
      <ConnectErrorOverlay />
      <PoweredOffOverlay hidden={!poweredOff} />

      <Tabs radius={0} color="var(--switch-text-color)" value={activeTab} onChange={onTabChange}>
        <ScrollArea type="never">
          <Tabs.List className={classes.tabsList}>
            <Tabs.Tab className={classes.tab} value="home" leftSection={<MdHome />}>
              Homie Home
            </Tabs.Tab>
            <Tabs.Tab className={classes.tab} value="piano" leftSection={<MdMusicNote />}
              mr="calc(var(--mantine-tab-height) * 1.5)"
            >
              Piano
            </Tabs.Tab>
            <ActionIcon variant="default" className={classes.themeToggle}
              onClick={() => setColorScheme(colorScheme == "dark" ? "light" : "dark")}
            >
              {colorScheme == "dark" ? <MdOutlineNightlight /> : <MdOutlineWbSunny />}
            </ActionIcon>
          </Tabs.List>
        </ScrollArea>

        <Container maw="var(--mantine-max-width)" p={0}>
          <Tabs.Panel value="home" p="sm">
            <Lazy visible={activeTab == "home"}>
              <LoungeMonitor />
              <Group mt="md" grow>
                <Button variant="outline" leftSection={<MdQrCode />}
                  onClick={() => {
                    shareAccessModal.open();
                    powerOffDialog.close();
                  }}
                >
                  Share access
                </Button>
                <Button variant="outline" leftSection={<MdPowerSettingsNew />}
                  onClick={powerOffDialog.open}
                >
                  Shut down
                </Button>
              </Group>
            </Lazy>
          </Tabs.Panel>
          <Tabs.Panel value="piano">
            <Lazy visible={activeTab == "piano"}>
              <Piano height={contentHeight} />
            </Lazy>
          </Tabs.Panel>
        </Container>
      </Tabs>

      <Modal title="Site access link" size="sm" centered
        styles={{ title: { fontSize: "var(--mantine-font-size-lg)" } }}
        opened={shareAccessModalOpened} onClose={shareAccessModal.close}
      >
        <Center p="lg">
          <QRCode value={getSiteAccessUrl()}
            bgColor="transparent" fgColor={colorScheme == "dark" ? theme.white : theme.black} />
        </Center>
      </Modal>

      <Dialog opened={powerOffDialogOpened}>
        <Text>Do you really want to shut down the hub?</Text>
        <Group mt="md" grow>
          <Button loading={powerOffRequested} onClick={() => setPowerOffRequested(true)}>
            Shut down
          </Button>
          <Button variant="outline" onClick={powerOffDialog.close}>Cancel</Button>
        </Group>
      </Dialog>
    </Box>
  );
}
