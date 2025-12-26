import { ref } from "vue";
import type { YearDataResponse } from "../interfaces/summary";
import { useApi } from './useApi'

export const useSummaryData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const YearDataResponse = ref<YearDataResponse | null>(null);
  const { apiRequest } = useApi()

  const fetchSummaryData = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiRequest<YearDataResponse>('/api/summary-data/me');
      YearDataResponse.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, YearDataResponse, fetchSummaryData };
};