import UsersClient from "./users-client";

// Shell page — data fetching is handled inside UsersClient (Client Component)
// to avoid Server Component limitations (no localStorage, no window).
const UsersPage = () => {
  return <UsersClient />;
};

export default UsersPage;
