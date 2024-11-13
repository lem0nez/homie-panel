import { Container, Overlay, Stack, Title } from "@mantine/core";
import { TbFaceIdError } from "react-icons/tb";

export default function UnauthorizedOverlay() {
  return (
    <Container hidden>
      <Overlay center blur={1}>
        <Stack align="center">
          <TbFaceIdError size={100} />
          <Title fw={500}>Authorization failed</Title>
        </Stack>
      </Overlay>
    </Container>
  );
}
