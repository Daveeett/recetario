import type { PostType } from '../forum.model';

export interface CreatePostPayload {
  title: string;
  content: string;
  postType: PostType;
}
