import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>;
