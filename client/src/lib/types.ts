export interface LapTime {
  lap: number;
  time: number;
}

export interface ChartData {
  lap: number;
  [key: string]: number;
}
