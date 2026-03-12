import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { PlusSquare } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "Your Resumes"
}

export default async function Page() {
  const {user} = await validateRequest();

  if(!user) {
    return null;
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: resumeDataInclude,
  });

  const totalCount = resumes.length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <Button asChild className="mx-auto flex w-fit gap-3">
        <Link href="/resumes/editor" > 
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </main>
  )
}
