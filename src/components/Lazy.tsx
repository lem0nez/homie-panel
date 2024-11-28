import { Box } from "@mantine/core";
import { PropsWithChildren, useRef } from "react";

interface Props {
  visible: boolean;
}

export default function Lazy({ visible, children }: PropsWithChildren<Props>) {
  const rendered = useRef(visible);
  if (!rendered.current) {
    if (visible) {
      rendered.current = true;
    } else {
      return;
    }
  }
  return <Box display={visible ? "block" : "none"}>{children}</Box>;
}
