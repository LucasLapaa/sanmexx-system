'use client';

export default function ClientsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Clientes</h1>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          + Novo Cliente
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Empresa</th>
              <th className="p-4 font-semibold text-gray-600">CNPJ</th>
              <th className="p-4 font-semibold text-gray-600">Cidade</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">Longping High - Tech</td>
              <td className="p-4">60.971.100/0001-97</td>
              <td className="p-4">Santos - SP</td>
              <td className="p-4"><span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">Ativo</span></td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">Marcon Comércio de Cereais</td>
              <td className="p-4">50.855.584/0001-55</td>
              <td className="p-4">Piracicaba - SP</td>
              <td className="p-4"><span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">Ativo</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}