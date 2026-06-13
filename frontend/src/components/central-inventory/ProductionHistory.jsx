import { useState, useEffect, useCallback, useMemo } from "react";
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
  TrendingUp,
} from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateDisplays";

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

// ── Audit Detail (unchanged from Phase 1) ─────────────────────────

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

  const toggleExpand = (ingId) => {
    setExpanded((prev) => ({ ...prev, [ingId]: !prev[ingId] }));
  };

  if (loading) return <LoadingState lines={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!data) return <EmptyState title="Production run not found" />;

  const allocations = data.consumed_allocations || [];

  return (
    <div data-testid="production-audit-detail" className="max-w-3xl mx-auto py-4 px-4 space-y-5">
      <Button variant="ghost" size="sm" className="text-xs -ml-2" onClick={() => navigate("/production/history")}>
        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to History
      </Button>

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
              <Badge variant="outline" className="text-[9px] mt-0.5">{data.status || "completed"}</Badge>
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
                      <IngredientRow key={allocId} alloc={alloc} allocId={allocId} isOpen={isOpen} segments={segments} onToggle={() => toggleExpand(allocId)} />
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      <div data-testid="output-section">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Output (Finished Good)</h2>
        <Card>
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold">{data.output_stock_title || `Item #${data.output_inventory_master_id || "—"}`}</p>
                <p className="text-[10px] text-muted-foreground">Segment #{data.output_segment_id || "—"} · Batch: {data.output_batch || "—"} · Exp: {data.output_expiry_date || "—"}</p>
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
      <tr data-testid={`allocation-row-${allocId}`} className="border-b cursor-pointer hover:bg-accent/30 transition-colors" onClick={segments.length > 0 ? onToggle : undefined}>
        <td className="py-2 px-3">
          {segments.length > 0 && (isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />)}
        </td>
        <td className="py-2 px-3 font-medium">{alloc.ingredient_name || `Item #${allocId}`}</td>
        <td className="py-2 px-3 text-right tabular-nums">{fmt(alloc.quantity_consumed)}</td>
        <td className="py-2 px-3 text-right">{alloc.unit || ""}</td>
        <td className="py-2 px-3 text-right tabular-nums font-semibold">₹{fmt(alloc.line_cost)}</td>
      </tr>
      {isOpen && segments.map((seg) => (
        <tr key={seg.segment_id} data-testid={`segment-row-${seg.segment_id}`} className="bg-muted/30 text-[10px]">
          <td className="py-1.5 px-3"></td>
          <td className="py-1.5 px-3 text-muted-foreground pl-8">Batch: {seg.batch || "—"} · Exp: {seg.expiry_date || "—"}</td>
          <td className="py-1.5 px-3 text-right tabular-nums">{fmt(seg.qty_cal)}</td>
          <td className="py-1.5 px-3 text-right">₹{fmt(seg.unit_cost)}/u</td>
          <td className="py-1.5 px-3 text-right tabular-nums">₹{fmt(seg.alloc_cost || seg.allocation_line_cost)}</td>
        </tr>
      ))}
    </>
  );
}

// ── P3-7/8/9: Production History List with Intelligence ───────────

function ProductionHistoryList() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.getProductionRunHistory({ limit: 50 });
      const d = resp.data?.data || resp.data;
      setRuns(Array.isArray(d) ? d : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load production history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // P3-7: Summary KPIs
  const kpis = useMemo(() => {
    const totalRuns = runs.length;
    const totalFG = runs.reduce((sum, r) => sum + (Number(r.actual_output_qty || r.planned_output_qty || r.quantity_added || 0)), 0);
    const totalCost = runs.reduce((sum, r) => sum + (Number(r.total_cost || 0)), 0);
    const avgUnitCost = totalFG > 0 ? totalCost / totalFG : 0;
    return { totalRuns, totalFG, totalCost, avgUnitCost };
  }, [runs]);

  // P3-8: Staleness — group by sub-recipe, find last produced
  const staleness = useMemo(() => {
    const byRecipe = {};
    for (const run of runs) {
      const recipeId = run.bom_sub_recipe_id || run.sub_recipe_id;
      const name = run.recipe_name || run.output_stock_title || `Recipe #${recipeId}`;
      if (!byRecipe[recipeId]) {
        byRecipe[recipeId] = { recipeId, name, runs: [], totalCost: 0, totalQty: 0 };
      }
      byRecipe[recipeId].runs.push(run);
      byRecipe[recipeId].totalCost += Number(run.total_cost || 0);
      byRecipe[recipeId].totalQty += Number(run.actual_output_qty || run.planned_output_qty || 0);
    }
    return Object.values(byRecipe).map((group) => {
      const sorted = [...group.runs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      const lastRun = sorted[0];
      const lastDate = lastRun?.created_at ? new Date(lastRun.created_at) : null;
      const daysAgo = lastDate ? Math.floor((Date.now() - lastDate.getTime()) / 86400000) : null;
      const avgCost = group.totalQty > 0 ? group.totalCost / group.totalQty : 0;
      return { ...group, lastDate, daysAgo, avgCost, lastRunId: lastRun?.id || lastRun?.production_run_id };
    }).sort((a, b) => (b.daysAgo ?? 9999) - (a.daysAgo ?? 9999));
  }, [runs]);

  // P3-9: Cost trend — last 5 runs of most recent recipe
  const costTrend = useMemo(() => {
    if (runs.length < 2) return null;
    const sorted = [...runs]
      .filter((r) => Number(r.unit_cost) > 0)
      .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
      .slice(-5);
    if (sorted.length < 2) return null;
    const costs = sorted.map((r) => Number(r.unit_cost));
    const avg = costs.reduce((s, c) => s + c, 0) / costs.length;
    const prev = costs.slice(0, -1).reduce((s, c) => s + c, 0) / (costs.length - 1);
    const pctChange = prev > 0 ? ((avg - prev) / prev * 100).toFixed(1) : 0;
    return { costs, avg, pctChange, recipeName: sorted[sorted.length - 1]?.recipe_name || sorted[sorted.length - 1]?.output_stock_title || "Production" };
  }, [runs]);

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

      {loading && <LoadingState lines={3} />}
      {error && <ErrorState message={error} onRetry={fetchHistory} />}

      {!loading && !error && runs.length === 0 && (
        <Card>
          <CardContent className="py-0 px-0">
            <div data-testid="history-empty-state">
              <EmptyState title="No production runs yet" description="Run your first production to see history here." icon={Factory} />
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && runs.length > 0 && (
        <>
          {/* P3-7: Summary KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <Card data-testid="kpi-total-runs">
              <CardContent className="py-3 px-4">
                <p className="text-2xl font-bold tabular-nums font-mono">{kpis.totalRuns}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Runs</p>
              </CardContent>
            </Card>
            <Card data-testid="kpi-total-fg">
              <CardContent className="py-3 px-4">
                <p className="text-2xl font-bold tabular-nums font-mono">{kpis.totalFG.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total FG Produced</p>
              </CardContent>
            </Card>
            <Card data-testid="kpi-total-cost">
              <CardContent className="py-3 px-4">
                <p className="text-2xl font-bold tabular-nums font-mono">₹{kpis.totalCost > 1000 ? `${(kpis.totalCost / 1000).toFixed(1)}K` : kpis.totalCost.toFixed(0)}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Total Material Cost</p>
                <p className="text-[10px] text-muted-foreground mt-1 pt-1 border-t border-border">Avg ₹{kpis.avgUnitCost.toFixed(2)}/unit</p>
              </CardContent>
            </Card>
          </div>

          {/* P3-8: Sub-recipe staleness */}
          {staleness.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Sub-Recipe Staleness</h2>
              <Card>
                <CardContent className="py-0 px-0 divide-y divide-border">
                  {staleness.map((s) => (
                    <div key={s.recipeId} data-testid={`staleness-indicator-${s.recipeId}`} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-sm font-semibold flex-1 truncate">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums font-mono shrink-0">
                        Avg ₹{s.avgCost.toFixed(2)}/u
                      </span>
                      {s.daysAgo === null ? (
                        <Badge variant="outline" className="text-[9px] px-2 py-0 bg-red-50 text-red-600 border-red-200 shrink-0">Never produced</Badge>
                      ) : s.daysAgo <= 5 ? (
                        <Badge variant="outline" className="text-[9px] px-2 py-0 bg-emerald-50 text-emerald-600 border-emerald-200 shrink-0">Produced {s.daysAgo}d ago</Badge>
                      ) : s.daysAgo <= 14 ? (
                        <Badge variant="outline" className="text-[9px] px-2 py-0 bg-amber-50 text-amber-600 border-amber-200 shrink-0">Produced {s.daysAgo}d ago</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-2 py-0 bg-red-50 text-red-600 border-red-200 shrink-0">Produced {s.daysAgo}d ago</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* P3-9: Cost trend */}
          {costTrend && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cost Trend — {costTrend.recipeName}</h2>
              <Card>
                <CardContent className="py-4 px-4">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-xl font-bold font-mono tabular-nums">₹{costTrend.avg.toFixed(2)}</span>
                    <span className="text-[10px] text-muted-foreground">avg unit cost (last {costTrend.costs.length} runs)</span>
                    {Number(costTrend.pctChange) > 0 ? (
                      <Badge variant="outline" className="text-[9px] px-2 py-0 bg-amber-50 text-amber-600 border-amber-200">
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5 inline" /> {costTrend.pctChange}%
                      </Badge>
                    ) : Number(costTrend.pctChange) < 0 ? (
                      <Badge variant="outline" className="text-[9px] px-2 py-0 bg-emerald-50 text-emerald-600 border-emerald-200">
                        {costTrend.pctChange}%
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {costTrend.costs.map((cost, idx) => {
                      const max = Math.max(...costTrend.costs);
                      const min = Math.min(...costTrend.costs) * 0.8;
                      const pct = max > min ? ((cost - min) / (max - min)) * 100 : 50;
                      const isLast = idx === costTrend.costs.length - 1;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                          <div
                            className={`w-full rounded-t ${isLast ? "bg-amber-200 border border-amber-300" : "bg-muted"}`}
                            style={{ height: `${Math.max(20, pct)}%` }}
                          />
                          <span className={`text-[9px] tabular-nums font-mono ${isLast ? "text-amber-600 font-semibold" : "text-muted-foreground"}`}>
                            {cost.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Run table */}
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">All Runs ({runs.length})</h2>
            <Card>
              <CardContent data-testid="production-history-table" className="py-0 px-0">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2 px-3 font-medium">Date</th>
                      <th className="text-left py-2 px-3 font-medium">Reference</th>
                      <th className="text-left py-2 px-3 font-medium">Recipe</th>
                      <th className="text-right py-2 px-3 font-medium">Qty</th>
                      <th className="text-right py-2 px-3 font-medium">Unit Cost</th>
                      <th className="text-right py-2 px-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run) => {
                      const runId = run.id || run.production_run_id;
                      return (
                        <tr
                          key={runId}
                          data-testid={`production-run-row-${runId}`}
                          className="border-b last:border-0 cursor-pointer hover:bg-accent/30 transition-colors"
                          onClick={() => navigate(`/production/${runId}`)}
                        >
                          <td className="py-2 px-3 tabular-nums text-muted-foreground">
                            {run.created_at ? new Date(run.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                          </td>
                          <td className="py-2 px-3 font-mono font-semibold">{run.reference_code || `#${runId}`}</td>
                          <td className="py-2 px-3 truncate max-w-[160px]">{run.recipe_name || run.output_stock_title || "—"}</td>
                          <td className="py-2 px-3 text-right tabular-nums">{run.actual_output_qty || run.planned_output_qty || "—"} {run.output_unit || ""}</td>
                          <td className="py-2 px-3 text-right tabular-nums font-mono">₹{fmt(run.unit_cost)}</td>
                          <td className="py-2 px-3 text-right tabular-nums font-mono font-semibold">₹{fmt(run.total_cost)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
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
