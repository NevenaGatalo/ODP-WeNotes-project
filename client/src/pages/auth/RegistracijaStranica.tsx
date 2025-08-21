import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import type { IAuthAPIService } from "../../api_services/auth/IAuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

interface RegistracijaPageProps {
  authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegistracijaPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user)
      navigate(`/dashboard`);
  }, [isAuthenticated, navigate, user]);

  // RegistracijaStranica
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <RegistracijaForma authApi={authApi} />
    </main>
  );

}
