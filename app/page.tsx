import { onBoardUser } from "@/modules/auth/actions";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  await onBoardUser();
  return (
    <div className="flex items-center justify-center h-screen">
      <UserButton />
    </div>
  );
}
