import { ref } from "vue";
import { useApi } from "./useApi";

interface ComparisonData {
  year: number;
  goals: any;
  actuals: any;
}

export const useSegmentComparison = () => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const comparisonData = ref<ComparisonData | null>(null);
  const { apiRequest } = useApi();

  const fetchComparison = async (year: number): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiRequest<ComparisonData>(
        `/api/segment-overblik/comparison/${year}`
      );
      comparisonData.value = data;
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  return {
    error,
    loading,
    comparisonData,
    fetchComparison
  };
};
