import { config } from "@dotenvx/dotenvx";

console.log("loading env file... ");

const envFiles = [`.env.${process.env.NODE_ENV}`, ".env"];

config({
  path: envFiles,
  ignore: ["MISSING_ENV_FILE"],
});
