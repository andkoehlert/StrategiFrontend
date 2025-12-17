// interfaces/segment.ts

export interface SegmentData {
  name: string
  percentage: number
  amount: number
}

export interface YearSegmentData {
  year: number
  segments: SegmentData[]
}

export interface SegmentOverviewResponse {
  endpoint: string
  description: string
  data: YearSegmentData[]
}

export interface ProcessedSegmentData {
  year: number
  segments: SegmentData[]
  totalAmount: number
  largestSegment: {
    name: string
    amount: number
    percentage: number
  } | null
}