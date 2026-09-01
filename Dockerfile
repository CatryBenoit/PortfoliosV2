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

# On réceptionne les variables depuis l'Action GitHub (Supabase retiré)
ARG DATABASE_URL
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ARG NEXT_PUBLIC_GITHUB_TOKEN
ARG NEXT_PUBLIC_APIMail

# On les rend disponibles pour le build Next.js
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
ENV NEXT_PUBLIC_GITHUB_TOKEN=$NEXT_PUBLIC_GITHUB_TOKEN
ENV NEXT_PUBLIC_APIMail=$NEXT_PUBLIC_APIMail

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

# Si votre fichier SQL.db est versionné sur Git, décommentez la ligne ci-dessous :
COPY --from=builder /app/SQL.db ./SQL.db

EXPOSE 3000

CMD ["npm", "start"]