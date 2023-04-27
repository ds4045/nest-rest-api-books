export type User = {
  id: number;
  isAdmin: boolean;
  email: string;
  userImageUrl: string;
  name: string;
  about: string;
  favorites: Item[];
  basket: Item[];
  posts: Post[];
  likedPosts: number[];
  orders: Item[];
  userReviews: UserReview[];
};
export type Item = {
  id: number;
  inStock: boolean;
  title: string;
  itemImageUrl: string;
  reviews: UserReview[];
  description: string;
  price: number;
  genre: string;
  authorBook: string;
  releaseDate: string;
};
export type Post = {
  id: number;
  description: string;
  postImageUrl: string;
  title: string;
  date: string;
  authorName: string;
  authorId: string;
  viewing: number;
  likes: number;
};
export type UserReview = {
  id: number;
  text: string;
  authorId: number;
  authorName: string;
  date: string;
};
