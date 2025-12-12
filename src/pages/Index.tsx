import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { LayoutGrid } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
              <p className="text-sm text-muted-foreground">
                Organize your tasks with drag and drop
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <KanbanBoard />
      </main>
    </div>
  );
};

export default Index;
