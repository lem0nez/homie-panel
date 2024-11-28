import { Box, Overlay, Stack, Title, Transition } from "@mantine/core";
import { useEffect, useState } from "react";
import { MdErrorOutline, MdOutlinePowerSettingsNew } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";

const iconSize = 96;

export function ConnectErrorOverlay() {
  const [props, setProps] = useState(new Props());
  useEffect(() => {
    fetch("/api/validate", { method: "POST" }).then((response) => {
      if (response.status == 401) {
        setProps(new Props(false, <TbFaceIdError size={iconSize} />, "Authorization failed"));
      } else if (!response.ok) {
        setProps(new Props(
          false,
          <MdErrorOutline size={iconSize} />,
          "Hub is unreachable (code " + response.status + ")",
        ));
      }
    });
  }, []);
  return MessageOverlay(props);
}

export function PoweredOffOverlay({ hidden }: { hidden: boolean; }) {
  return MessageOverlay(new Props(
    hidden,
    <MdOutlinePowerSettingsNew size={iconSize} />,
    "Hub is shut down",
  ));
}

class Props {
  hidden: boolean;
  icon: JSX.Element;
  message: string;

  constructor(hidden = true, icon = <></>, message = "") {
    this.hidden = hidden;
    this.icon = icon;
    this.message = message;
  }
}

function MessageOverlay({ hidden, icon, message }: Props) {
  return (
    <Box hidden={hidden}>
      <Transition mounted={!hidden}>{(styles) =>
        <Overlay c="white" style={styles} center>
          <Stack align="center">
            {icon}
            <Title m="md" fw="lighter" style={{ textAlign: "center" }}>{message}</Title>
          </Stack>
        </Overlay>
      }</Transition>
    </Box>
  );
}
