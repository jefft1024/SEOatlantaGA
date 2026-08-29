/* Public Supabase config — URL + anon key are safe to expose in the browser.
 * Row Level Security (see supabase/schema.sql) is what actually protects data:
 * the anon key can only read published posts and can write nothing until a user
 * is logged in. The secret service_role key lives only in Vercel env vars. */
window.SUPABASE_URL = "https://jzhnbjrigyouirwgfeye.supabase.co";
window.SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aG5ianJpZ3lvdWlyd2dmZXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTA2ODUsImV4cCI6MjEwMzQ4NjY4NX0.HIdHuqhNvZKTcPEuOqIbSH8gmI1E8HDiho5_1TO-SBM";
