export interface YearDataResponse {
  data: YearDataItem[];
}

export interface YearDataItem {
  year: number;
  afregnetArbejde: number;
  udstaendeTidsregistrering: number;
  totalPotienale: number;
}
