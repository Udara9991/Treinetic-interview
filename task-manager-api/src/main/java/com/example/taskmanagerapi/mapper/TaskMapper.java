package com.example.taskmanagerapi.mapper;

import com.example.taskmanagerapi.dto.TaskDto;
import com.example.taskmanagerapi.model.Task;
import java.util.stream.Collectors;
import java.util.List;

public class TaskMapper {

    public static TaskDto toDto(Task task) {
        if (task == null) {
            return null;
        }
        return new TaskDto(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getCreatedAt()
        );
    }

    public static Task toEntity(TaskDto taskDto) {
        if (taskDto == null) {
            return null;
        }
        Task task = new Task();
        task.setId(taskDto.getId()); // Usually ID is not set from DTO for creation, but can be for update
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setCreatedAt(taskDto.getCreatedAt()); // createdAt is usually set by the server
        return task;
    }

    public static List<TaskDto> toDtoList(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }
        return tasks.stream().map(TaskMapper::toDto).collect(Collectors.toList());
    }
}
