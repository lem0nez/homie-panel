import { gql } from "../__generated__";

export const LOUNGE_DATA = gql(`
  subscription OnLoungeTempMonitorData {
    loungeTempMonitorData {
      timepoint
      tempCelsius
      humidityPercents
      batteryPercents
      voltage
    }
  }
`);
