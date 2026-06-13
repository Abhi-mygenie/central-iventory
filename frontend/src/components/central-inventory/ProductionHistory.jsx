import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoginContext } from "@/hooks/useLoginContext";
import api from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Factory,
  ChevronDown,
  ChevronRight,
  Package,
  Calendar,
  Hash,
  DollarSign,
  Layers,
  ShieldX,
} from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateDisplays";

/**
 * P28 Production History + Audit Detail
 *
 * If route has :id param → render audit detail for that production run
 * Else → render production history list (G-018 stub — empty state until backend delivers)
 */
export default function ProductionHistory() {
  const { id } = useParams();
  const { isTopLevel, isMiddleLevel } = useLoginContext();

  if (!isTopLevel && !isMiddleLevel) {
    return (
      <div data-testid="production-role-blocked" className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldX className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Production Not Available</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Production is only available for Central and Master stores.</p>
      </div>
    );
  }

  if (id) return <ProductionAuditDetail runId={id} />;
  return <ProductionHistoryList />;
}

// ── Audit Detail ──────────────────────────────────────────────────

function ProductionAuditDetail({ runId }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getProductionRunDetail(runId);
      setData(resp.data?.data || resp.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load production run details");
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <LoadingState lines={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!data) return <EmptyState title="Production run not found" />;

  const allocations = data.consumed_allocations || [];

  return (
    <div data-testid="production-audit-detail" className="max-w-3xl mx-auto py-4 px-4 space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" className="text-xs -ml-2" onClick={() => navigate("/production/history")}>
        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to History
      </Button>

      {/* Summary card */}
      <Card data-testid="audit-summary-card" className="border-l-[3px] border-l-primary">
        <CardContent className="py-5 px-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Factory className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold" data-testid="audit-reference-code">
                {data.reference_code || `Run #${data.id || data.production_run_id}`}
              </p>
              <Badge variant="outline" className="text-[9px] mt-0.5">
                {data.status || "completed"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <InfoCell icon={Layers} label="Planned / Actual" value={`${data.planned_output_qty ?? "—"} / ${data.actual_output_qty ?? "—"} ${data.output_unit || ""}`} />
            <InfoCell icon={Hash} label="Batch" value={data.output_batch || "—"} />
            <InfoCell icon={Calendar} label="Expiry" value={data.output_expiry_date || "—"} />
            <InfoCell icon={DollarSign} label="Unit / Total Cost" value={`₹${fmt(data.unit_cost)} / ₹${fmt(data.total_cost)}`} />
          </div>
        </CardContent>
      </Card>

      {/* Consumed Allocations */}
      {allocations.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Consumed Ingredients ({allocations.length})</h2>
          <Card>
            <CardContent data-testid="consumed-allocations-table" className="py-0 px-0">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 px-3 font-medium w-8"></th>
                    <th className="text-left py-2 px-3 font-medium">Ingredient</th>
                    <th className="text-right py-2 px-3 font-medium">Qty Consumed</th>
                    <th className="text-right py-2 px-3 font-medium">Unit</th>
                    <th className="text-right py-2 px-3 font-medium">Line Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc) => {
                    const allocId = alloc.ingredient_id || alloc.inventory_master_id;
                    const isOpen = expanded[allocId];
                    const segments = alloc.segment_allocations || [];
                    return (
                      <IngredientRow
                        key={allocId}
                        alloc={alloc}
                        allocId={allocId}
                        isOpen={isOpen}
                        segments={segments}
                        onToggle={() => toggleExpand(allocId)}
                      />
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Output section */}
      <div data-testid="output-section">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Output (Finished Good)</h2>
        <Card>
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold">
                  {data.output_stock_title || `Item #${data.output_inventory_master_id || "—"}`}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Segment #{data.output_segment_id || "—"} · Batch: {data.output_batch || "—"} · Exp: {data.output_expiry_date || "—"}
                </p>
              </div>
            </div>
            {data.output_inventory_master_id && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/inventory/${data.output_inventory_master_id}`)}>
                View in Stock <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IngredientRow({ alloc, allocId, isOpen, segments, onToggle }) {
  return (
    <>
      <tr
        data-testid={`allocation-row-${allocId}`}
        className="border-b cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={segments.length > 0 ? onToggle : undefined}
      >
        <td className="py-2 px-3">
          {segments.length > 0 && (
            isOpen
              ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </td>
        <td className="py-2 px-3 font-medium">
          {alloc.ingredient_name || `Item #${allocId}`}
        </td>
        <td className="py-2 px-3 text-right tabular-nums">{fmt(alloc.quantity_consumed)}</td>
        <td className="py-2 px-3 text-right">{alloc.unit || ""}</td>
        <td className="py-2 px-3 text-right tabular-nums font-semibold">₹{fmt(alloc.line_cost)}</td>
      </tr>
      {isOpen && segments.map((seg) => (
        <tr key={seg.segment_id} data-testid={`segment-row-${seg.segment_id}`} className="bg-muted/30 text-[10px]">
          <td className="py-1.5 px-3"></td>
          <td className="py-1.5 px-3 text-muted-foreground pl-8">
            Batch: {seg.batch || "—"} · Exp: {seg.expiry_date || "—"}
          </td>
          <td className="py-1.5 px-3 text-right tabular-nums">{fmt(seg.qty_cal)}</td>
          <td className="py-1.5 px-3 text-right">₹{fmt(seg.unit_cost)}/u</td>
          <td className="py-1.5 px-3 text-right tabular-nums">₹{fmt(seg.alloc_cost || seg.allocation_line_cost)}</td>
        </tr>
      ))}
    </>
  );
}

// ── History List (G-018 stub) ─────────────────────────────────────

function ProductionHistoryList() {
  const navigate = useNavigate();

  return (
    <div data-testid="production-history-page" className="max-w-3xl mx-auto py-4 px-4 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Factory className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Production History</h1>
            <p className="text-xs text-muted-foreground">View past production runs and audit trails.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => navigate("/production/new")}>
          <Factory className="h-3.5 w-3.5 mr-1.5" /> New Run
        </Button>
      </div>

      {/* G-018 stub: empty state */}
      <Card>
        <CardContent className="py-0 px-0">
          <div data-testid="history-empty-state">
            <EmptyState
              title="Production history is being set up"
              description="Run history will appear here once the backend endpoint is available. You can still run productions and view individual audit details via the Run Production form."
              icon={Factory}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
        <p className="font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function fmt(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
