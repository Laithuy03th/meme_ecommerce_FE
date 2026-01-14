"use server";

import { userApi, CreateUserRequest } from "@/services/userApi";
import { revalidatePath } from "next/cache";

export async function updateStatusAction(id: number, status: "ACTIVE" | "INACTIVE" | "LOCKED") {
    try {
        await userApi.updateUserStatus(id, status);
        revalidatePath(`/users/${id}`);
        revalidatePath(`/users`);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateRolesAction(id: number, roles: string[]) {
    try {
        await userApi.updateUserRoles(id, roles);
        revalidatePath(`/users/${id}`);
        revalidatePath(`/users`);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePasswordAction(id: number, password: string) {
    try {
        await userApi.updateUserPassword(id, password);
        revalidatePath(`/users/${id}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function createUserAction(data: CreateUserRequest) {
    try {
        await userApi.createUser(data);
        revalidatePath("/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteUserAction(id: number) {
    try {
        await userApi.deleteUser(id);
        revalidatePath("/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
