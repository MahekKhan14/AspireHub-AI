import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import { isDatabaseConnected } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "aspirehub-dev-secret-change-in-prod";
const JWT_EXPIRES = "7d";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "..", "data", "users.json");

// ── In-memory file store ─────────────────────────────────────────────────────
let fileUsers = [];
const resetTokens = new Map();

const loadFileUsers = async () => {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    fileUsers = JSON.parse(raw);
  } catch {
    fileUsers = [];
    await fs.writeFile(USERS_FILE, "[]", "utf-8");
  }
};

const saveFileUsers = () => fs.writeFile(USERS_FILE, JSON.stringify(fileUsers, null, 2), "utf-8");

// ── Helpers ───────────────────────────────────────────────────────────────────
const sanitize = (u) => ({ id: u.id || u._id?.toString(), name: u.name, email: u.email });

const issueToken = (user) =>
  jwt.sign({ userId: user.id || user._id?.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const findByEmail = async (email) => {
  if (isDatabaseConnected()) return User.findOne({ email });
  return fileUsers.find((u) => u.email === email) || null;
};

const findById = async (id) => {
  if (isDatabaseConnected()) return User.findById(id);
  return fileUsers.find((u) => u.id === id) || null;
};

const createUser = async ({ name, email, passwordHash }) => {
  if (isDatabaseConnected()) return User.create({ name, email, passwordHash });
  const user = { id: crypto.randomUUID(), name, email, passwordHash };
  fileUsers.push(user);
  await saveFileUsers();
  return user;
};

// ── Controllers ───────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password?.trim())
    return res.status(400).json({ message: "Name, email and password are required." });

  const norm = email.trim().toLowerCase();
  if (await findByEmail(norm))
    return res.status(409).json({ message: "Account with this email already exists." });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ name: name.trim(), email: norm, passwordHash });
  return res.status(201).json({ token: issueToken(user), user: sanitize(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email?.trim() || !password?.trim())
    return res.status(400).json({ message: "Email and password are required." });

  const user = await findByEmail(email.trim().toLowerCase());
  if (!user) return res.status(401).json({ message: "Invalid email or password." });

  if (!(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ message: "Invalid email or password." });

  return res.status(200).json({ token: issueToken(user), user: sanitize(user) });
};

export const demoLogin = async (_req, res) => {
  const email = "demo@aspirehub.ai";
  let user = await findByEmail(email);
  if (!user) {
    const passwordHash = await bcrypt.hash("demo1234", 10);
    user = await createUser({ name: "Demo User", email, passwordHash });
  }
  return res.status(200).json({ token: issueToken(user), user: sanitize(user) });
};

export const getMe = async (req, res) => {
  const user = await findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.status(200).json({ user: sanitize(user) });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  if (!email?.trim()) return res.status(400).json({ message: "Email is required." });

  const user = await findByEmail(email.trim().toLowerCase());
  if (!user)
    return res.status(200).json({ message: "If this email exists, a reset token was generated." });

  const token = crypto.randomUUID();
  resetTokens.set(token, {
    userId: user.id || user._id?.toString(),
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  return res.status(200).json({ message: "Reset token generated.", resetToken: token });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token?.trim() || !newPassword?.trim())
    return res.status(400).json({ message: "Token and new password are required." });

  const record = resetTokens.get(token);
  if (!record || Date.now() > record.expiresAt)
    return res.status(400).json({ message: "Token is invalid or expired." });

  const user = await findById(record.userId);
  if (!user) {
    resetTokens.delete(token);
    return res.status(404).json({ message: "User not found." });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  if (isDatabaseConnected()) await user.save();
  else await saveFileUsers();
  resetTokens.delete(token);
  return res.status(200).json({ message: "Password reset successfully. You can now login." });
};

await loadFileUsers();
