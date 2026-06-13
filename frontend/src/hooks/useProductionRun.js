import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import { useLoginContext } from "@/hooks/useLoginContext";

/**
 * Hook for Production Run functionality.
 * Loads sub-recipes, current stock, operational settings,
 * daily consumption (for coverage estimates), and hierarchy detail (for post-production NBA).
 */
export function useProductionRun() {
  const { restaurantId } = useLoginContext();
  const [subRecipes, setSubRecipes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [consumption, setConsumption] = useState(null);
  const [hierarchyStores, setHierarchyStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [srResp, stockResp, settResp, consResp, hierResp] = await Promise.allSettled([
        api.getSubRecipeList(),
        api.getStockInventory(),
        api.getOperationalSettings(restaurantId),
        api.getDailyConsumptionReport({ includeHierarchy: true }),
        api.getHierarchyDetail(restaurantId).catch(() => null),
      ]);

      if (srResp.status === "fulfilled") {
        setSubRecipes(srResp.value.data || []);
      }
      if (stockResp.status === "fulfilled") {
        setStocks(stockResp.value.data?.current_stocks || []);
      }
      if (settResp.status === "fulfilled") {
        const sd = settResp.value.data?.data || settResp.value.data;
        setSettings(sd?.resolved_settings || sd?.stored_settings || null);
      }
      if (consResp.status === "fulfilled") {
        setConsumption(consResp.value.data || null);
      }
      if (hierResp.status === "fulfilled" && hierResp.value) {
        const hd = hierResp.value.data?.data || hierResp.value.data;
        setHierarchyStores(hd?.children || hd?.stores || []);
      }
    } catch (e) {
      setError(e?.message || "Failed to load production data");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchData();
    }
  }, [fetchData]);

  // Derived
  const productionEnabled = settings?.production_enabled ?? false;
  const allowNegativeStock = settings?.allow_negative_stock ?? true;

  // Build stock lookup: inventory_master_id → { display_qty, cal_quantity, ... }
  const stockMap = {};
  for (const s of stocks) {
    stockMap[s.id] = s;
  }

  // P3-5: Build consumption map for coverage estimates
  // inventory_master_id → avg daily consumption qty
  const consumptionMap = {};
  if (consumption) {
    const details = consumption.stock_details || consumption.stock_summary || [];
    const dateRange = consumption.date_range || [];
    const days = dateRange.length > 1
      ? Math.max(1, Math.round((new Date(dateRange[1]) - new Date(dateRange[0])) / 86400000))
      : 7;
    for (const item of details) {
      const id = item.inventory_master_id || item.id;
      const totalConsumed = Number(item.total_consumed || item.total_qty || 0);
      if (id && totalConsumed > 0) {
        consumptionMap[id] = totalConsumed / days;
      }
    }
  }

  return {
    subRecipes,
    stocks,
    stockMap,
    settings,
    consumption,
    consumptionMap,
    hierarchyStores,
    productionEnabled,
    allowNegativeStock,
    loading,
    error,
    refresh: fetchData,
  };
}
