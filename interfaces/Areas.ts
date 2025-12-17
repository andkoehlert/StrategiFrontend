export interface Segment {
  name: string;
  count: number;
  data: number[];
  total: number;
}

export interface Totals {
  count: number;
  data: number[];
  grandTotal: number;
}

export interface AreaData {
  year: number;
  categories: string[];
  segments: Segment[];
  totals: Totals;
}