import { CSSVariablesResolver, MantineColorsTuple, createTheme } from "@mantine/core";
import "@fontsource/raleway/latin-400.css";

const gold: MantineColorsTuple = [
  "#fdf8e5",
  "#f6efd6",
  "#eadeb0",
  "#ddcb86",
  "#d3bc63",
  "#ccb24c",
  "#c9ad3f",
  "#b29730",
  "#9e8627",
  "#887419",
];

export const variablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--mantine-tab-height": theme.other.tabHeight,
    "--mantine-max-width": theme.other.maxWidth,
  },
  dark: {},
  light: {},
});

export const theme = createTheme({
  colors: { primary: gold },
  primaryColor: "primary",
  fontFamily: "Raleway",
  other: {
    tabHeight: "2.25rem",
    maxWidth: "50rem",
  },
});
