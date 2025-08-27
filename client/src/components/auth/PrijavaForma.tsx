import { useState } from "react";
import { Link } from "react-router-dom";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { useAuth } from "../../hooks/auth/useAuthHook";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  //iz hook-a useAuth uzima se samo funkcija login
  const { login } = useAuth();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      login(odgovor.data);
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };
  return (
    <div className="bg-gray-900/90 backdrop-blur-md shadow-lg rounded-2xl p-10 w-full max-w-md border border-gray-700 text-white">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">Prijava</h1>
      <form onSubmit={podnesiFormu} className="space-y-4">
        <input
          type="text"
          placeholder="Korisnicko ime"
          value={korisnickoIme}
          onChange={(e) => setKorisnickoIme(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={lozinka}
          onChange={(e) => setLozinka(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {greska && (
          <p className="text-md text-center text-red-500 font-medium">{greska}</p>
        )}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-2 rounded-xl font-semibold hover:bg-yellow-500 transition shadow-md"
        >
          Prijavi se
        </button>
      </form>
      <p className="text-center text-sm mt-4 text-gray-300">
        Nemate nalog?{" "}
        <Link to="/register" className="text-yellow-400 hover:underline">
          Registrujte se
        </Link>
      </p>
    </div>
  );

}
