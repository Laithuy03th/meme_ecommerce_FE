"use client";

import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import AddressModal from "@/components/AddressModal";

const AddressesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);

    const handleEdit = (address: any) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-primary bg-primary/5 rounded-xl p-4 relative group">
                    <div className="absolute top-4 right-4 text-xs font-bold text-primary bg-white px-2 py-1 rounded shadow-sm">Default</div>
                    <div className="flex items-start gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                            <p className="font-bold text-gray-900">Home</p>
                            <p className="text-sm text-gray-600 mt-1">
                                123 Main Street, Apt 4B<br />
                                New York, NY 10001<br />
                                United States
                            </p>
                            <p className="text-sm text-gray-600 mt-2">+1 234 567 890</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4 pt-4 border-t border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleEdit({ id: 1 })}
                            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => console.log(data)}
                initialData={editingAddress}
            />
        </div>
    );
};

export default AddressesPage;
