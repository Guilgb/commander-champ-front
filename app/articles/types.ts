export interface Articles {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  views: number;
  comments: number;
  featured: boolean;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}
