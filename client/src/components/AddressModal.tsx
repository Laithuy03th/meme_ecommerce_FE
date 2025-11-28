"use client";

import { createAddress, updateAddress } from "@/services/api";
import { AddressType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const addressSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    addressLine1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"), // Mapping city to province/city for simplicity or keep as is
    state: z.string().min(1, "State/District is required"), // Mapping to district
    zipCode: z.string().optional(),
    isDefault: z.boolean().optional(),
});

type AddressFormInputs = z.infer<typeof addressSchema>;

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: AddressType;
}

const AddressModal = ({ isOpen, onClose, onSuccess, initialData }: AddressModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormInputs>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            isDefault: false,
        },
    });

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                fullName: initialData.fullName,
                phone: initialData.phone,
                addressLine1: initialData.addressLine1,
                city: initialData.province, // Assuming province maps to city in this simple form
                state: initialData.district, // Assuming district maps to state
                zipCode: initialData.zipCode,
                isDefault: initialData.default || initialData.isDefault,
            });
        } else if (isOpen) {
            reset({
                fullName: "",
                phone: "",
                addressLine1: "",
                city: "",
                state: "",
                zipCode: "",
                isDefault: false,
            });
        }
    }, [isOpen, initialData, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: AddressFormInputs) => {
        try {
            const payload = {
                fullName: data.fullName,
                phone: data.phone,
                addressLine1: data.addressLine1,
                ward: "Ward", // Default or add field
                district: data.state,
                province: data.city,
                country: "Vietnam",
                zipCode: data.zipCode || "",
                isDefault: data.isDefault,
            };

            if (initialData) {
                await updateAddress(initialData.id, payload);
                toast.success("Address updated successfully");
            } else {
                await createAddress(payload);
                toast.success("Address created successfully");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to save address");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {initialData ? "Edit Address" : "Add New Address"}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input {...register("fullName")} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="John Doe" />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input {...register("phone")} type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="+1 234 567 890" />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input {...register("addressLine1")} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="123 Main St" />
                        {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City / Province</label>
                            <input {...register("city")} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="New York" />
                            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District / State</label>
                            <input {...register("state")} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="NY" />
                            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input {...register("isDefault")} type="checkbox" id="default" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="default" className="text-sm text-gray-600">Set as default address</label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
