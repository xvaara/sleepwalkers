export default defineNitroPlugin(() => {
  // Only run migrations in development
  if (import.meta.dev) {
    onHubReady(async () => {
      await hubDatabase().exec(`
        CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at timestamp NOT NULL default CURRENT_TIMESTAMP);
      `)
    })
  }
})
