import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import checkStatus from "../network/checkStatus";
import verify from "../network/verify";
import getQueue from "../network/getQueue";
import SongType from "../types/Song";
import Song from "../components/Song";
import Spinner from "../components/Spinner";

function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [queue, setQueue] = useState<SongType[]>();
  const [name, setName] = useState("");

  useEffect(() => {
    checkStatus().then((data) => {
      setName(data.name);
      document.title = name;
    });
  }, [name]);

  const navigate = useNavigate();

  const check = useCallback(async () => {
    const token = localStorage.getItem("token");
    const status = await verify(token as string);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !status && navigate("/");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");

    check().then(() => {
      setAuthed(true);
    });

    getQueue().then((q: SongType[]) => {
      setQueue(q);
    });
  }, [check, navigate]);

  if (!authed)
    return (
      <div className="flex h-screen items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex flex-col items-center justify-center space-x-8">
          <Spinner />
        </div>
      </div>
    );

  return (
    <div className="flex h-screen items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-800 to-zinc-900 ">
      <div className="animate__animated animate__zoomIn flex flex-col items-center justify-center space-x-8 ">
        <main className="h-[90vh] w-[95vw] space-y-4 rounded-2xl border border-zinc-600 bg-gray-300 bg-opacity-10 py-4 px-6 shadow-xl backdrop:blur-lg">
          <div className="flex justify-between">
            <h1>
              <a className="font-black">{name.toUpperCase()}</a> Dashboard
            </h1>
            <div className="space-x-4">
              <Button onClick={logout}>Stop bot</Button>
              <Button onClick={logout}>Log out</Button>
            </div>
          </div>
          <div className="flex w-full justify-between space-x-4">
            <div className="w-1/2 space-y-2">
              <div className=" space-y-2">
                <h2>Currently playing</h2>
                <div>
                  {queue && queue.length && queue[0] ? (
                    <Song
                      key={queue[0].title}
                      title={queue[0].title}
                      videoAuthor={queue[0].author}
                      user={queue[0].requesterName}
                      thumbnail={queue[0].avatar}
                      image={queue[0].thumbnail}
                    />
                  ) : null}
                </div>
                <div className="space-y-2 ">
                  <div className="flex w-full space-x-2 pt-2">
                    <Button className="w-full">⏪︎</Button>
                    <Button className="w-full">⏸︎</Button>
                    <Button className="w-full">⏩︎</Button>
                  </div>
                  <div className="flex w-full space-x-2">
                    <Input placeholder="Add to queue" />
                    <Button>+</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <h2>Queue</h2>
              <div>
                {queue && queue?.length ? (
                  queue?.map((song, index) => {
                    if (index === 0) return null;
                    return (
                      <Song
                        key={song.title}
                        title={song.title}
                        videoAuthor={song.author}
                        user={song.requesterName}
                        thumbnail={song.avatar}
                        image={song.thumbnail}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-300">No songs in queue.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
