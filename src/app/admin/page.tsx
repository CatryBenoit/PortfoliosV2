"use client";
import { useState, useEffect } from "react";
import { ShieldAlert, Save, Plus, Database, Rocket, Lock, RefreshCw, LogOut, Pencil, XCircle, Eye, EyeOff, Globe, GlobeLock } from "lucide-react";
import { FaGithub } from "react-icons/fa";

// 1. On importe nos Server Actions au lieu de Supabase
import { createOrUpdateProject, checkAdminSession, adminLogin, adminLogout, syncGithubRepos, getAllProjectsForAdmin } from "@/app/actions";

type ProjectRow = {
  id: number;
  name: string;
  system: string;
  tech: string;
  color: string;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  description: string | null;
  github_url: string | null;
  visible: boolean;
  debloy: boolean;
};

const EMPTY_FORM = {
  id: null as number | null,
  name: "",
  system: "PRO",
  tech: "",
  color: "#3b82f6",
  posZ: "10",
  description: "",
  github_url: "",
  visible: false,
  debloy: false,
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [inputPassword, setInputPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const isEditing = formData.id !== null;

  // Le mot de passe est désormais vérifié côté serveur (Server Action) : il
  // ne transite plus jamais dans le bundle JS envoyé au navigateur. On
  // vérifie aussi, au chargement, si une session valide existe déjà (cookie).
  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated }) => setIsAuthenticated(authenticated))
      .finally(() => setCheckingSession(false));
  }, []);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const { data, error } = await getAllProjectsForAdmin();
      if (error) throw new Error(error);
      setProjects((data as ProjectRow[]) || []);
    } catch (error) {
      console.error("Erreur de chargement des planètes :", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadProjects();
  }, [isAuthenticated]);

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

  // Conserve l'angle orbital d'origine d'un projet en édition : on ne veut
  // pas téléporter une planète ailleurs sur son orbite juste parce qu'on a
  // corrigé sa description. Seul le rayon (champ "posZ") reste modifiable.
  const [editAngle, setEditAngle] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleEditProject = (project: ProjectRow) => {
    setEditAngle(Math.atan2(project.pos_z, project.pos_x));
    setFormData({
      id: project.id,
      name: project.name,
      system: project.system,
      tech: project.tech,
      color: project.color,
      posZ: Math.hypot(project.pos_x, project.pos_z).toFixed(1),
      description: project.description || "",
      github_url: project.github_url || "",
      visible: project.visible,
      debloy: project.debloy,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => setFormData(EMPTY_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const radius = parseFloat(formData.posZ) || 10;
    const angle = isEditing ? editAngle : Math.random() * Math.PI * 2;
    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;

    try {
      // 2. On utilise la Server Action pour forger (ou mettre à jour) la planète
      const { error } = await createOrUpdateProject({
        ...(isEditing ? { id: formData.id } : {}),
        name: formData.name,
        system: formData.system,
        tech: formData.tech,
        color: formData.color,
        pos_x: posX,
        pos_y: 0,
        pos_z: posZ,
        description: formData.description,
        github_url: formData.github_url,
        visible: formData.visible,
        debloy: formData.debloy,
      });

      if (error) throw new Error(error);

      alert(isEditing ? `🛰️ Planète "${formData.name}" mise à jour !` : `🚀 Planète privée "${formData.name}" forgée avec succès !`);
      setFormData(EMPTY_FORM);
      loadProjects();
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
              {isEditing ? <Pencil size={16} /> : <Plus size={16} />}
              {isEditing ? `Modifier "${formData.name}"` : "Forger un Projet Manuel (Privé)"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 border border-cyan-500/30 bg-black/50 p-3 cursor-pointer hover:border-cyan-400 transition-all">
                  <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0" />
                  <span className="flex items-center gap-2 text-xs text-white uppercase tracking-widest font-bold">
                    {formData.visible ? <Eye size={14} className="text-cyan-400" /> : <EyeOff size={14} className="text-white/40" />}
                    Visible sur le portfolio
                  </span>
                </label>

                <label className="flex items-center gap-3 border border-cyan-500/30 bg-black/50 p-3 cursor-pointer hover:border-cyan-400 transition-all">
                  <input type="checkbox" name="debloy" checked={formData.debloy} onChange={handleChange} className="w-4 h-4 accent-cyan-400 cursor-pointer shrink-0" />
                  <span className="flex items-center gap-2 text-xs text-white uppercase tracking-widest font-bold">
                    {formData.debloy ? <Globe size={14} className="text-cyan-400" /> : <GlobeLock size={14} className="text-white/40" />}
                    Déploiement disponible
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={isSending} className="flex-1 bg-cyan-500 text-black font-black uppercase tracking-[0.3em] py-3 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  <Save size={18} /> {isSending ? "FORGE_EN_COURS..." : isEditing ? "Mettre à jour" : "Forger la Planète Privée"}
                </button>
                {isEditing && (
                  <button type="button" onClick={handleCancelEdit} className="px-5 border-2 border-white/20 text-white/60 uppercase tracking-widest text-xs font-bold hover:border-red-500/50 hover:text-red-400 transition-all flex items-center gap-2">
                    <XCircle size={16} /> Annuler
                  </button>
                )}
              </div>
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

        <div className="glass-panel p-6 border-2 border-cyan-400 bg-[#070b14] mt-8">
          <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Database size={16} /> Planètes en Base ({projects.length})
          </h2>

          {isLoadingProjects ? (
            <p className="text-xs text-white/40 uppercase tracking-widest">Chargement...</p>
          ) : projects.length === 0 ? (
            <p className="text-xs text-white/40 uppercase tracking-widest">Aucune planète enregistrée.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border transition-all ${
                    formData.id === project.id ? "border-cyan-400 bg-cyan-950/30" : "border-cyan-500/20 bg-black/30"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{project.name}</div>
                      <div className="text-[10px] text-cyan-400/70 tracking-widest uppercase">{project.system} · {project.tech}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${project.visible ? "text-cyan-400" : "text-white/30"}`}>
                      {project.visible ? <Eye size={12} /> : <EyeOff size={12} />} Visible
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold ${project.debloy ? "text-cyan-400" : "text-white/30"}`}>
                      {project.debloy ? <Globe size={12} /> : <GlobeLock size={12} />} Déploy
                    </span>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-400 text-cyan-400 font-bold text-[10px] uppercase px-3 py-2 tracking-widest hover:bg-cyan-400 hover:text-black transition-all"
                    >
                      <Pencil size={12} /> Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}