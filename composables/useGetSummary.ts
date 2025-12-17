import { ref } from "vue";
import type { YearDataResponse } from "../interfaces/summary";
import { useRuntimeConfig } from "#imports"; 

export const useSummaryData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const YearDataResponse = ref<YearDataResponse | null>(null);

  const config = useRuntimeConfig();

  const fetchSummaryByInitials = async (initials: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const url = `${config.public.apiBase}/mock/targets/${initials}/summary`;
      console.log("Fetching from:", url); 
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data: YearDataResponse = await response.json();

      // No filtering needed – just store the monthly array
      YearDataResponse.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, YearDataResponse, fetchSummaryByInitials };
};
