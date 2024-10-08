import Google from "@auth/express/providers/google"

export const authConfig = {
  trustHost: true,
  providers: [
    Google,
  ],
}
