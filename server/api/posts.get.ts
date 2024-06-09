import { Post } from "~/database/models";

export default defineEventHandler(async (event) => {
  const posts = await Post.findAll();
  return posts;
});
