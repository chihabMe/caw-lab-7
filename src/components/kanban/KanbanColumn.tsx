import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onAddTask: (columnId: Column["id"]) => void;
}

const columnStyles: Record<Column["id"], string> = {
  todo: "border-t-chart-1",
  inProgress: "border-t-chart-4",
  done: "border-t-chart-2",
};

const columnBgStyles: Record<Column["id"], string> = {
  todo: "bg-chart-1/10",
  inProgress: "bg-chart-4/10",
  done: "bg-chart-2/10",
};

export function KanbanColumn({
  column,
  tasks,
  onDeleteTask,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={`flex flex-col rounded-xl border-t-4 ${columnStyles[column.id]} bg-card shadow-sm min-w-[300px] max-w-[350px] flex-1`}
    >
      <div className={`p-4 ${columnBgStyles[column.id]} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-card-foreground">{column.title}</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
              {tasks.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background/50"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 space-y-3 min-h-[200px] transition-colors duration-200 ${
          isOver ? "bg-primary/5" : ""
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-8">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
