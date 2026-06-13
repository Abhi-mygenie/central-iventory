import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import { useLoginContext } from "@/hooks/useLoginContext";

/**
 * P20: Fetches stock inventory for logged-in store.
 * Phase 2: Hierarchy toggle for Master/Central users.
 *
 * @param {Object} options
 * @param {number} options.staleAfterMs - Stale threshold in ms (default: 5 min)
 */
export function useStockInventory({ staleAfterMs = 5 * 60 * 1000 } = {}) {
  const { isTopLevel, isMiddleLevel } = useLoginContext();
  const canToggleHierarchy = isTopLevel || isMiddleLevel;
  const [showHierarchy, setShowHierarchy] = useState(false);

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const fetchIdRef = useRef(0);

  // Hierarchy state
  const [hierarchySummary, setHierarchySummary] = useState(null);
  const [hierarchyContext, setHierarchyContext] = useState(null);

  const fetchInventory = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const includeHierarchy = showHierarchy && canToggleHierarchy;
      const resp = await api.getStockInventory(includeHierarchy ? { includeHierarchy: true } : {});
      if (id !== fetchIdRef.current) return;
      const data = resp.data;
      setStocks(data.current_stocks || []);
      setHierarchySummary(data.hierarchy_summary || null);
      setHierarchyContext(data.hierarchy_context || null);
      setLastFetched(Date.now());
    } catch (err) {
      if (id !== fetchIdRef.current) return;
      setError(err?.response?.data?.message || "Failed to load stock inventory");
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, [showHierarchy, canToggleHierarchy]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const isStale = lastFetched ? (Date.now() - lastFetched > staleAfterMs) : false;

  const lowStockItems = stocks.filter((s) => s.is_low_stock);

  const categoryCounts = {};
  for (const s of stocks) {
    const cat = s.category_name || "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  return {
    stocks,
    loading,
    error,
    refresh: fetchInventory,
    lastFetched,
    isStale,
    totalItems: stocks.length,
    lowStockItems,
    lowStockCount: lowStockItems.length,
    categoryCounts,
    // Hierarchy
    canToggleHierarchy,
    showHierarchy,
    setShowHierarchy,
    hierarchySummary,
    hierarchyContext,
  };
}
