import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Das Kit ist ein eigenständiges Projekt: Wurzel fest auf diesen Ordner, sonst sucht Next oberhalb
// nach weiteren Lockfiles und rät die falsche Projektwurzel.
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) }
};

// Wie auf der Plattform: next-intl ohne Sprachpräfix im Pfad, Sprache kommt aus ?lang bzw. Cookie.
const withNextIntl = createNextIntlPlugin("./src/kit/i18n-request.ts");

export default withNextIntl(nextConfig);
