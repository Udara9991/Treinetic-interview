// task-manager-ui/src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../models/task.model'; // Adjust path if necessary

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks'; // Backend API URL
  // Later, this will be updated to use an auth service to get the token
  // For now, assuming protected routes might fail without a token,
  // or we are testing against non-protected versions first.
  // private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  // Method to get headers, potentially including JWT token later
  private getAuthHeaders(): HttpHeaders {
    // const token = 'YOUR_JWT_TOKEN'; // This will be dynamically fetched later
    // For now, let's assume we might need to set Content-Type
    // If JWT is implemented on backend and required, these requests will fail with 401/403
    // until token handling is added.
    // For now, let's just ensure Content-Type for POST/PUT
    return new HttpHeaders({
      'Content-Type': 'application/json'
      // 'Authorization': `Bearer ${token}` // Uncomment and use when JWT is handled
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        map(tasks => tasks.map(task => ({ ...task, createdAt: task.createdAt ? new Date(task.createdAt) : undefined }))),
        catchError(this.handleError)
      );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(task => ({ ...task, createdAt: task.createdAt ? new Date(task.createdAt) : undefined })),
        catchError(this.handleError)
      );
  }

  createTask(task: Task): Observable<Task> {
    // Backend will set id and createdAt
    const { id, createdAt, ...taskData } = task;
    return this.http.post<Task>(this.apiUrl, taskData, { headers: this.getAuthHeaders() })
      .pipe(
        map(newTask => ({ ...newTask, createdAt: newTask.createdAt ? new Date(newTask.createdAt) : undefined })),
        catchError(this.handleError)
      );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    const { createdAt, ...taskData } = task; // Don't send createdAt for update, backend should preserve original
                                            // ID is in the URL, not body usually for PUT
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData, { headers: this.getAuthHeaders() })
      .pipe(
        map(updatedTask => ({ ...updatedTask, createdAt: updatedTask.createdAt ? new Date(updatedTask.createdAt) : undefined })),
        catchError(this.handleError)
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        // Attempt to get more specific error message from backend response
         if (error.error.message) {
            errorMessage += `\nDetails: ${error.error.message}`;
         } else if (error.error.errors) {
            const errors = Object.entries(error.error.errors)
                                 .map(([field, message]) => `${field}: ${message}`)
                                 .join(', ');
            errorMessage += `\nValidation Errors: ${errors}`;
         }
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
