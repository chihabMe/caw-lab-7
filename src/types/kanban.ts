export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
}

export type ColumnId = 'todo' | 'inProgress' | 'done';

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];
