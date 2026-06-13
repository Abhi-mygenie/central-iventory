import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "@/hooks/useLoginContext";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateDisplays";
import { ShoppingCart, ArrowLeft, Plus, Loader2, Check, ShieldX, Trash2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function formatCurrency(n) {
  if (n == null || isNaN(n)) return "\u20B90";
  return `\u20B9${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function PurchaseOrderCreate() {
  const navigate = useNavigate();
  const { restaurantId, restaurantType } = useLoginContext();

  const [vendors, setVendors] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocked, setBlocked] = useState(false);

  // Form state
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [lines, setLines] = useState([]);
  const [expectedDate, setExpectedDate] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("select"); // select | items | review

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [vResp, iResp] = await Promise.all([api.getVendors(), api.getStockInventory()]);
      const vData = vResp.data?.data || vResp.data || [];
      setVendors(Array.isArray(vData) ? vData : []);
      setInventoryItems(iResp.data?.current_stocks || []);

      // Load purchase data for price intelligence
      if (restaurantId) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const pResp = await api.getVendorItemList(restaurantId, { fromDate: oneYearAgo.toISOString().split("T")[0], toDate: new Date().toISOString().split("T")[0] });
        setPurchaseData(pResp.data || []);
      }
    } catch (err) {
      const code = err?.response?.data?.errors?.[0]?.code || err?.response?.data?.code || "";
      if (code === "VENDOR_PURCHASE_NOT_ALLOWED") setBlocked(true);
      else setError(err?.message || "Failed to load data");
    } finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectedVendor = useMemo(() => vendors.find((v) => String(v.id) === selectedVendorId), [vendors, selectedVendorId]);

  // Price intelligence for items
  const itemRates = useMemo(() => {
    if (!selectedVendor || !purchaseData.length) return {};
    const rates = {};
    purchaseData.forEach((r) => {
      if ((r.Vendor_Name === selectedVendor.vendor_name || r.vendor_id === selectedVendor.id) && r.stock_quantity_raw > 0) {
        const key = r.ingredient_id || r.Ingredient_Name;
        if (!rates[key]) rates[key] = { totalAmt: 0, totalQty: 0, last: null };
        rates[key].totalAmt += Number(r.Amount) || 0;
        rates[key].totalQty += Number(r.stock_quantity_raw) || 0;
        if (!rates[key].last || r.Purchase_Date > rates[key].last.Purchase_Date) rates[key].last = r;
      }
    });
    return rates;
  }, [selectedVendor, purchaseData]);

  const handleSelectVendor = (vendorId) => {
    setSelectedVendorId(vendorId);
    // Pre-populate lines from inventory items
    const newLines = inventoryItems.map((item) => {
      const rate = itemRates[item.id] || itemRates[item.stock_title];
      const avgRate = rate && rate.totalQty > 0 ? rate.totalAmt / rate.totalQty : 0;
      return {
        inventory_master_id: item.id,
        stock_title: item.stock_title,
        unit: item.unit,
        current_qty: Number(item.cal_quantity) || 0,
        ordered_qty: "",
        ordered_unit: item.unit,
        expected_rate: avgRate > 0 ? avgRate.toFixed(2) : "",
        checked: false,
      };
    });
    setLines(newLines);
    setStep("items");
  };

  const toggleLine = (idx) => {
    setLines((prev) => prev.map((l, i) => i === idx ? { ...l, checked: !l.checked } : l));
  };

  const updateLine = (idx, field, value) => {
    setLines((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const checkedLines = useMemo(() => lines.filter((l) => l.checked && Number(l.ordered_qty) > 0 && Number(l.expected_rate) > 0), [lines]);
  const totalAmount = useMemo(() => checkedLines.reduce((s, l) => s + Number(l.ordered_qty) * Number(l.expected_rate), 0), [checkedLines]);

  const handleSubmit = async () => {
    if (checkedLines.length === 0) { toast({ title: "Select at least one item", variant: "destructive" }); return; }
    setSubmitting(true);
    try {
      const payload = {
        vendor_id: Number(selectedVendorId),
        expected_delivery_date: expectedDate || undefined,
        notes: notes || undefined,
        payment_type: paymentType,
        tot_tax: 0,
        lines: checkedLines.map((l) => ({
          inventory_master_id: l.inventory_master_id,
          ordered_qty: Number(l.ordered_qty),
          ordered_unit: l.ordered_unit,
          expected_rate: Number(l.expected_rate),
        })),
      };
      const resp = await api.createPO(payload);
      const poId = resp.data?.data?.id || resp.data?.id;
      toast({ title: `PO created: ${resp.data?.data?.reference_code || "Draft"}` });
      navigate(poId ? `/purchase/orders/${poId}` : "/purchase/orders");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || "Failed to create PO";
      toast({ title: msg, variant: "destructive" });
    } finally { setSubmitting(false); }
  };

  if (blocked) {
    return (
      <div data-testid="po-create-blocked" className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldX className="h-10 w-10 text-muted-foreground mb-3" />
        <h2 className="text-sm font-semibold mb-1">Purchase Not Available</h2>
        <p className="text-xs text-muted-foreground max-w-sm">Your store does not have vendor purchase access.</p>
      </div>
    );
  }

  if (loading) return <LoadingState lines={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div data-testid="purchase-order-create">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" className="h-7" onClick={() => step === "select" ? navigate("/purchase/orders") : setStep("select")} data-testid="po-create-back">
          <ArrowLeft className="h-3.5 w-3.5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">Create Purchase Order</h1>
          <p className="text-xs text-muted-foreground">{step === "select" ? "Select a vendor" : step === "items" ? "Select items and quantities" : "Review and submit"}</p>
        </div>
      </div>

      {step === "select" && (
        <div className="space-y-3" data-testid="po-vendor-select">
          <p className="text-sm font-medium mb-2">Select Vendor</p>
          {vendors.length === 0 ? (
            <EmptyState title="No vendors" description="Add vendors first from Vendor Management." />
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {vendors.map((v) => (
                <Card
                  key={v.id}
                  data-testid={`po-vendor-card-${v.id}`}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectVendor(String(v.id))}
                >
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold">{v.vendor_name}</p>
                    <p className="text-[10px] text-muted-foreground">{v.contact_number || v.email || "\u2014"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "items" && (
        <div className="space-y-4" data-testid="po-items-step">
          <Card>
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                PO for {selectedVendor?.vendor_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">Expected Delivery</Label>
                  <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="h-8 text-xs" data-testid="po-expected-date" />
                </div>
                <div>
                  <Label className="text-xs">Payment Type</Label>
                  <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger className="h-8 text-xs" data-testid="po-payment-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notes</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="h-8 text-xs" placeholder="Optional notes" data-testid="po-notes" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardContent className="py-0 px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px] w-10"></TableHead>
                    <TableHead className="text-[10px]">Item</TableHead>
                    <TableHead className="text-[10px]">Unit</TableHead>
                    <TableHead className="text-[10px] text-right">Stock Now</TableHead>
                    <TableHead className="text-[10px] text-right">Order Qty</TableHead>
                    <TableHead className="text-[10px] text-right">Rate</TableHead>
                    <TableHead className="text-[10px] text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, idx) => {
                    const lineTotal = Number(line.ordered_qty || 0) * Number(line.expected_rate || 0);
                    return (
                      <TableRow key={line.inventory_master_id} data-testid={`po-line-${line.inventory_master_id}`} className={line.checked ? "bg-primary/5" : ""}>
                        <TableCell className="py-1.5">
                          <Checkbox checked={line.checked} onCheckedChange={() => toggleLine(idx)} data-testid={`po-check-${line.inventory_master_id}`} />
                        </TableCell>
                        <TableCell className="py-1.5 text-xs font-medium">{line.stock_title}</TableCell>
                        <TableCell className="py-1.5 text-xs text-muted-foreground">{line.unit}</TableCell>
                        <TableCell className="py-1.5 text-xs text-right tabular-nums">{line.current_qty} {line.unit}</TableCell>
                        <TableCell className="py-1.5">
                          <Input
                            type="number"
                            value={line.ordered_qty}
                            onChange={(e) => updateLine(idx, "ordered_qty", e.target.value)}
                            className="h-7 text-xs w-20 ml-auto text-right"
                            placeholder="0"
                            disabled={!line.checked}
                            data-testid={`po-qty-${line.inventory_master_id}`}
                          />
                        </TableCell>
                        <TableCell className="py-1.5">
                          <Input
                            type="number"
                            value={line.expected_rate}
                            onChange={(e) => updateLine(idx, "expected_rate", e.target.value)}
                            className="h-7 text-xs w-20 ml-auto text-right"
                            placeholder="0"
                            disabled={!line.checked}
                            data-testid={`po-rate-${line.inventory_master_id}`}
                          />
                        </TableCell>
                        <TableCell className="py-1.5 text-xs text-right font-mono">{line.checked && lineTotal > 0 ? formatCurrency(lineTotal) : "\u2014"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{checkedLines.length} items selected</p>
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold" data-testid="po-total">Total: {formatCurrency(totalAmount)}</p>
              <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setStep("review")} disabled={checkedLines.length === 0} data-testid="po-to-review">
                Review <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4" data-testid="po-review-step">
          <Card>
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4 text-xs mb-4">
                <div><span className="text-muted-foreground">Vendor:</span> <span className="font-medium">{selectedVendor?.vendor_name}</span></div>
                <div><span className="text-muted-foreground">Payment:</span> <span className="font-medium">{paymentType}</span></div>
                <div><span className="text-muted-foreground">Expected:</span> <span className="font-medium">{expectedDate || "Not set"}</span></div>
                <div><span className="text-muted-foreground">Items:</span> <span className="font-medium">{checkedLines.length}</span></div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px]">Item</TableHead>
                    <TableHead className="text-[10px] text-right">Qty</TableHead>
                    <TableHead className="text-[10px]">Unit</TableHead>
                    <TableHead className="text-[10px] text-right">Rate</TableHead>
                    <TableHead className="text-[10px] text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkedLines.map((line) => (
                    <TableRow key={line.inventory_master_id}>
                      <TableCell className="text-xs font-medium">{line.stock_title}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{line.ordered_qty}</TableCell>
                      <TableCell className="text-xs">{line.ordered_unit}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatCurrency(Number(line.expected_rate))}</TableCell>
                      <TableCell className="text-xs text-right font-mono">{formatCurrency(Number(line.ordered_qty) * Number(line.expected_rate))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-end pt-3 border-t mt-3">
                <p className="text-sm font-bold" data-testid="po-review-total">Total: {formatCurrency(totalAmount)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep("items")} data-testid="po-back-to-items">
              <ArrowLeft className="h-3 w-3 mr-1" /> Back to Items
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1" onClick={handleSubmit} disabled={submitting} data-testid="po-submit">
              {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Create Purchase Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
