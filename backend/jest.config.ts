export default {
  preset: "ts-jest",
  injectGlobals: true,
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  globals: {
    SUPABASE_URL: "foo.supabase.bar",
    SUPABASE_SERVICE_KEY: "mySecretK4y",
    SUPABASE_LOGIN: "foo@bar.baz",
    SUPABASE_PASSWORD: "mySecretP4ssw0rd",
  },
};
