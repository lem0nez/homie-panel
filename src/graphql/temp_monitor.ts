import { gql } from "@apollo/client";

export const LOUNGE_DATA = gql`
  subscription {
    loungeTempMonitorData {
      tempCelsius
      humidityPercents
      batteryPercents
    }
  }
`;

export class Data {
  tempCelsius: string;
  humidityPercents: number;
  batteryPercents: number;

  constructor(tempCelsius = "\u2013", humidityPercents = 0, batteryPercents = 0) {
    this.tempCelsius = tempCelsius;
    this.humidityPercents = humidityPercents;
    this.batteryPercents = batteryPercents;
  }
}
