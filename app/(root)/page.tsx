import { onBoardUser } from "@/modules/auth/actions";

export default async function Home() {
  await onBoardUser();
  return <div className="flex items-center justify-center h-screen"></div>;
}
