/**
 * Hosts that are allowed to navigate inside the Electron window.
 *
 * Anything not matching these rules will be opened in the user's
 * default browser instead of inside the app.
 */

export const IN_APP_HOSTS: string[] = [
  "app.zendowhisper.com",
  "localhost",
  "accounts.google.com",
  // Specific Supabase project host used for auth redirects.
  "odsoebcyqmipdqarlycz.supabase.co",
];

/**
 * Returns true if a hostname should stay inside the Electron window.
 */
export const isInAppHost = (hostname: string): boolean => {
  if (IN_APP_HOSTS.includes(hostname)) {
    return true;
  }

  // Allow any Supabase project host to keep the OAuth flow in-app.
  if (hostname.endsWith(".supabase.co")) {
    return true;
  }

  return false;
};
