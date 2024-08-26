export const PATH_URL = {
  ROOT: "/",
  GOOGLE_LOGIN: "/login/google",

  SIGN_UP: "/signup",
  SIGN_IN: "/login",

  BOOKMARK: "/bookmarks",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",

  hashtag: (tag: string) => `/hashtag/${tag}`,
  userProfile: (username: string) => `/users/${username}`,
  postItem: (postId: string | null) => `/posts/${postId}`,

  searchQuery: (query: string) => `/search?q=${query}`,
};
