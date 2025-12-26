// interfaces/segment.ts
export interface SegmentData {
  name: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface ProcessedSegmentData {
  year: number;
  segments: SegmentData[];
  totalAmount: number;
  largestSegment: {
    name: string;
    amount: number;
    percentage: number;
  } | null;
}

// This matches the backend response
export interface SegmentOverviewResponse {
  userId: string;
  year: number;         // Single year (not array)
  categories: string[];
  segments: Array<{
    name: string;
    count: number;
    data: number[];
    total: number;
  }>;
  totals: {
    count: number;
    data: number[];
    grandTotal: number;
  };
}