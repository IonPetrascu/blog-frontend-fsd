export const AUTH_CLIENT_ID = getEnvVar('VITE_AUTH_CLIENT_ID')

function getEnvVar(key: string) {
  const envVar = import.meta.env[key]
  if (envVar === undefined) {
    throw new Error(`Env variable ${key} is required`)
  }
  return envVar
}
