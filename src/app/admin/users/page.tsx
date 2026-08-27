import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <UsersClient users={users} currentUserEmail={session?.user?.email} />;
}
