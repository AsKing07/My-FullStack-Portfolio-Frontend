import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "react-app", "eslint:recommended"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Allow console logs in development
      "no-console": process.env.NODE_ENV === "development" ? "warn" : "error",
      // properties does not exist on this object
      "@typescript-eslint/no-unsafe-assignment": "on",
"@typescript-eslint/no-unsafe-member-access": "error",


    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/no-unescaped-entities": 0
    },
  },
  {
    ignores: ["node_modules", ".next", "out", "dist", "coverage"],
  },
];

export default eslintConfig;
