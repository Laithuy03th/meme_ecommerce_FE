"use server";

import { productApi, CreateProductRequest } from "@/services/productApi";
import { revalidatePath } from "next/cache";

export async function createProductAction(data: CreateProductRequest) {
    try {
        await productApi.create(data);
        revalidatePath("/products");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateProductAction(id: number, data: Partial<CreateProductRequest>) {
    try {
        await productApi.update(id, data);
        revalidatePath("/products");
        revalidatePath(`/products/${id}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteProductAction(id: number) {
    try {
        await productApi.delete(id);
        revalidatePath("/products");
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
