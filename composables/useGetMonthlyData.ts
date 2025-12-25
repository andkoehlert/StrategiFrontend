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
      const url = `${config.public.apiBase}/api/monthly-data/694bc5f239c374ba0f839567`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data: MonthData = await response.json();

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
