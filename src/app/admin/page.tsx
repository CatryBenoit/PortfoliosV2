"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, Save, Plus, Database, Rocket, Lock, RefreshCw, LogOut } from "lucide-react";
import { FaGithub } from "react-icons/fa";

// 1. On importe nos Server Actions au lieu de Supabase
import { createOrUpdateProject, checkAdminSession, adminLogin, adminLogout, syncGithubRepos } from "@/app/actions";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [inputPassword, setInputPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    system: "PRO",
    tech: "",
    color: "#3b82f6",
    posZ: "10",
    description: "",
    github_url: ""
  });

  // Le mot de passe est désormais vérifié côté serveur (Server Action) : il
  // ne transite plus jamais dans le bundle JS envoyé au navigateur. On
  // vérifie aussi, au chargement, si une session valide existe déjà (cookie).
  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated }) => setIsAuthenticated(authenticated))
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const { ok } = await adminLogin(inputPassword);
      if (ok) {
        setIsAuthenticated(true);
        setInputPassword("");
      } else {
        alert("❌ CODE D'ACCÈS INCORRECT. SYSTÈME VERROUILLÉ.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const angle = Math.random() * Math.PI * 2;
    const radius = parseFloat(formData.posZ) || 10;
    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;

    try {
      // 2. On utilise la Server Action pour forger la planète
      const { error } = await createOrUpdateProject({
        name: formData.name, 
        system: formData.system,
        tech: formData.tech,
        color: formData.color,
        pos_x: posX,
        pos_y: 0,
        pos_z: posZ,
        description: formData.description,
        github_url: formData.github_url 
      });

      if (error) throw new Error(error);

      alert(`🚀 Planète privée "${formData.name}" forgée avec succès !`);
      setFormData({ ...formData, name: "", tech: "", posZ: "10", description: "", github_url: "" });
    } catch (error) {
      console.error(error);
      alert("Erreur de forge spatiale.");
    } finally {
      setIsSending(false);
    }
  };

  const handleGithubSync = async () => {
    setIsSyncing(true);
    try {
      // Toute la synchro (appels GitHub + token) tourne désormais côté
      // serveur : le navigateur ne voit jamais le token GitHub.
      const { data, error } = await syncGithubRepos();
      if (error || !data) throw new Error(error || "Réponse vide");

      alert(`📡 Synchro terminée !\n\n🆕 Créés : ${data.createdCount}\n🔄 Mis à jour : ${data.updatedCount}`);
      window.location.reload();
    } catch (error) {
      console.error("Erreur de synchronisation :", error);
      alert("❌ Échec de la synchronisation GitHub.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#010103] text-white font-mono flex items-center justify-center p-4">
        <div className="scanline z-0 pointer-events-none" />
        <div className="text-cyan-400 text-xs uppercase tracking-[0.3em] animate-pulse relative z-10">
          &gt; Vérification_session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#010103] text-white font-mono flex items-center justify-center p-4">
        <div className="scanline z-0 pointer-events-none" />
        <div className="w-full max-w-md p-8 border-2 border-red-500 bg-[#070b14] shadow-[0_0_30px_rgba(239,68,68,0.2)] relative z-10">
          <div className="text-center mb-6">
            <Lock className="mx-auto text-red-500 mb-2 animate-pulse" size={40} />
            <h1 className="text-red-500 font-black tracking-widest text-sm uppercase">ACCÈS CORRUPTUEL // COCKPIT VERROUILLÉ</h1>
            <p className="text-xs text-white/40 uppercase mt-1">Veuillez injecter la clé de décryptage admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="ENTREZ_LE_CODE_SECURE"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-black border border-red-500/50 p-3 text-center text-sm tracking-widest text-red-400 outline-none focus:border-red-500 font-bold uppercase"
            />
            <button type="submit" disabled={isLoggingIn} className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-3 text-xs transition-all disabled:opacity-50">
              {isLoggingIn ? "Vérification..." : "Authentification"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010103] text-white font-mono p-8 relative overflow-hidden">
      <div className="scanline z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b-2 border-cyan-500/50 pb-4 gap-4">
          <div>
            <div className="text-[10px] text-cyan-400 tracking-[0.3em] flex items-center gap-2 mb-1 font-bold">
              <ShieldAlert size={14} className="text-green-400" /> 
              <span className="text-green-400">ACCÈS_AUTORISÉ // ACCÈS_ROOT</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter flex items-center gap-3 break-words">
              <Database className="text-cyan-400 shrink-0" /> Générateur_de_Planètes
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleGithubSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-cyan-950/40 border-2 border-cyan-400 text-cyan-400 font-bold text-xs uppercase px-4 py-2.5 tracking-widest hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "SCAN_EN_COURS..." : "Synchroniser GitHub"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-950/30 border-2 border-red-500/50 text-red-400 font-bold text-xs uppercase px-4 py-2.5 tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-6 border-2 border-cyan-400 bg-[#070b14]">
            <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Plus size={16} /> Forger un Projet Manuel (Privé)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Nom du Projet</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Système Solaire</label>
                  <select name="system" value={formData.system} onChange={handleChange} className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all">
                    <option value="PRO">PRO</option>
                    <option value="PERSO">PERSO</option>
                    <option value="SCOLAIRE">SCOLAIRE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Technologies</label>
                  <input type="text" name="tech" required value={formData.tech} onChange={handleChange} placeholder="Ex: Next.js, Java" className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Rayon Orbital (6 à 25)</label>
                  <input type="number" name="posZ" required value={formData.posZ} onChange={handleChange} min="6" max="25" className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-2">
                  <FaGithub size={14} /> Lien du dépôt (Optionnel)
                </label>
                <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block">Couleur de l'atmosphère (Hex)</label>
                <div className="flex items-center gap-4">
                  <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-12 h-12 rounded cursor-pointer bg-transparent border-none" />
                  <input type="text" name="color" value={formData.color} onChange={handleChange} className="flex-1 bg-black/50 border border-cyan-500/30 p-2 text-sm text-white uppercase font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Rapport de Mission (Description)</label>
                <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full bg-black/50 border border-cyan-500/30 p-2 text-sm text-white focus:border-cyan-400 outline-none transition-all resize-none" />
              </div>

              <button type="submit" disabled={isSending} className="w-full bg-cyan-500 text-black font-black uppercase tracking-[0.3em] py-3 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Save size={18} /> {isSending ? "FORGE_EN_COURS..." : "Forger la Planète Privée"}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 border-2 border-cyan-400 bg-[#070b14] h-fit">
            <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Rocket size={16} /> Aperçu Radar
            </h2>
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-cyan-500/30 mb-6 bg-black/30">
              <div className="w-24 h-24 rounded-full shadow-[0_0_30px_var(--planet-color)] mb-4 animate-pulse" style={{ backgroundColor: formData.color, '--planet-color': formData.color } as React.CSSProperties} />
              <div className="text-white font-black tracking-widest uppercase text-center px-2">{formData.name || "NOM_INCONNU"}</div>
              <div className="text-[10px] text-cyan-400 font-bold tracking-widest mt-1">{formData.system}</div>
            </div>
            <div className="space-y-2 text-xs text-white/70 font-mono">
              <p>&gt; TECH: <span className="text-white">{formData.tech || "..."}</span></p>
              <p>&gt; DISTANCE: <span className="text-white">{formData.posZ} Unités</span></p>
              <p>&gt; GITHUB: <span className="text-xs break-all text-cyan-400">{formData.github_url ? "LIEN_DÉTECTÉ" : "AUCUN"}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}