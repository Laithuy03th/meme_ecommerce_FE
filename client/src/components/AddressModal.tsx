"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

const AddressModal = ({ isOpen, onClose, onSubmit, initialData }: AddressModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {initialData ? "Edit Address" : "Add New Address"}
                </h2>

                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    // Mock submit
                    onSubmit({});
                    onClose();
                }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="+1 234 567 890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="New York" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary" placeholder="NY" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="default" className="rounded border-gray-300 text-primary focus:ring-primary" />
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
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
