"use client";

import { deleteAddress, getAddresses, setDefaultAddress } from "@/services/api";
import { AddressType } from "@/types";
import { ArrowRight, Edit2, MapPin, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddressModal from "./AddressModal";

const ShippingForm = ({
  onAddressSelect,
}: {
  onAddressSelect: (addressId: number) => void;
}) => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(data);
      // Auto-select default address
      const defaultAddr = data.find((a) => a.default || a.isDefault);
      if (defaultAddr && !selectedId) {
        setSelectedId(defaultAddr.id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleContinue = () => {
    if (selectedId) {
      onAddressSelect(selectedId);
    } else {
      toast.error("Please select a shipping address");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        toast.success("Address deleted");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
        <button
          onClick={() => {
            setEditingAddress(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No addresses found. Please add one to continue.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedId === addr.id
                ? "border-primary bg-primary/5"
                : "border-gray-100 hover:border-gray-200"
                }`}
              onClick={() => setSelectedId(addr.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedId === addr.id ? "border-primary" : "border-gray-300"
                    }`}>
                    {selectedId === addr.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{addr.fullName}</span>
                      <span className="text-gray-500 text-sm">| {addr.phone}</span>
                      {(addr.default || addr.isDefault) && (
                        <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {addr.addressLine1}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(addr);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {!(addr.default || addr.isDefault) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetDefault(addr.id);
                  }}
                  className="absolute bottom-4 right-4 text-xs text-gray-400 hover:text-primary font-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={!selectedId}
        className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        Continue to Payment
        <ArrowRight className="w-4 h-4" />
      </button>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAddresses}
        initialData={editingAddress}
      />
    </div>
  );
};

export default ShippingForm;
