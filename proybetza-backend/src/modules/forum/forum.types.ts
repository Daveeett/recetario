export type PostType = 'review' | 'request';

export interface DbForumPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  post_type: PostType;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ForumPostDTO {
  id: number;
  userId: number;
  username: string;
  title: string;
  content: string;
  postType: PostType;
  likesCount: number;
  userHasLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
