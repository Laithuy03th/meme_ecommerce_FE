"use client";

import { deleteAddress, getAddresses, setDefaultAddress } from "@/services/api";
import { AddressType } from "@/types";
import { ArrowRight, Edit2, MapPin, Plus, Trash2, Home, CheckCircle } from "lucide-react";
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
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
            <p className="text-gray-500 text-sm mt-0.5">Choose where to deliver your order</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingAddress(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add New
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-500 mb-6">Please add a shipping address to continue with your order</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-lg bg-white ${selectedId === addr.id
                  ? "border-primary shadow-primary/10"
                  : "border-gray-100 hover:border-primary/30"
                }`}
              onClick={() => setSelectedId(addr.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedId === addr.id ? "border-primary bg-gradient-to-r from-primary to-secondary" : "border-gray-300"
                    }`}>
                    {selectedId === addr.id && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">{addr.fullName}</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600 font-medium">{addr.phone}</span>
                      {(addr.default || addr.isDefault) && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {addr.addressLine1}, {addr.ward}, {addr.district}, {addr.province}
                    </p>
                    {!(addr.default || addr.isDefault) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(addr.id);
                        }}
                        className="mt-3 text-xs text-primary hover:text-primary-dark font-bold underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAddress(addr);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr.id);
                    }}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={!selectedId}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        Continue to Payment
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
