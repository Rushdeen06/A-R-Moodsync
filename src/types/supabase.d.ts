declare module 'npm/mono' {
  export interface MonoClient {
    // Add any specific types needed
  }
}

declare module 'npm/mono/cors' {
  const cors: any;
  export default cors;
}

declare module 'npm/mono/logger' {
  const logger: any;
  export default logger;
}

declare module 'npm/mono/supabase' {
  const supabase: any;
  export default supabase;
}