import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "@/hooks/useLoginContext";
import { useProductionRun } from "@/hooks/useProductionRun";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  ShieldX,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Eye,
  FileText,
  Package,
} from "lucide-react";
import { LoadingState, ErrorState } from "@/components/common/StateDisplays";

/**
 * P28 Production Run Form
 *
 * Phases:
 * - Select sub-recipe
 * - Enter quantity (multiplier or absolute), batch label, expiry
 * - Pre-production preview (ingredients vs stock)
 * - Execute → post-production confirmation
 */
export default function ProductionRunForm() {
  const navigate = useNavigate();
  const { isTopLevel, isMiddleLevel, canDo } = useLoginContext();
  const {
    subRecipes, stockMap, productionEnabled, allowNegativeStock,
    loading, error, refresh,
  } = useProductionRun();

  // Form state
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [batchLabel, setBatchLabel] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [result, setResult] = useState(null);

  const selectedRecipe = useMemo(
    () => subRecipes.find((r) => String(r.recipe_id) === String(selectedRecipeId)),
    [subRecipes, selectedRecipeId]
  );

  const baseQty = selectedRecipe?.qty || 0;
  const unit = selectedRecipe?.unit || "piece";
  const mult = Number(multiplier) || 0;
  const totalQty = baseQty * mult;

  // Ingredient availability
  const ingredientRows = useMemo(() => {
    if (!selectedRecipe?.ingredients) return [];
    return selectedRecipe.ingredients.map((ing) => {
      const needed = (Number(ing.ingredient_qty) || 0) * mult;
      const stock = stockMap[ing.ingredient_id];
      const available = stock ? Number(stock.cal_quantity) || 0 : 0;
      const displayAvailable = stock ? `${stock.display_qty} ${stock.display_unit}` : "—";
      const sufficient = available >= needed || needed === 0;
      return {
        id: ing.ingredient_id,
        name: ing.ingredient_name || `Item #${ing.ingredient_id}`,
        unit: ing.ingredient_unit || "",
        needed,
        available,
        displayAvailable,
        sufficient,
      };
    });
  }, [selectedRecipe, mult, stockMap]);

  const insufficientCount = ingredientRows.filter((r) => !r.sufficient && r.needed > 0).length;
  const hasInsufficient = insufficientCount > 0;
  const canSubmit =
    selectedRecipe && mult > 0 && batchLabel.trim() && expiryDate &&
    !submitting && !(hasInsufficient && !allowNegativeStock);

  // Auto-suggest batch label
  const handleRecipeSelect = (id) => {
    setSelectedRecipeId(id);
    setResult(null);
    setSubmitError(null);
    const recipe = subRecipes.find((r) => String(r.recipe_id) === String(id));
    if (recipe) {
      const short = recipe.name?.split(" ").slice(0, 2).join("-").toUpperCase().replace(/[^A-Z0-9-]/g, "") || "BATCH";
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      setBatchLabel(`${short}-${date}-001`);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const resp = await api.runProduction({
        subRecipeId: selectedRecipe.recipe_id,
        quantity: totalQty,
        unit,
        batch: batchLabel.trim(),
        expiryDate,
      });
      setResult(resp.data?.data || resp.data);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.[0]?.message || e.message || "Production run failed";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedRecipeId("");
    setMultiplier("");
    setBatchLabel("");
    setExpiryDate("");
    setResult(null);
    setSubmitError(null);
    refresh();
  };

  // ── Role gate ──
  if (!isTopLevel && !isMiddleLevel) {
    return (
      <div data-testid="production-role-blocked" className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldX className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Production Not Available</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Production runs are only available for Central and Master stores.</p>
      </div>
    );
  }

  if (loading) return <LoadingState lines={4} />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  // ── production_enabled gate ──
  if (!productionEnabled) {
    return (
      <div data-testid="production-blocked" className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldX className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Production Not Enabled</p>
        <p className="text-xs text-muted-foreground/70 mt-1 max-w-sm">
          Contact your administrator to enable production in Operational Settings.
        </p>
      </div>
    );
  }

  // ── Post-production confirmation ──
  if (result) {
    return (
      <div data-testid="post-production-confirmation" className="max-w-lg mx-auto py-8">
        <Card className="border-l-[3px] border-l-emerald-500">
          <CardContent className="py-6 px-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Production Run Complete</p>
                <p className="text-xs text-muted-foreground" data-testid="production-run-id">
                  {result.reference_code || `Run #${result.production_run_id}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Quantity Produced</p>
                <p className="font-semibold tabular-nums">{result.quantity_added || totalQty} {unit}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Unit Cost</p>
                <p className="font-semibold tabular-nums" data-testid="production-unit-cost">
                  {result.unit_cost != null ? `₹${Number(result.unit_cost).toFixed(2)}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Total Cost</p>
                <p className="font-semibold tabular-nums" data-testid="production-total-cost">
                  {result.total_cost != null ? `₹${Number(result.total_cost).toFixed(2)}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Recipe</p>
                <p className="font-semibold truncate">{selectedRecipe?.name || "—"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {result.production_run_id && (
                <Button
                  data-testid="view-audit-btn"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/production/${result.production_run_id}`)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />View Audit
                </Button>
              )}
              <Button
                data-testid="view-in-stock-btn"
                variant="outline"
                size="sm"
                onClick={() => navigate("/inventory")}
              >
                <Package className="h-3.5 w-3.5 mr-1.5" />View in Stock
              </Button>
              <Button
                data-testid="run-another-btn"
                variant="default"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />Run Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Production Run Form ──
  return (
    <div data-testid="production-run-form" className="max-w-2xl mx-auto py-4 px-4 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Factory className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Run Production</h1>
          <p className="text-xs text-muted-foreground">Select a sub-recipe, specify batch details, and execute a production run.</p>
        </div>
      </div>

      {/* Sub-recipe selector */}
      <div className="space-y-2">
        <Label htmlFor="sub-recipe" className="text-xs font-medium">Sub-Recipe</Label>
        <Select value={selectedRecipeId} onValueChange={handleRecipeSelect}>
          <SelectTrigger data-testid="sub-recipe-selector" id="sub-recipe">
            <SelectValue placeholder="Select a sub-recipe..." />
          </SelectTrigger>
          <SelectContent>
            {subRecipes.length === 0 && (
              <div className="px-3 py-2 text-xs text-muted-foreground">No sub-recipes found</div>
            )}
            {subRecipes.map((sr) => (
              <SelectItem key={sr.recipe_id} value={String(sr.recipe_id)}>
                <span className="flex items-center gap-2">
                  <span>{sr.name}</span>
                  <span className="text-muted-foreground text-[10px]">
                    ({sr.qty} {sr.unit} per batch, {sr.ingredients?.length || 0} ingredients)
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity inputs */}
      {selectedRecipe && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="multiplier" className="text-xs font-medium">Batches (multiplier)</Label>
            <Input
              data-testid="production-multiplier"
              id="multiplier"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 30"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Total Output</Label>
            <div
              data-testid="production-total-qty"
              className="h-9 px-3 flex items-center rounded-md border bg-muted text-sm font-mono tabular-nums"
            >
              {mult > 0 ? `${totalQty} ${unit}` : "—"}
            </div>
            {mult > 0 && (
              <p className="text-[10px] text-muted-foreground">{baseQty} {unit} × {mult} batches</p>
            )}
          </div>
        </div>
      )}

      {/* Batch & Expiry */}
      {selectedRecipe && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="batch-label" className="text-xs font-medium">Batch Label</Label>
            <Input
              data-testid="production-batch-label"
              id="batch-label"
              placeholder="e.g. ELACHI-20260613-001"
              value={batchLabel}
              onChange={(e) => setBatchLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="text-xs font-medium">Expiry Date</Label>
            <Input
              data-testid="production-expiry-date"
              id="expiry-date"
              type="date"
              min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Pre-production preview */}
      {selectedRecipe && mult > 0 && ingredientRows.length > 0 && (
        <div data-testid="pre-production-preview" className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ingredient Requirements</h2>
          <Card>
            <CardContent className="py-0 px-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3 font-medium">Ingredient</th>
                    <th className="text-right py-2 px-3 font-medium">Required</th>
                    <th className="text-right py-2 px-3 font-medium">Available</th>
                    <th className="text-center py-2 px-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientRows.map((row) => (
                    <tr
                      key={row.id}
                      data-testid={row.sufficient ? `ingredient-sufficient-${row.id}` : `ingredient-insufficient-${row.id}`}
                      className={`border-b last:border-0 ${
                        !row.sufficient && row.needed > 0
                          ? allowNegativeStock ? "bg-amber-50/50" : "bg-red-50/50"
                          : ""
                      }`}
                    >
                      <td className="py-2 px-3 font-medium">{row.name}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{row.needed.toFixed(1)} {row.unit}</td>
                      <td className="py-2 px-3 text-right tabular-nums">{row.displayAvailable}</td>
                      <td className="py-2 px-3 text-center">
                        {row.needed === 0 ? (
                          <span className="text-muted-foreground">—</span>
                        ) : row.sufficient ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 inline" />
                        ) : (
                          <XCircle className={`h-4 w-4 inline ${allowNegativeStock ? "text-amber-500" : "text-red-500"}`} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Insufficient stock warnings */}
          {hasInsufficient && !allowNegativeStock && (
            <div data-testid="negative-stock-blocked" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Cannot proceed — negative stock is not allowed and {insufficientCount} ingredient{insufficientCount > 1 ? "s are" : " is"} insufficient.</span>
            </div>
          )}
          {hasInsufficient && allowNegativeStock && (
            <div data-testid="negative-stock-warning" className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Warning: {insufficientCount} ingredient{insufficientCount > 1 ? "s have" : " has"} insufficient stock. Production will result in negative inventory.</span>
            </div>
          )}
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit button */}
      {selectedRecipe && (
        <Button
          data-testid="run-production-btn"
          className="w-full"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 animate-spin" /> Running Production...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Factory className="h-4 w-4" /> Run Production — {mult > 0 ? `${totalQty} ${unit}` : "Enter quantity"}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}
