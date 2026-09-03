"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import { prisma } from "./lib/prisma"; // Ajustez ce chemin selon où vous avez mis l'instance prisma

export async function getProjects() {
  try {
    // Équivalent de supabase.from("projects").select("*")
    const projects = await prisma.project.findMany();

    return { data: projects, error: null };
  } catch (error) {
    console.error("Erreur Prisma :", error);
    return { data: null, error: "Impossible de charger les planètes." };
  }
}

// ============================================================================
// Session admin
//
// Le mot de passe et le token GitHub restent des variables d'environnement
// SANS le préfixe NEXT_PUBLIC_ : elles ne sont donc jamais envoyées au
// navigateur (contrairement à avant). L'accès au panneau /admin passe par un
// cookie de session signé (HMAC), vérifié côté serveur avant toute écriture.
// ============================================================================

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 heures

function getExpectedSessionToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update("portfolio-admin-session").digest("hex");
}

export async function adminLogin(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    console.error("ADMIN_PASSWORD n'est pas défini côté serveur.");
    return { ok: false, error: "Configuration serveur manquante." };
  }
  if (password !== expectedPassword) {
    return { ok: false, error: "Code d'accès incorrect." };
  }

  const token = getExpectedSessionToken();
  if (!token) return { ok: false, error: "Configuration serveur manquante." };

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return { ok: true, error: null };
}

export async function adminLogout() {
  (await cookies()).delete(SESSION_COOKIE);
  return { ok: true };
}

export async function checkAdminSession() {
  const cookieToken = (await cookies()).get(SESSION_COOKIE)?.value;
  const expectedToken = getExpectedSessionToken();

  if (!cookieToken || !expectedToken) return { authenticated: false };

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(expectedToken);
  const authenticated = a.length === b.length && timingSafeEqual(a, b);

  return { authenticated };
}

async function isAdminAuthenticated() {
  const { authenticated } = await checkAdminSession();
  return authenticated;
}

// ============================================================================
// Gestion des planètes (réservé à l'admin authentifié)
// ============================================================================

async function upsertProject(projectData: any) {
  return prisma.project.upsert({
    where: { name: projectData.name }, // Cherche par nom
    update: projectData,               // Si trouvé, met à jour
    create: projectData,               // Sinon, crée
  });
}

// Récupère uniquement les infos nécessaires pour la synchro GitHub
export async function getExistingProjectsForSync() {
  if (!(await isAdminAuthenticated())) {
    return { data: null, error: "Non autorisé." };
  }
  try {
    const projects = await prisma.project.findMany({
      select: { name: true, pos_x: true, pos_y: true, pos_z: true }
    });
    return { data: projects, error: null };
  } catch (error) {
    console.error("Erreur de récupération :", error);
    return { data: null, error: "Impossible de lire la base." };
  }
}

// Fonction Upsert (Création ou Mise à jour)
export async function createOrUpdateProject(projectData: any) {
  if (!(await isAdminAuthenticated())) {
    return { data: null, error: "Non autorisé." };
  }
  try {
    const project = await upsertProject(projectData);
    return { data: project, error: null };
  } catch (error) {
    console.error("Erreur de forge :", error);
    return { data: null, error: "La forge de la planète a échoué." };
  }
}

// Synchronise les dépôts GitHub publics vers des planètes. Le token GitHub ne
// quitte jamais le serveur (avant : lu depuis NEXT_PUBLIC_GITHUB_TOKEN et donc
// exposé dans le bundle JS envoyé à chaque visiteur).
export async function syncGithubRepos() {
  if (!(await isAdminAuthenticated())) {
    return { data: null, error: "Non autorisé." };
  }

  const githubUsername = "CatryBenoit";
  const githubToken = process.env.GITHUB_TOKEN;
  const authHeader: HeadersInit | undefined = githubToken
    ? { Authorization: `Bearer ${githubToken}` }
    : undefined;

  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`, {
      headers: authHeader,
    });
    if (!response.ok) throw new Error(`GitHub a refusé l'accès (${response.status})`);
    const repos = await response.json();

    const existingProjects = await prisma.project.findMany({
      select: { name: true, pos_x: true, pos_y: true, pos_z: true },
    });
    const existingMap = new Map(existingProjects.map((p) => [p.name.toLowerCase(), p]));

    let createdCount = 0;
    let updatedCount = 0;

    for (const repo of repos) {
      const repoNameLower = repo.name.toLowerCase();
      const isAlreadyInDb = existingMap.has(repoNameLower);

      let customTech = repo.language || "Markdown / Autre";
      let customColor = "#22d3ee";
      let customSystem = "PRO";
      let customDesc = repo.description || "Aucune description fournie sur GitHub.";

      try {
        const readmeRes = await fetch(
          `https://api.github.com/repos/${githubUsername}/${repo.name}/readme`,
          { headers: { Accept: "application/vnd.github.raw", ...(authHeader || {}) } }
        );

        if (readmeRes.ok) {
          const readmeText = await readmeRes.text();
          const startTag = "<!-- PORTFOLIO_CONFIG";
          const endTag = "-->";
          const startIndex = readmeText.indexOf(startTag);

          if (startIndex !== -1) {
            const endIndex = readmeText.indexOf(endTag, startIndex);
            if (endIndex !== -1) {
              const blockContent = readmeText.substring(startIndex + startTag.length, endIndex);

              const systemMatch = blockContent.match(/system:\s*([^\r\n]+)/i);
              const techMatch = blockContent.match(/tech:\s*([^\r\n]+)/i);
              const descMatch = blockContent.match(/desc:\s*([^\r\n]+)/i);
              const colorMatch = blockContent.match(/color:\s*([^\r\n]+)/i);

              if (systemMatch) customSystem = systemMatch[1].trim().toUpperCase();
              if (techMatch) customTech = techMatch[1].trim();
              if (colorMatch) customColor = colorMatch[1].trim();
              if (descMatch) customDesc = descMatch[1].trim();
            }
          }
        }
      } catch (readmeError) {
        console.warn(`Impossible de lire le README de ${repo.name}`, readmeError);
      }

      let posX: number, posY: number, posZ: number;

      if (isAlreadyInDb) {
        const oldPlanet = existingMap.get(repoNameLower)!;
        posX = oldPlanet.pos_x;
        posY = oldPlanet.pos_y;
        posZ = oldPlanet.pos_z;
        updatedCount++;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.floor(Math.random() * (22 - 8 + 1)) + 8;
        posX = Math.cos(angle) * radius;
        posY = 0;
        posZ = Math.sin(angle) * radius;
        createdCount++;
      }

      try {
        await upsertProject({
          name: repo.name,
          system: customSystem,
          tech: customTech,
          color: customColor,
          pos_x: posX,
          pos_y: posY,
          pos_z: posZ,
          description: customDesc,
          github_url: repo.html_url,
        });
      } catch (upsertError) {
        console.error(`Erreur pour ${repo.name}`, upsertError);
      }
    }

    return { data: { createdCount, updatedCount }, error: null };
  } catch (error) {
    console.error("Erreur de synchronisation GitHub :", error);
    return { data: null, error: "Échec de la synchronisation GitHub." };
  }
}
