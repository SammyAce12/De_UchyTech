const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "replace-this-in-production";

const dataDir = path.join(__dirname, "data");
const usersPath = path.join(dataDir, "users.json");
const contentPath = path.join(dataDir, "content.json");
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if ((file.mimetype || "").startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));
app.use("/uploads", express.static(uploadsDir));

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, JSON.stringify(value, null, 2));

const ensureSeedSeller = async () => {
  const db = readJson(usersPath);
  if (db.users.some((u) => u.role === "seller")) return;

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  db.users.push({
    id: Date.now().toString(),
    name: "Main Seller",
    email: "seller@deuchytech.com",
    passwordHash,
    role: "seller",
    createdAt: new Date().toISOString()
  });
  writeJson(usersPath, db);
};

const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const authRequired = (req, res, next) => {
  const token = req.cookies.auth_token || (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const sellerOnly = (req, res, next) => {
  if (req.user.role !== "seller") return res.status(403).json({ error: "Seller access required" });
  next();
};

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "name, email, and password are required" });

  const db = readJson(usersPath);
  const normalizedEmail = String(email).toLowerCase().trim();
  if (db.users.some((u) => u.email === normalizedEmail)) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash,
    role: "buyer",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeJson(usersPath, db);

  const token = signToken(newUser);
  res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const db = readJson(usersPath);
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = db.users.find((u) => u.email === normalizedEmail);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.cookie("auth_token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("auth_token");
  return res.json({ message: "Logged out" });
});

app.get("/api/auth/me", authRequired, (req, res) => {
  return res.json({ user: req.user });
});

app.get("/api/content", (req, res) => {
  return res.json(readJson(contentPath));
});

app.get("/api/admin/content", authRequired, sellerOnly, (req, res) => {
  return res.json(readJson(contentPath));
});

app.put("/api/admin/content", authRequired, sellerOnly, (req, res) => {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Valid content payload required" });
  }

  writeJson(contentPath, req.body);
  return res.json({ message: "Content updated", content: req.body });
});

app.get("/api/admin/users", authRequired, sellerOnly, (req, res) => {
  const db = readJson(usersPath);
  const users = db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));

  return res.json({ users });
});

app.post("/api/admin/upload-image", authRequired, sellerOnly, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || "Upload failed" });
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    return res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

ensureSeedSeller().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
