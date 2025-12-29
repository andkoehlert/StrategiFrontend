import { ref } from "vue";
import type { AreaData } from "../interfaces/Areas";
import { useApi } from './useApi'

export const useAreaData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const areaData = ref<AreaData | null>(null);
  const { apiRequest } = useApi()


  const fetchAreaDataByYear = async (year: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiRequest<AreaData>(`/api/revenue-data/me/${year}`);
      areaData.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, areaData, fetchAreaDataByYear };
};