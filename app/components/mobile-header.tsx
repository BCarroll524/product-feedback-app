import { UserCard } from "./user-card";

const MobileHeader = () => {
  return (
    <nav className="hidden sm:block sm:w-full">
      <UserCard className="rounded-none" />
    </nav>
  );
};

export { MobileHeader };
