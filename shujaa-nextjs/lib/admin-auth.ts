import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const scryptAsync = promisify(scrypt)

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'shujaa-admin-secret'
)
const COOKIE_NAME = 'shujaa_admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ── Local credential file (no network needed) ──────────────────────────────
const CREDS_FILE = path.join(process.cwd(), 'data', 'admin-credentials.json')

export interface AdminRecord {
  id: string
  email: string
  displayName: string
  role: string
  hash: string   // "salt:derivedKey" (hex)
}

function readCreds(): { admins: AdminRecord[] } {
  try {
    return JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8'))
  } catch {
    return { admins: [] }
  }
}

function writeCreds(data: { admins: AdminRecord[] }) {
  fs.mkdirSync(path.dirname(CREDS_FILE), { recursive: true })
  fs.writeFileSync(CREDS_FILE, JSON.stringify(data, null, 2))
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, stored] = hash.split(':')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const storedBuf = Buffer.from(stored, 'hex')
  return derived.length === storedBuf.length && timingSafeEqual(derived, storedBuf)
}

export function adminExists(): boolean {
  return readCreds().admins.length > 0
}

export async function createAdminCredential(
  email: string,
  password: string,
  displayName: string,
  role = 'super_admin'
): Promise<{ ok: boolean; error?: string }> {
  const data = readCreds()
  if (data.admins.find(a => a.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const hash = await hashPassword(password)
  const id = randomBytes(16).toString('hex')
  data.admins.push({ id, email: email.toLowerCase(), displayName, role, hash })
  writeCreds(data)
  return { ok: true }
}

export async function verifyAdminCredential(
  email: string,
  password: string
): Promise<AdminRecord | null> {
  const data = readCreds()
  const admin = data.admins.find(a => a.email.toLowerCase() === email.toLowerCase())
  if (!admin) return null
  const ok = await verifyPassword(password, admin.hash)
  return ok ? admin : null
}

// ── JWT session ────────────────────────────────────────────────────────────
export async function createAdminToken(adminId: string, email: string, role: string) {
  return new SignJWT({ adminId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { adminId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function clearAdminCookie() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) return null
  // Verify admin still exists in local credentials
  const data = readCreds()
  const admin = data.admins.find(a => a.id === session.adminId)
  if (!admin) return null
  return { ...session, displayName: admin.displayName }
}
