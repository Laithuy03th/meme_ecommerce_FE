"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/services/userApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AddUser from "@/components/AddUser";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const UsersClient = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getUsers();
      setData(response.content);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button variant="outline" onClick={fetchUsers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="font-semibold">All Users</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Add User</Button>
          </SheetTrigger>
          <AddUser />
        </Sheet>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersClient;
