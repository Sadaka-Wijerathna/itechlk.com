interface IBlogType {
  id: string | number;
  image?: string;
  img?: string; // fallback for static data
  title: string;
  author: string;
  createdAt?: string | Date;
  date?: string; // fallback for static data
  updatedAt?: string | Date;
  content?: string;
  desc?: string; // fallback for static data
  slug?: string;
  category?: string;
  tags?: string[];
  active?: boolean;
  blog?: string;
}

export default IBlogType;
