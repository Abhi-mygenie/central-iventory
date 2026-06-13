import { useState, useEffect, useCallback } from "react";
import { useLoginContext } from "@/hooks/useLoginContext";
import api from "@/services/api";
import { toast } from "@/hooks/use-toast";
import IngredientComposer from "./IngredientComposer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Pencil, Loader2, BookOpen } from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/StateDisplays";

/**
 * Sub-Recipe Master — extracted from RecipeCatalogue.jsx (CR-027)
 * Standalone page at /sub-recipe-master (PRODUCTION section)
 */
export default function SubRecipeMaster() {
  const { canAccess } = useLoginContext();
  const hasAccess = canAccess("scr-sub-recipe-master") || canAccess("scr-catalogue");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { const r = await api.getSubRecipeList(); setItems(r.data || []); }
    catch (e) { setError(e?.message || "Failed to load sub-recipes"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((sr) => {
    if (!search.trim()) return true;
    return sr.name?.toLowerCase().includes(search.toLowerCase());
  });

  if (!hasAccess) {
    return (
      <div data-testid="sub-recipe-master">
        <EmptyState title="Access denied" />
      </div>
    );
  }

  return (
    <div data-testid="sub-recipe-master" className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Sub-Recipe Master</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="search-sub-recipes"
            placeholder="Search sub-recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true); }} data-testid="add-sub-recipe-btn">
          <Plus className="h-4 w-4 mr-1" />Add Sub-Recipe
        </Button>
      </div>

      {loading && <LoadingState lines={3} />}
      {error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState title="No sub-recipes" description="Sub-recipes define ingredient BOMs for production runs." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Output Qty</TableHead>
                <TableHead className="text-xs">Unit</TableHead>
                <TableHead className="text-xs text-center">Ingredients</TableHead>
                <TableHead className="text-xs w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sr) => (
                <TableRow key={sr.id || sr.recipe_id} data-testid={`subrecipe-row-${sr.id || sr.recipe_id}`}>
                  <TableCell className="py-2 text-sm font-medium">{sr.name}</TableCell>
                  <TableCell className="py-2 text-xs tabular-nums">{sr.qty || "—"}</TableCell>
                  <TableCell className="py-2 text-xs text-muted-foreground">{sr.unit || "—"}</TableCell>
                  <TableCell className="py-2 text-center">
                    <Badge variant="outline" className="text-[10px]">{sr.ingredients?.length || 0}</Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => { setEditItem(sr); setDialogOpen(true); }}
                      data-testid={`edit-subrecipe-${sr.id || sr.recipe_id}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <SubRecipeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} subRecipe={editItem} onSaved={load} />
    </div>
  );
}

function SubRecipeFormDialog({ open, onOpenChange, subRecipe, onSaved }) {
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("1");
  const [servesPeople, setServesPeople] = useState("1");
  const [unit, setUnit] = useState("gm");
  const [qty, setQty] = useState("1");
  const [ingredients, setIngredients] = useState([{ ingredient_id: "", ingredient_qty: "", ingredient_unit: "" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subRecipe) {
      setName(subRecipe.name || "");
      setPrepTime(subRecipe.prepration_time || subRecipe.preparation_time || "1");
      setServesPeople(String(subRecipe.serve_people || "1"));
      setUnit(subRecipe.unit || "gm");
      setQty(subRecipe.qty || "1");
      setIngredients(
        subRecipe.ingredients?.length
          ? subRecipe.ingredients.map((i) => ({
              ingredient_id: String(i.ingredient_id),
              ingredient_qty: String(i.ingredient_qty),
              ingredient_unit: i.ingredient_unit || "",
            }))
          : [{ ingredient_id: "", ingredient_qty: "", ingredient_unit: "" }]
      );
    } else {
      setName(""); setPrepTime("1"); setServesPeople("1"); setUnit("gm"); setQty("1");
      setIngredients([{ ingredient_id: "", ingredient_qty: "", ingredient_unit: "" }]);
    }
  }, [subRecipe, open]);

  const valid = name.trim() && prepTime && servesPeople && ingredients.length > 0 && ingredients.every((i) => i.ingredient_id && Number(i.ingredient_qty) > 0);

  const save = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      const payload = {
        name,
        prepration_time: Number(prepTime),
        serve_people: Number(servesPeople),
        unit,
        qty: Number(qty),
        ingredients: ingredients.map((i) => ({
          ingredient_id: Number(i.ingredient_id),
          ingredient_qty: Number(i.ingredient_qty),
          ingredient_unit: i.ingredient_unit,
        })),
      };
      if (subRecipe) await api.updateSubRecipe(subRecipe.id || subRecipe.recipe_id, payload);
      else await api.createSubRecipe(payload);
      toast({ title: subRecipe ? "Sub-recipe updated" : "Sub-recipe created" });
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast({ title: e?.response?.data?.message || "Failed to save sub-recipe", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subRecipe ? "Edit" : "Add"} Sub-Recipe</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-sm" data-testid="subrecipe-name" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label className="text-xs">Prep Time *</Label><Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Serves *</Label><Input type="number" value={servesPeople} onChange={(e) => setServesPeople(e.target.value)} className="h-8 text-sm" /></div>
            <div><Label className="text-xs">Unit</Label><Input value={unit} onChange={(e) => setUnit(e.target.value)} className="h-8 text-sm" /></div>
          </div>
          <IngredientComposer ingredients={ingredients} onChange={setIngredients} disabled={saving} />
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving || !valid} size="sm" data-testid="save-subrecipe-btn">
            {saving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
