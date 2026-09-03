import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy sans nonce : ce site n'a pas de rendu dynamique par
// requête (la page d'accueil est pré-rendue statiquement), donc un nonce par
// requête ne peut pas être injecté dans le HTML déjà généré au build (limite
// documentée par Next.js). 'unsafe-inline' reste nécessaire pour le script de
// hydratation que Next.js insère lui-même dans le HTML statique.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self' data:`,
  // Hôtes contactés depuis le navigateur : synchro GitHub (admin) et le
  // formulaire de contact (web3forms). En dev on ajoute le canal HMR local.
  `connect-src 'self' https://api.github.com https://api.web3forms.com${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self' https://api.web3forms.com`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

// En-têtes de sécurité, visant un bon score sur securityheaders.com.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Impose HTTPS pour ce domaine (et sous-domaines) pendant 2 ans.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Empêche le navigateur de deviner un type MIME différent du Content-Type déclaré.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Interdit d'afficher le site dans une <iframe> (clickjacking). Doublé par
  // `frame-ancestors 'none'` dans la CSP pour les navigateurs qui la préfèrent.
  { key: "X-Frame-Options", value: "DENY" },
  // Ne transmet l'URL complète qu'aux requêtes same-origin ; sinon juste l'origine.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les API sensibles que ce site n'utilise pas.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Isole le contexte de navigation (protection contre certaines attaques cross-origin).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Retire l'en-tête "X-Powered-By: Next.js" (divulgation d'information inutile).
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
