package com.example.taskmanagerapi.repository;

import com.example.taskmanagerapi.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    // String corresponds to the type of the ID field in the Task entity
    // Additional custom query methods can be added here if needed later.
    // For example:
    // List<Task> findByStatus(String status);
}
