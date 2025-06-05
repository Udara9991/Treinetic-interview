// task-manager-ui/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

const routes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent }, // For creating new tasks
  { path: 'tasks/edit/:id', component: TaskFormComponent }, // For editing existing tasks
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }, // Default route
  // Optional: Add a wildcard route for 404 page later
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
