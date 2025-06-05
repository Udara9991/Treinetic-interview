import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup; // Definite assignment assertion
  isEditMode = false;
  taskId: string | null = null;
  isLoading = false;
  error: string | null = null;
  availableStatuses: string[] = ['TO_DO', 'IN_PROGRESS', 'DONE']; // Example statuses

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: [this.availableStatuses[0], Validators.required] // Default to TO_DO
    });

    if (this.isEditMode && this.taskId) {
      this.loadTaskForEdit(this.taskId);
    }
  }

  loadTaskForEdit(id: string): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = `Failed to load task: ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched(); // Mark fields to show validation errors
      return;
    }

    this.isLoading = true;
    this.error = null;
    const taskData: Task = this.taskForm.value as Task;

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => this.router.navigate(['/tasks']), // Navigate to list after update
        error: (err) => {
          this.error = `Failed to update task: ${err.message}`;
          this.isLoading = false;
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: () => this.router.navigate(['/tasks']), // Navigate to list after creation
        error: (err) => {
          this.error = `Failed to create task: ${err.message}`;
          this.isLoading = false;
        }
      });
    }
  }

  // Helper getters for template validation
  get title() { return this.taskForm.get('title'); }
  get description() { return this.taskForm.get('description'); }
  get status() { return this.taskForm.get('status'); }
}
