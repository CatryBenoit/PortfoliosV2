# Étape 1 : Construction
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# On réceptionne toutes tes variables depuis l'Action GitHub
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ARG NEXT_PUBLIC_GITHUB_TOKEN
ARG NEXT_PUBLIC_APIMail

# On les rend disponibles pour le build Next.js
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
ENV NEXT_PUBLIC_GITHUB_TOKEN=$NEXT_PUBLIC_GITHUB_TOKEN
ENV NEXT_PUBLIC_APIMail=$NEXT_PUBLIC_APIMail

RUN npm run build

# Étape 2 : Serveur de production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"]