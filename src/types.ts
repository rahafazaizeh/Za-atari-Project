export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface DailyProduction {
  id: string;
  date: string; // ISO string
  cabinets: {
    target: number;
    actual: number;
    status: TaskStatus;
  };
  meters: {
    target: number;
    actual: number;
    status: TaskStatus;
  };
}

export interface ProjectTotals {
  cabinets: {
    total: number;
    completed: number;
  };
  meters: {
    total: number;
    completed: number;
  };
}
