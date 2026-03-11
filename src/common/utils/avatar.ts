import { config } from "../../config";

export function getAvatarUrl(
  photo?: string | null,
  name?: string | null,
  lastName?: string | null,
): string {
  // si existe foto
  if (photo) {
    return `${config.apiBaseUrl}${photo}`;
  }

  // iniciales
  const firstInitial = name?.[0] ?? "?";
  const lastInitial = lastName?.[0] ?? "?";

  const initials = (firstInitial + lastInitial).toUpperCase();

  const bgColor = "2563eb";
  const textColor = "fff";

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=${bgColor}&color=${textColor}`;
}
