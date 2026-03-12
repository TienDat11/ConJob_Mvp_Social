import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../(main)/SessionProvider";
import Navbar from "../(main)/Navbar";
import { Toast } from "@/components/ui/toast";



export default async function ResumesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
          {children}
      </div>
    </SessionProvider>
  );
}
