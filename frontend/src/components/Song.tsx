type Props = {
  title: string;
  videoAuthor: string;
  user: string;
  thumbnail: string;
  image: string;
};

function Song({ title, videoAuthor, user, image }: Props) {
  return (
    <div className="flex w-full space-x-4 rounded-xl border border-zinc-600 bg-zinc-800 transition-all hover:bg-zinc-600">
      <img
        src={image}
        className="w-48 rounded-l-xl object-fill"
        alt="Thumbnail"
      />
      <div className="flex flex-col justify-between py-4">
        <div>
          <h3>{title}</h3>
          <h4>{videoAuthor}</h4>
        </div>
        <p>{user}</p>
      </div>
    </div>
  );
}
export default Song;
