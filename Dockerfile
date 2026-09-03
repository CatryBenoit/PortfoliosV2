# ==========================================
# Étape 1 : Construction (Builder)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie de tout le code source
COPY . .

# 🚨 TRÈS IMPORTANT : Générer le client Prisma AVANT le build Next.js
RUN npx prisma generate

# Seule une variable PUBLIQUE (NEXT_PUBLIC_*) doit être connue au moment du
# build : elle est gravée telle quelle dans le bundle JS envoyé au navigateur.
# ADMIN_PASSWORD et GITHUB_TOKEN ne sont PLUS des build-args (ils ne doivent
# jamais transiter par l'image) : ce sont des variables d'environnement à
# fournir au conteneur au lancement (docker run -e ...).
ARG DATABASE_URL
ARG NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=$NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

# Construction du projet Next.js
RUN npm run build

# ==========================================
# Étape 2 : Serveur de production (Runner)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# La base de données SQLite a besoin de son URL à l'exécution
ENV DATABASE_URL="file:./SQL.db"

# On récupère les fichiers compilés et les modules (qui contiennent le client Prisma généré)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma

# SQL.db n'est plus versionné sur Git (il peut contenir des données réelles :
# messages du formulaire de contact, etc.) — il n'existe donc pas forcément
# dans le contexte de build. `prisma db push` au démarrage crée le schéma si
# la base est absente et ne touche pas aux données si elle existe déjà.
# Pour conserver les données entre redéploiements, montez un volume sur
# /app/prisma (ex: -v portfolio_db:/app/prisma).

EXPOSE 3000

# ADMIN_PASSWORD et GITHUB_TOKEN doivent être fournis au lancement du
# conteneur, par ex. :
#   docker run -e ADMIN_PASSWORD=... -e GITHUB_TOKEN=... -p 3000:3000 ...
#
# Pas de --accept-data-loss volontairement : si un futur changement de schéma
# est destructif, le déploiement échoue au lieu de perdre des données en
# silence (il suffit alors de lancer la commande une fois à la main avec le
# flag pour confirmer).
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
