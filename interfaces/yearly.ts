// interfaces/yearly.ts

export interface YearlyData {
  year: number
  afregnet: number
  maal: number
  completionPercentage: number
  currency: string
}

export interface YearlyOverviewResponse {
  description: string
  data: YearlyData[]
}

export interface ProcessedYearlyData {
  year: number
  actual: number
  goal: number
  percentage: number
  difference: number
  currency: string
}