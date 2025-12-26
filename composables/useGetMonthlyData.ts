import { ref } from "vue";
import type { MonthData } from "../interfaces/monthly";
import { useApi } from './useApi'

export const useMonthlyData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const monthlyDatas = ref<MonthData | null>(null);
  const { apiRequest } = useApi()

  const fetchMonthlyDataByInitials = async (initials: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiRequest<MonthData>('/api/monthly-data/me')
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