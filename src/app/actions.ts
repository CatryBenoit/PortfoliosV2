"use server";

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

// Récupère uniquement les infos nécessaires pour la synchro GitHub
export async function getExistingProjectsForSync() {
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
  try {
    const project = await prisma.project.upsert({
      where: { name: projectData.name }, // Cherche par nom
      update: projectData,               // Si trouvé, met à jour
      create: projectData,               // Sinon, crée
    });
    return { data: project, error: null };
  } catch (error) {
    console.error("Erreur de forge :", error);
    return { data: null, error: "La forge de la planète a échoué." };
  }
}