interface IBlogType {
  id: string | number;
  image: string;
  title: string;
  author: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  content: string;
  slug: string;
  category: string;
  tags?: string[];
  active?: boolean;
  blog?: string;
}

export default IBlogType;
