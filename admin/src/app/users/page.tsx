import { userApi } from "@/services/userApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AddUser from "@/components/AddUser";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const UsersPage = async () => {
  const response = await userApi.getUsers();
  const data = response.content;

  return (
    <div className="">
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

export default UsersPage;
