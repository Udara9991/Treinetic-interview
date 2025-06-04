package com.example.taskmanagerapi.service;

import com.example.taskmanagerapi.dto.TaskDto;
import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTasks();
    TaskDto getTaskById(String id);
    TaskDto createTask(TaskDto taskDto);
    TaskDto updateTask(String id, TaskDto taskDto);
    void deleteTask(String id);
}
