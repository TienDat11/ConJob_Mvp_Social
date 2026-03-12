"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import {del, put} from "@vercel/blob";
import path from "path";
import { File as NodeFile } from "formdata-node";

export async function saveResumes(values: ResumeValues) {
  const {id} = values;


  const {
    photo, workExperiences, educations, ...resumeValues
  } = resumeSchema.parse(values)

  const {user} = await validateRequest();

  if (!user) {
    throw new Error("User not authenticated")
  }

  const existingResume = id
  ? await prisma.resume.findUnique({
      where: {
        id,
        userId: user.id,
      },
    })
  : null;

  if (id && !existingResume) {
    throw new Error("Resume not found")
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof NodeFile) {
    if(existingResume?.photoUrl) {
      await del(existingResume?.photoUrl)
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url
  } else if(photo === null) {
    if(existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if(id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId: user.id,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : undefined,
            endDate: edu.endDate ? new Date(edu.endDate) : undefined,
          })),
        },
      },
    });
  }
}
