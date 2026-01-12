import { GoogleLogin } from "@react-oauth/google";

export default function Auth() {
  const backend = import.meta.env.VITE_BACKEND_URL;

  return (
    <GoogleLogin
      onSuccess={async (cred) => {
        const res = await fetch(`${backend}/auth/google/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: cred.credential }),
        });

        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
      }}
      onError={() => console.log("Google Login Failed")}
    />
  );
}
