import { ref } from "vue";
import type { MonthData } from "../interfaces/monthly";
import { useRuntimeConfig } from "#imports"; 

export const useMonthlyData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const monthlyDatas = ref<MonthData | null>(null);

  const config = useRuntimeConfig();

  const fetchMonthlyDataByInitials = async (initials: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const url = `${config.public.apiBase}/mock/targets/${initials}/monthly`;
      console.log("Fetching from:", url); // for debugging
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data: MonthData = await response.json();

      // No filtering needed – just store the monthly array
      monthlyDatas.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, monthlyDatas, fetchMonthlyDataByInitials };
};
