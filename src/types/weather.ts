export interface Coordinates {
  latitude: number
  longitude: number
  name: string
  country?: string
}

export interface CurrentWeather {
  temperature: number
  windSpeed: number
  weatherCode: number
  time: string
}

export interface HourlyData {
  time: string[]
  temperature: number[]
  precipitation: number[]
  windSpeed: number[]
}

export interface DailyData {
  time: string[]
  tempMax: number[]
  tempMin: number[]
}

export interface WeatherResponse {
  current: {
    temperature: number
    windSpeed: number
    weatherCode: number
    pressure: number
    time: string
  }
  hourly: {
    time: string[]
    temperature: number[]
    precipitation: number[]
    windSpeed: number[]
    humidity: number[]
    pressure: number[]
  }
  daily: {
    time: string[]
    tempMax: number[]
    tempMin: number[]
    uvIndex: number[]
    precipitationSum: number[]
  }
}