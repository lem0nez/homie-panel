import { gql } from "@apollo/client";

const LOUNGE_DATA = gql`
  subscription {
    loungeTempMonitorData {
      tempCelsius
      humidityPercents
      batteryPercents
    }
  }
`;
