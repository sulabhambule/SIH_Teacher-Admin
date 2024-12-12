import { asyncHandler } from "../utils/AsyncHandler2";
import { ApiError } from "@google-cloud/storage";
import { ApiResponse } from "../utils/ApiResponse";
import { TaskAssigned } from "../models/taskAssignedByAdmin.models";
import { HODAssigned } from "../models/taskAssignedByHOD.models";
import { CompletedTask } from "../models/taskCompleted.models";

// Controller to assign a task to a teacher
export const assignTask = asyncHandler(async (req, res) => {
    const { title, description, taskType, assignedTo, task, deadline } = req.body;

    if (!teacherId || !task || !deadline) {
        throw new ApiError(400, "All fields are required");
    }

    const assignedTask = await TaskAssigned.create({
        teacherId,
        task,
        deadline,
    });

    res.status(201).json(new ApiResponse(201, assignedTask, "Task assigned successfully"));
});