// Next only ships declarations for `*.module.css` (see
// node_modules/next/types/global.d.ts). Plain side-effect imports like
// `import "./globals.css"` in app/layout.tsx have no declaration, which
// TypeScript 5.9 quietly allows but newer compilers report as:
//   Cannot find module or type declarations for side-effect import of './globals.css'.
// The stylesheet is handled by the bundler, not the type system, so an empty
// ambient declaration is all that is needed.
declare module "*.css";
