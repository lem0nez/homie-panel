export const LOUNGE_DATA = `
  subscription {
    loungeTempMonitorData {
      tempCelsius
      humidityPercents
      batteryPercents
    }
  }
`

export class LoungeData {
  loungeTempMonitorData: Data
}

export class Data {
  tempCelsius: string
  humidityPercents: number
  batteryPercents: number

  constructor() {
    this.tempCelsius = '\u2013'
    this.humidityPercents = this.batteryPercents = 0
  }
}
