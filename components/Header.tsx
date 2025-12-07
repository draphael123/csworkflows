'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Fountain TRT Knowledge Hub
          </h1>
          <p className="text-xs text-gray-500">Customer Service Assistant</p>
        </div>
      </div>
    </header>
  );
}


