import { MantineColorsTuple, createTheme } from "@mantine/core";
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

export const theme = createTheme({
  colors: { gold },
  primaryColor: "gold",
  fontFamily: "Raleway",
});
