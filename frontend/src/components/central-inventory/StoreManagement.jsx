import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch } from "lucide-react";
import HierarchySummary from "./HierarchySummary";
import HierarchyManagement from "./HierarchyManagement";

/**
 * Store Management — CR-027 merged view
 * Combines HierarchySummary (overview) + HierarchyManagement (CRUD) into tabs.
 */
export default function StoreManagement() {
  return (
    <div data-testid="store-management" className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Store Management</h1>
      </div>

      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="summary" data-testid="store-tab-summary">Summary</TabsTrigger>
          <TabsTrigger value="manage" data-testid="store-tab-manage">Manage Stores</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <HierarchySummary />
        </TabsContent>
        <TabsContent value="manage">
          <HierarchyManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
