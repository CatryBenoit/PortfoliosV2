# Étape 1 : Construction
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur de production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# On récupère uniquement ce qui est nécessaire depuis l'étape 1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Next.js utilise le port 3000 par défaut
EXPOSE 3000
CMD ["npm", "start"]