// task-manager-ui/src/app/models/task.model.ts
export interface Task {
    id?: string; // Optional because it won't exist for new tasks before saving
    title: string;
    description?: string; // Optional as per backend DTO (assuming it can be null)
    status: string; // e.g., "TO_DO", "IN_PROGRESS", "DONE"
    createdAt?: string | Date; // Optional, and backend sends it as string, might convert to Date
}
