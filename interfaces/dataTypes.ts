// dataTypes.ts

export interface MonthlyData {
  month: string;
  total: number;
}

export interface Segment {
  name: string;
  total: number;
}

export interface QuarterlyData {
  total: number;
  months: { [key: string]: number };
}

export interface YearData {
  year: number;
  type: 'actual' | 'forecast'; // Assuming you might have other types later
  segments: Segment[];
  totals: { grandTotal: number };
  quarterly: { [key: string]: QuarterlyData };
  monthly: MonthlyData[];
}

export interface HistoricalData {
  [year: string]: YearData;
}

export interface ChartDataRoot {
  historicalData: HistoricalData;
}