import { Container, Overlay, Stack, Title, Transition } from "@mantine/core";
import { useEffect, useState } from "react";
import { MdErrorOutline, MdOutlinePowerSettingsNew } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";

export function ConnectErrorOverlay() {
  const [props, setProps] = useState(new Props());
  useEffect(() => {
    fetch("/api/validate", { method: "POST" }).then((response) => {
      if (response.status == 401) {
        setProps(new Props(false, <TbFaceIdError size={100} />, "Authorization failed"));
      } else if (!response.ok) {
        setProps(new Props(
          false,
          <MdErrorOutline size={100} />,
          "Server is unreachable (code " + response.status + ")",
        ));
      }
    });
  }, []);
  return MessageOverlay(props);
}

export function PoweredOffOverlay({ hidden }: { hidden: boolean; }) {
  return MessageOverlay(new Props(
    hidden,
    <MdOutlinePowerSettingsNew size={100} />,
    "Server is powered off",
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
    <Container hidden={hidden}>
      <Overlay center blur={1}>
        <Transition mounted={!hidden} transition="pop">{(styles) =>
          <Stack style={styles} align="center">
            {icon}
            <Title m={15} fw={500} style={{ textAlign: "center" }}>{message}</Title>
          </Stack>
        }</Transition>
      </Overlay>
    </Container>
  );
}