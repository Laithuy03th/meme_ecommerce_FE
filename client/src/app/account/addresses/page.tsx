"use client";

import AddressModal from "@/components/AddressModal";
import { deleteAddress, getAddresses, setDefaultAddress } from "@/services/api";
import { AddressType } from "@/types";
import { Edit2, Loader2, MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddressesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);

    const fetchAddresses = async () => {
        try {
            const data = await getAddresses();
            // Sort: Default first, then new to old
            const sorted = data.sort((a, b) => {
                if (a.default && !b.default) return -1;
                if (!a.default && b.default) return 1;
                return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
            });
            setAddresses(sorted);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleEdit = (address: AddressType) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteAddress(id);
            toast.success("Address deleted successfully");
            fetchAddresses();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete address");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await setDefaultAddress(id);
            toast.success("Default address updated");
            fetchAddresses();
        } catch (error: any) {
            toast.error(error.message || "Failed to set default address");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your shipping addresses ({addresses.length})</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {addresses.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">You haven't added any addresses yet.</p>
                        <button onClick={handleAdd} className="text-primary font-medium hover:underline mt-2">Add your first address</button>
                    </div>
                )}

                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`border rounded-xl p-5 relative group transition-all hover:shadow-md ${addr.default ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:border-gray-200"
                            }`}
                    >
                        {addr.default && (
                            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-primary bg-white px-2 py-1 rounded shadow-sm border border-primary/20">
                                <CheckCircle2 className="w-3 h-3" /> Default
                            </div>
                        )}

                        <div className="flex items-start gap-3 mb-3 pr-16">
                            <div className={`mt-1 p-2 rounded-full ${addr.default ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}`}>
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{addr.fullName}</p>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                    {addr.addressLine1}<br />
                                    {addr.ward}, {addr.district}<br />
                                    {addr.province}, {addr.country}
                                </p>
                                <p className="text-sm text-gray-500 mt-2 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded">{addr.phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(addr)}
                                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                            >
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>

                            {!addr.default && (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                                >
                                    Set as Default
                                </button>
                            )}

                            <div className="flex-1"></div>

                            <button
                                onClick={() => handleDelete(addr.id)}
                                className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchAddresses();
                }}
                initialData={editingAddress ?? undefined}
            />
        </div>
    );
};

export default AddressesPage;
