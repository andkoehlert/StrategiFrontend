export interface DailyData {
  date: string
  settledAmount: number
  caseValue: number
  casesSettled: number
  status?: string
  workType?: string
  industry?: string
  caseIds?: string[]
  details?: {
    meetings?: number
    hoursLogged?: number
    clientName?: string
  }
}

export interface YearData {
  year: number
  dailyData: DailyData[]
  summary?: {
    totalSettled: number
    totalCaseValue: number
    totalCases: number
    averagePerDay: number
    activeByStatus?: Record<string, number>
    byWorkType?: Record<string, number>
    byIndustry?: Record<string, number>
  }
}

export interface LawyerCalendarData {
  years: YearData[]
}

export interface YearStatistics {
  totalSettled: number
  totalCaseValue: number
  totalCases: number
  avgSettled: number
  maxDay: DailyData
  daysWithActivity: number
}

export interface MonthlyAggregatedData {
  month: string
  settledAmount: number
  caseValue: number
  casesSettled: number
  daysCount: number
}

export interface CalendarFilters {
  year?: number
  status?: string
  workType?: string
  balance?: string
  industry?: string
}

export type DataType = 'settledAmount' | 'caseValue' | 'casesSettled'