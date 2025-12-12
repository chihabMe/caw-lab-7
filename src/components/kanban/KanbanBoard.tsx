import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Task, ColumnId, COLUMNS } from "@/types/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskCard } from "./TaskCard";
import { toast } from "@/hooks/use-toast";

const initialTasks: Task[] = [
  { id: "1", title: "Design mockups", description: "Create wireframes for the new dashboard", columnId: "todo" },
  { id: "2", title: "Set up project", description: "Initialize repository and configure CI/CD", columnId: "todo" },
  { id: "3", title: "API integration", description: "Connect to backend services", columnId: "inProgress" },
  { id: "4", title: "Write documentation", columnId: "inProgress" },
  { id: "5", title: "Research competitors", description: "Analyze market trends", columnId: "done" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnId>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByColumn = (columnId: ColumnId) =>
    tasks.filter((task) => task.columnId === columnId);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dropping over a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newColumnId = overId as ColumnId;
      if (activeTask.columnId !== newColumnId) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.id === activeId ? { ...t, columnId: newColumnId } : t
          )
        );
      }
      return;
    }

    // Check if dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((tasks) =>
        tasks.map((t) =>
          t.id === activeId ? { ...t, columnId: overTask.columnId } : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Reorder within the same column
    if (overTask && activeTask.columnId === overTask.columnId) {
      setTasks((tasks) => {
        const columnTasks = tasks.filter(
          (t) => t.columnId === activeTask.columnId
        );
        const otherTasks = tasks.filter(
          (t) => t.columnId !== activeTask.columnId
        );

        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        const reorderedColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        return [...otherTasks, ...reorderedColumnTasks];
      });
    }
  };

  const handleAddTask = (
    title: string,
    description: string,
    columnId: ColumnId
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: description || undefined,
      columnId,
    };
    setTasks((tasks) => [...tasks, newTask]);
    toast({
      title: "Task created",
      description: `"${title}" added to ${COLUMNS.find((c) => c.id === columnId)?.title}`,
    });
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed`,
      });
    }
  };

  const openAddDialog = (columnId: ColumnId) => {
    setSelectedColumn(columnId);
    setDialogOpen(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onDeleteTask={handleDeleteTask}
              onAddTask={openAddDialog}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onDelete={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddTask={handleAddTask}
        defaultColumnId={selectedColumn}
      />
    </>
  );
}
