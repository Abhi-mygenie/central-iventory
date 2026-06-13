import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import { useLoginContext } from "@/hooks/useLoginContext";

/**
 * Hook for Production Run functionality.
 * Loads sub-recipes, current stock, and operational settings.
 * Provides derived intelligence: stock availability per ingredient, production gates.
 */
export function useProductionRun() {
  const { restaurantId } = useLoginContext();
  const [subRecipes, setSubRecipes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [srResp, stockResp, settResp] = await Promise.allSettled([
        api.getSubRecipeList(),
        api.getStockInventory(),
        api.getOperationalSettings(restaurantId),
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

  return {
    subRecipes,
    stocks,
    stockMap,
    settings,
    productionEnabled,
    allowNegativeStock,
    loading,
    error,
    refresh: fetchData,
  };
}
