// interfaces/monthly.ts

export interface MonthData {
  month: string
  monthNumber: number
  afregnet: number
  ditMaal: number
}

export interface YearMonthlyData {
  year: number
  months: MonthData[]
}

export interface MonthlyOverviewResponse {
  endpoint: string
  description: string
  data: YearMonthlyData[]
}

export interface ProcessedMonthlyData {
  year: number
  months: MonthData[]
  totals: {
    afregnet: number
    ditMaal: number
    difference: number
  }
  averages: {
    afregnet: number
    ditMaal: number
  }
  bestMonth: {
    name: string
    afregnet: number
    ditMaal: number
    percentage: number
  } | null
}

export interface MonthComparison {
  month: string
  afregnet: number
  ditMaal: number
  difference: number
  percentage: number
}