import { Link } from "react-router-dom";

export default function NotFoundStranica() {
/*   return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-lg border border-slate-500 shadow-xl rounded-2xl px-10 py-14 text-center max-w-lg w-full">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Stranica nije pronadjena</h2>
        <p className="text-gray-600 mb-6">
          Stranica koju trazite ne postoji ili je premestena.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-700/70 text-white px-6 py-2 rounded-xl hover:bg-blue-700/90 transition"
        >
          Nazad na pocetnu
        </Link>
      </div>
    </main>
  ); */
  return (
  <main className="min-h-screen bg-black flex items-center justify-center p-6">
    <div className="bg-gray-900 p-12 rounded-2xl shadow-lg border border-gray-700 text-white text-center max-w-md w-full">
      <h1 className="text-6xl font-extrabold text-yellow-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Stranica nije pronađena</h2>
      <p className="text-gray-300 mb-6">
        Stranica koju tražite ne postoji ili je premještena.
      </p>
      <Link
        to="/"
        className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition shadow-md"
      >
        Nazad na početnu
      </Link>
    </div>
  </main>
);

  
}
