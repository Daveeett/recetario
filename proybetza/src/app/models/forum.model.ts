export type PostType = 'review' | 'request';

export interface ForumPost {
  id: number;
  userId: number;
  username: string;
  title: string;
  content: string;
  postType: PostType;
  likesCount: number;
  userHasLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}


