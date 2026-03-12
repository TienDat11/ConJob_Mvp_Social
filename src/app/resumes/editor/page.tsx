import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { Metadata } from "next";
import ResumeEditor from "./ResumesEditor";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: Readonly<PageProps>) {
  const { resumeId } = await searchParams;

  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId, userId: user.id },
        include: resumeDataInclude,
      })
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
