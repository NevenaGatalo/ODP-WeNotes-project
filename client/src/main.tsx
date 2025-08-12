import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/auth/AuthContext.tsx";
import { BrowserRouter } from "react-router-dom";

//<BrowserRouter></BrowserRouter> - omogucava da koristimo navigaciju i rute bazirane na URL-u
//<AuthProvider> - Sve komponente unutar ovog providera mogu da pristupe autentifikaciji preko useContext(AuthContext).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
