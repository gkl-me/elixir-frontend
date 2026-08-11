"use server";

import { handlerServerError } from "@/lib/authHelper";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { projectService } from "@/services/project.service";
import { CreateProjectData } from "@/types/IProjectType";



export async function createProjectAction(data: CreateProjectData) {
    try {
        const res = await projectService.handleCreateProject(data)
        return {
            success: res.data.success,
            message: res.data.message,
        };
    } catch (error) {
        handlerServerError(error);
        return {
            success: false,
            error: AxiosErrorHandler(error).message,
        };
    }
}