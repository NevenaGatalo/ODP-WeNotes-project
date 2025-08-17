import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import KontrolnaTablaUserStranica from "./pages/kontrolna_tabla/KontrolnaTablaUserStranica";
import KontrolnaTablaAdminStranica from "./pages/kontrolna_tabla/KontrolnaTablaAdminStranica";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import { usersApi } from "./api_services/users/UsersAPIService";
import NotesGridPage from "./pages/notes/NotesGridPage";
import { notesApi } from "./api_services/notes/NotesAPIService";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundStranica />} />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              {/* <--umesto ove komponente treba da se prikaze nasa komponenta sa svim beleskama--> */}
              {/* <KontrolnaTablaUserStranica /> */}
              
              <NotesGridPage notesApi={notesApi}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <KontrolnaTablaAdminStranica usersApi={usersApi} /> 
            </ProtectedRoute>
          }
        />

        {/* Preusmerava na dashboard kao default rutu */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all ruta za nepostojeće stranice */}
        <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
