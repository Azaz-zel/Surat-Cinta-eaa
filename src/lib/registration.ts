import 'server-only';

/** Public registration is on unless REGISTRATION_OPEN is set to "false". */
export function registrationOpen(): boolean {
  return process.env.REGISTRATION_OPEN?.trim().toLowerCase() !== 'false';
}
