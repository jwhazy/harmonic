export type Song = {
  url: string;
  requesterId: string;
  requesterName: string;
  title: string;
  thumbnail: string;
  author: string;
  avatar: string;
  duration: string;
  description?: string | null;
};

export default Song;
