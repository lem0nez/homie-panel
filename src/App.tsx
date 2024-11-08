import "@mantine/core/styles.css";
import { MantineProvider, Tabs } from "@mantine/core";
import { theme } from "./theme";
import { MdHome, MdMusicNote } from "react-icons/md";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Tabs defaultValue="home">
        <Tabs.List>
          <Tabs.Tab value="home" leftSection={<MdHome />}>Homie Home</Tabs.Tab>
          <Tabs.Tab value="piano" leftSection={<MdMusicNote />}>Piano</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="home">_</Tabs.Panel>
        <Tabs.Panel value="piano">_</Tabs.Panel>
      </Tabs>
    </MantineProvider>
  );
}
