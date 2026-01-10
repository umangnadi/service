import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: "postgresql://admin:admin@localhost:5432/nadi",
  },
});
