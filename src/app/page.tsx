import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">SANMEXX</h1>
        <p className="text-xl text-gray-400 mb-8">Sistema Integrado de Gestão Logística</p>
        
        <Link 
          href="/login" 
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Acessar Sistema
        </Link>
      </div>
    </main>
  );
}