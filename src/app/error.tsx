"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-300 mb-4">Erro</h1>
        <p className="text-gray-500 mb-2">Ocorreu um erro inesperado.</p>
        <p className="text-xs text-gray-400 mb-6">ID: {error.digest ?? "---"}</p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
