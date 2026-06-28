"use client";

import { updateProfile } from "@/services/api/authApi";
import { authenticatedFetch } from "@/services/api/base";
import { uploadFile } from "@/services/api/fileApi";
import { UserType } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { Camera, Loader2, Mail, Phone, Save, User, Calendar } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const { accessToken, updateTokens } = useAuthStore();


    const { register, handleSubmit, reset } = useForm<Partial<UserType>>();

    
    const fetchProfile = async () => {
        try {
            const res = await authenticatedFetch("/users/me");
            if (res.ok) {
                const data = await res.json();

                if (data.avatar && !data.avatarUrl) {
                    data.avatarUrl = data.avatar;
                }

                setUser(data);

                let formattedDob = "";
                if (data.dateOfBirth) {
                    const parts = data.dateOfBirth.split('-');
                    if (parts.length === 3) {
                        formattedDob = data.dateOfBirth;
                    }
                }
                reset({ ...data, dateOfBirth: formattedDob });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const onSubmit = async (data: Partial<UserType>) => {
        try {
            const payload = {
                fullName: data.fullName,
                phone: data.phone,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
            };

            await updateProfile(payload);
            toast.success("Profile updated successfully");
            fetchProfile();
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        const toastId = toast.loading("Uploading avatar...");
        try {
            const url = await uploadFile(file);
            console.log("Uploaded Avatar URL:", url);

           
            if (user) {
                setUser({ ...user, avatarUrl: url });
            }

            
            const updatePayload: any = {
                fullName: user?.fullName,
                phone: user?.phone,
                avatar: url
            };

           
            if (user?.gender) updatePayload.gender = user.gender;
            if (user?.dateOfBirth) updatePayload.dateOfBirth = user.dateOfBirth;

           
            const updatedUser = await updateProfile(updatePayload);

          
            if ((updatedUser as any).avatar && !updatedUser.avatarUrl) {
                updatedUser.avatarUrl = (updatedUser as any).avatar;
            }

           
            if (accessToken) {
                updateTokens(updatedUser, accessToken);
            }

           
            setUser(updatedUser);

            toast.update(toastId, { render: "Avatar updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error: any) {
            console.error(error);
            toast.update(toastId, { render: error.message || "Failed to upload avatar", type: "error", isLoading: false, autoClose: 3000 });
            fetchProfile(); // Fallback fetch
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    if (!user) return <div>Failed to load profile.</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    <p className="text-gray-500 mt-1">Manage your personal information</p>
                </div>
                <div>
                    {user.verified && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Verified Account
                        </span>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Stats */}
                <div className="space-y-6">
                    {/* Avatar Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                        <div
                            className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 relative">
                                <img
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=random`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-500 mb-4">Member since {user.memberSince || new Date().getFullYear()}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4">Account Overview</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Total Orders</span>
                                <span className="font-bold text-gray-900">{user.totalOrders || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-500 text-sm">Total Spent</span>
                                <span className="font-bold text-gray-900">{formatPrice(user.totalSpent || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 text-sm">Membership</span>
                                <span className="font-bold text-primary">{user.membershipLevel || "Standard"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Info Form */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                          
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        {...register("fullName", { required: true })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input type="email" {...register("email")} disabled className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input type="tel" {...register("phone")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                                    <select
                                        {...register("gender")}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none bg-white"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.65em auto' }}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <input type="date" {...register("dateOfBirth")} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Please select your full date of birth</p>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button type="submit" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
