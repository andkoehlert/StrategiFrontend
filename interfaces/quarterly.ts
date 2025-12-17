// interfaces/quarterly.ts

export interface QuarterData {
  quarter: string
  percentage: number
  afregnetArbejde: number
  udstaendeTidsreg: number
}

export interface YearQuarterData {
  year: number
  quarters: QuarterData[]
}

export interface QuarterlyResponse {
  endpoint: string
  description: string
  data: YearQuarterData[]
}

// Computed/transformed interface for chart usage
export interface QuarterMonthData {
  [key: string]: number // e.g., "Jan": 50000
}

export interface QuarterlyChartData {
  Q1: {
    total: number
    months: QuarterMonthData
  }
  Q2: {
    total: number
    months: QuarterMonthData
  }
  Q3: {
    total: number
    months: QuarterMonthData
  }
  Q4: {
    total: number
    months: QuarterMonthData
  }
}

export interface ProcessedYearData {
  year: number
  quarterly: QuarterlyChartData
  totals: {
    afregnetArbejde: number
    udstaendeTidsreg: number
    combined: number
  }
}

export interface QuarterPercentage {
  quarter: string
  percentage: number
}