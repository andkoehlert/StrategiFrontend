import { ref } from "vue";
import type { AreaData } from "../interfaces/Areas";
import { useRuntimeConfig } from "#imports"; 

export const useAreaData = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const areaData = ref<AreaData | null>(null);

  const config = useRuntimeConfig();

  const fetchAreaDataByInitials = async (initials: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const url = `${config.public.apiBase}/api/revenue-data/2023`;
      console.log("Fetching from:", url); 
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data: AreaData = await response.json();

      areaData.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, areaData, fetchAreaDataByInitials };
};
