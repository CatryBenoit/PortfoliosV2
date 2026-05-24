"use client";
import { useState } from "react";
import { ShieldAlert, Save, Plus, Database, Rocket, Lock, GitBranch, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase"; 
import { FaGithub } from "react-icons/fa";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
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

  // ==========================================
  // SÉCURITÉ DU COCKPIT
  // ==========================================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const secureCryptoKey = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (inputPassword === secureCryptoKey) {
      setIsAuthenticated(true);
    } else {
      alert("❌ CODE D'ACCÈS INCORRECT. SYSTÈME VERROUILLÉ.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // FONCTION 1 : FORGE MANUELLE (PROJET PRIVÉ)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const angle = Math.random() * Math.PI * 2;
    const radius = parseFloat(formData.posZ) || 10;
    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;

    try {
      const { error } = await supabase.from("projects").upsert(
        {
          name: formData.name, 
          system: formData.system,
          tech: formData.tech,
          color: formData.color,
          pos_x: posX,
          pos_y: 0,
          pos_z: posZ,
          description: formData.description,
          github_url: formData.github_url 
        },
        { onConflict: 'name' }
      );

      if (error) throw error;

      alert(`🚀 Planète privée "${formData.name}" forgée avec succès !`);
      setFormData({ ...formData, name: "", tech: "", posZ: "10", description: "", github_url: "" });
    } catch (error) {
      console.error(error);
      alert("Erreur de forge spatiale.");
    } finally {
      setIsSending(false);
    }
  };

 // ==========================================
// FONCTION 2 : SYNCHRONISATION GITHUB (FORCE BRUTE)
// ==========================================
const handleGithubSync = async () => {
  setIsSyncing(true);

  try {
    const githubUsername = "CatryBenoit";

const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Type sécurisé pour TypeScript
const authHeader: HeadersInit | undefined = githubToken
  ? {
      Authorization: `Bearer ${githubToken}`,
    }
  : undefined;

// ==========================================
// 1. RÉCUPÉRATION DES REPOS
// ==========================================
const response = await fetch(
  `https://api.github.com/users/${githubUsername}/repos`,
  {
    headers: authHeader,
  }
);

    if (!response.ok) {
      throw new Error(
        `GitHub a refusé l'accès (${response.status})`
      );
    }

    const repos = await response.json();

    // ==========================================
    // 2. RÉCUPÉRATION DES PROJETS EXISTANTS
    // ==========================================
    const { data: existingProjects } = await supabase
      .from("projects")
      .select("name, pos_x, pos_y, pos_z");

    const existingMap = new Map(
      existingProjects?.map((p) => [
        p.name.toLowerCase(),
        p,
      ]) || []
    );

    let createdCount = 0;
    let updatedCount = 0;

    // ==========================================
    // 3. BOUCLE REPOS
    // ==========================================
    for (const repo of repos) {
      const repoNameLower = repo.name.toLowerCase();

      const isAlreadyInDb =
        existingMap.has(repoNameLower);

      // ==========================================
      // VALEURS PAR DÉFAUT
      // ==========================================
      let customTech =
        repo.language || "Markdown / Autre";

      let customColor = "#22d3ee";

      let customSystem = "PRO";

      let customDesc =
        repo.description ||
        "Aucune description fournie sur GitHub.";

      // ==========================================
      // LECTURE README
      // ==========================================
      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${githubUsername}/${repo.name}/readme`,
          {
            headers: {
              Accept: "application/vnd.github.raw",
            ...(authHeader || {}),
            },
          }
        );

        if (readmeRes.ok) {
          const readmeText = await readmeRes.text();

          console.log(
            `README DE ${repo.name} :`,
            readmeText
          );

          // ==========================================
          // RECHERCHE DU BLOC CONFIG
          // ==========================================
          const startTag =
            "<!-- PORTFOLIO_CONFIG";

          const endTag = "-->";

          const startIndex =
            readmeText.indexOf(startTag);

          // Bloc trouvé
          if (startIndex !== -1) {
            const endIndex =
              readmeText.indexOf(
                endTag,
                startIndex
              );

            if (endIndex !== -1) {
              // Extraction du contenu
              const blockContent =
                readmeText.substring(
                  startIndex + startTag.length,
                  endIndex
                );

              console.log(
                `CONFIG TROUVÉE POUR ${repo.name} :`,
                blockContent
              );

              // ==========================================
              // EXTRACTION DES DONNÉES
              // ==========================================
              const systemMatch =
                blockContent.match(
                  /system:\s*([^\r\n]+)/i
                );

              const techMatch =
                blockContent.match(
                  /tech:\s*([^\r\n]+)/i
                );

                const descMatch = blockContent.match(/desc:\s*([^\r\n]+)/i);

              const colorMatch =
                blockContent.match(
                  /color:\s*([^\r\n]+)/i
                );

              // ==========================================
              // APPLICATION DES VALEURS
              // ==========================================
              if (systemMatch) {
                customSystem =
                  systemMatch[1]
                    .trim()
                    .toUpperCase();
              }

              if (techMatch) {
                customTech =
                  techMatch[1].trim();
              }

              if (colorMatch) {
                customColor =
                  colorMatch[1].trim();
              }
              if (descMatch) {
                  customDesc = descMatch[1].trim();
                }

              console.log(
                `✅ CONFIG APPLIQUÉE POUR ${repo.name}`,
                {
                  customSystem,
                  customTech,
                  customColor,
                  customDesc,
                }
              );
            } else {
              console.log(
                `⚠️ FIN DE BLOC INTROUVABLE POUR ${repo.name}`
              );
            }
          } else {
            console.log(
              `ℹ️ Aucun bloc config trouvé pour ${repo.name}`
            );
          }
        } else {
          console.log(
            `ℹ️ Aucun README pour ${repo.name}`
          );
        }
      } catch (readmeError) {
        console.warn(
          `❌ Impossible de lire le README de ${repo.name}`,
          readmeError
        );
      }

      // ==========================================
      // GESTION DES POSITIONS
      // ==========================================
      let posX;
      let posY;
      let posZ;

      if (isAlreadyInDb) {
        const oldPlanet =
          existingMap.get(repoNameLower)!;

        posX = oldPlanet.pos_x;
        posY = oldPlanet.pos_y;
        posZ = oldPlanet.pos_z;

        updatedCount++;
      } else {
        const angle =
          Math.random() * Math.PI * 2;

        const radius =
          Math.floor(
            Math.random() * (22 - 8 + 1)
          ) + 8;

        posX = Math.cos(angle) * radius;
        posY = 0;
        posZ = Math.sin(angle) * radius;

        createdCount++;
      }

      // ==========================================
      // UPSERT SUPABASE
      // ==========================================
      const { error } = await supabase
        .from("projects")
        .upsert(
          {
            name: repo.name,
            system: customSystem,
            tech: customTech,
            color: customColor,

            pos_x: posX,
            pos_y: posY,
            pos_z: posZ,

            description: customDesc,

            github_url: repo.html_url,
          },
          {
            onConflict: "name",
          }
        );

      if (error) {
        console.error(
          `Erreur Supabase pour ${repo.name}`,
          error
        );
      }
    }

    // ==========================================
    // FIN
    // ==========================================
    alert(
      `📡 Synchro terminée !\n\n🆕 Créés : ${createdCount}\n🔄 Mis à jour : ${updatedCount}`
    );

    window.location.reload();
  } catch (error) {
    console.error(
      "Erreur de synchronisation :",
      error
    );

    alert(
      "❌ Échec de la synchronisation GitHub."
    );
  } finally {
    setIsSyncing(false);
  }
};

  // ==========================================
  // RENDER : ÉCRAN DE VERROUILLAGE
  // ==========================================
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
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-3 text-xs transition-all">
              Authentification
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER : PANNEAU DE CONTRÔLE ADMIN
  // ==========================================
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
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Database className="text-cyan-400" /> Générateur_de_Planètes
            </h1>
          </div>
          
          <button 
            onClick={handleGithubSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-cyan-950/40 border-2 border-cyan-400 text-cyan-400 font-bold text-xs uppercase px-4 py-2.5 tracking-widest hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "SCAN_EN_COURS..." : "Synchroniser GitHub"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 glass-panel p-6 border-2 border-cyan-400 bg-[#070b14]">
            <h2 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Plus size={16} /> Forger un Projet Manuel (Privé)
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
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