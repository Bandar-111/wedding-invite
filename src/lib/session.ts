import { cookies } from "next/headers";
import { verifySessionToken, Role } from "./auth";

export async function getRole(): Promise<Role | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const store = await cookies();

  const adminToken = store.get("admin_session")?.value;
  if (await verifySessionToken(adminToken, "admin", secret)) return "admin";

  const staffToken = store.get("staff_session")?.value;
  if (await verifySessionToken(staffToken, "staff", secret)) return "staff";

  return null;
}

export async function requireAdmin(): Promise<boolean> {
  return (await getRole()) === "admin";
}

export async function requireStaffOrAdmin(): Promise<boolean> {
  const role = await getRole();
  return role === "admin" || role === "staff";
}
