'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // --- LÓGICA DE LOGIN ---
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      
      if (res.ok) {
        // CORREÇÃO AQUI: Agora vai para o Painel Principal, não só financeiro
        router.push('/dashboard'); 
      } else {
        alert('Email ou senha incorretos!');
      }

    } else {
      // --- LÓGICA DE CADASTRO ---
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Conta criada com sucesso! Faça login.');
        setIsLogin(true); // Volta para a tela de login
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao cadastrar');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">SANMEXX</h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Faça login para acessar' : 'Crie sua conta de gestão'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input name="name" type="text" onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input name="password" type="password" onChange={handleChange} className="mt-1 block w-full px-4 py-2 border rounded-lg" required />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg shadow-lg text-white font-semibold bg-blue-900 hover:bg-blue-800 transition">
            {loading ? 'Processando...' : (isLogin ? 'Acessar Sistema' : 'Cadastrar Empresa')}
          </button>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:text-blue-800">
            {isLogin ? 'Criar uma conta agora' : 'Voltar para Login'}
          </button>
        </div>
      </div>
    </div>
  );
}