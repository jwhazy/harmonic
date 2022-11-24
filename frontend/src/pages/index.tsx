import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import auth from "../utils/auth";
import checkStatus from "../utils/checkStatus";

function Index() {
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("HARMONIC");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    checkStatus().then((data) => {
      setAllowed(data.frontend);
      setName(data.name);
      document.title = name;
    });
  }, [name]);

  const submit = async () => {
    if (!password) return setError("Please enter your password.");
    const status = await auth(password);

    if (status.token) {
      navigate("/dashboard");
      localStorage.setItem("token", status.token);
    } else if (status.message) {
      setError(status.message);
    } else {
      setError("An unknown error occurred. Please try again.");
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center space-x-8">
        <main className="animate__animated animate__fadeInUp space-y-3 p-5">
          <div className="flex flex-col items-center justify-center space-y-6 text-center lg:flex-row lg:items-start lg:justify-start lg:space-y-0 lg:space-x-8">
            <div className="h-full w-full space-y-4 pb-8">
              <div>
                <h1 className="text-6xl font-black lg:text-8xl">
                  {name.toUpperCase()}
                </h1>
              </div>
              {allowed ? (
                <>
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(() => {
                          return (e.target as HTMLInputElement).value;
                        })
                      }
                    />
                    <Button onClick={submit}>-{">"}</Button>
                  </div>
                  {error && (
                    <p className="text-red-500">
                      {error || "An unknown error occurred. Please try again."}
                    </p>
                  )}
                </>
              ) : (
                <h2 className="text-red-500">Frontend is disabled.</h2>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Index;
