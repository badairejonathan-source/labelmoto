'use client';

/**
 * PAGE DE TEST MINIMALE
 * Objectif : Prouver que la route /auth/action est accessible.
 */
export default function AuthActionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="border-4 border-orange-600 p-10 rounded-[2rem] text-center shadow-2xl">
        <h1 className="text-4xl font-black text-orange-600 uppercase tracking-tighter mb-4">
          Page auth/action OK
        </h1>
        <p className="text-slate-600 font-bold">
          La route est bien déployée et accessible sur Label Moto.
        </p>
        <div className="mt-8 pt-8 border-t border-dashed border-orange-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            En attente de la ré-implémentation de la logique Firebase
          </p>
        </div>
      </div>
    </div>
  );
}
