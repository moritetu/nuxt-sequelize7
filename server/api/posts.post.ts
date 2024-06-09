import { z } from "zod";
import { User } from "~/database/models";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(
    event,
    z.object({
      title: z.string(),
      content: z.string(),
    }).parse,
  );

  const user = await User.findOne({ where: { name: "admin" } });
  const post = await user!.createPost(body);
  return post;
});
