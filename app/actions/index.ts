"use server";

import z from "zod";
import { postSchema } from "../schemas/blog";
import { getToken } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";

export const createPostAction = async (data: z.infer<typeof postSchema>) => {
  try {
    const token = await getToken();
    const parsedData = postSchema.safeParse(data);

    if (!parsedData.success) {
      return {
        success: false,
        message: parsedData.error.message,
      };
    }

    const imageUploadUrl = await fetchMutation(
      api.post.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUploadUrl, {
      method: "POST",
      headers: { "Content-Type": parsedData.data.image!.type },
      body: parsedData.data.image,
    });

    if (!uploadResult.ok) {
      return {
        success: false,
        message: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.post.createPost,
      {
        title: parsedData.data.title,
        body: parsedData.data.content,
        imageStorageId: storageId,
      },
      { token }
    );

    revalidatePath("/blog");

    return {
      success: true,
      message: "Post created successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create post",
    };
  }
};
