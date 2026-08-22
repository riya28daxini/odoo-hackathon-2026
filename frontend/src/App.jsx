import React from 'react';
import { AuthView } from './views/AuthView';
import { Toast } from './components/Toast';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <main>
        <AuthView />
      </main>

      <Toast />
    </div>
  );
}

export default App;