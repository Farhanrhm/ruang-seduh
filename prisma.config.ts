import { config } from "dotenv";
config();

import { defineConfig } from "@prisma/config";

const configuration: any = {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
};

if (process.env.DIRECT_URL) {
  configuration.datasource.directUrl = process.env.DIRECT_URL;
}

export default defineConfig(configuration);
