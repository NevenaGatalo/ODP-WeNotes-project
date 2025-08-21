import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import NotesGridPage from "./pages/notes/NotesGridPage";
import { notesApi } from "./api_services/notes/NotesAPIService";
import { Toaster } from "react-hot-toast";
import SharedNotePage from "./pages/notes/SharedNotePage";

function App() {
  return (

    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
        <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
        <Route path="/404" element={<NotFoundStranica />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute  requiredRole={["user", "admin"]}>
              <NotesGridPage notesApi={notesApi} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shared/:share_guid"
          element={
            <SharedNotePage></SharedNotePage>
          }
        />

        {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all ruta za nepostojeće stranice */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>

  );
}

export default App;
