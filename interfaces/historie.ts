// interfaces/historie.ts

export interface HighestMonth {
  month: string
  monthNumber: number
  amount: number
  currency: string
}

export interface HighestYear {
  year: number
  amount: number
  currency: string
}

export interface HighestQuarter {
  quarter: string
  quarterNumber: number
  amount: number
  currency: string
}

export interface YearHistorieData {
  year: number
  stoersteMaaned: HighestMonth
  stoersteAar: HighestYear
  stoersteKvartal: HighestQuarter
}

export interface HistorieOverviewResponse {
  endpoint: string
  description: string
  data: YearHistorieData[]
}

export interface ProcessedHistorieData {
  year: number
  largestMonth: {
    name: string
    monthNumber: number
    value: number
    currency: string
  }
  largestYear: {
    year: number
    value: number
    currency: string
  }
  largestQuarter: {
    name: string
    quarterNumber: number
    value: number
    currency: string
  }
}

export interface YearSummary {
  year: number
  total: number
}