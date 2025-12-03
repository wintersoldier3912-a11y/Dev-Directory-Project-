import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Buffer } from 'buffer';

declare var __dirname: string;

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'devdirectory-secret-key-change-in-prod';
const DB_FILE = path.join(__dirname, 'db.json');

// --- Types & Interfaces ---
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface Developer {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Full-Stack';
  techStack: string[];
  experience: number;
  about?: string;
  joiningDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface DB {
  users: User[];
  developers: Developer[];
}

// --- Persistence Layer (JSON File DB) ---
class FileDB {
  private data: DB;

  constructor() {
    this.data = { users: [], developers: [] };
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_FILE)) {
      // Seed with default admin
      const adminId = uuidv4();
      const adminUser: User = {
        id: adminId,
        name: "Admin User",
        email: "admin@talrn.com",
        passwordHash: this.hashPassword("password123")
      };
      
      // Seed developers
      const seedDevs: Developer[] = [
        { id: uuidv4(), name: "Aman Roy", role: "Full-Stack", techStack: ["React", "Node.js", "MongoDB"], experience: 3, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), about: "Passionate full stack dev." },
        { id: uuidv4(), name: "Priya Singh", role: "Frontend", techStack: ["React", "Tailwind"], experience: 2, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), about: "UI/UX enthusiast." },
        { id: uuidv4(), name: "Vikram Patel", role: "Backend", techStack: ["Node.js", "Express", "SQLite"], experience: 4, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), about: "Backend architect." },
         { id: uuidv4(), name: "Sarah Chen", role: "Frontend", techStack: ["Vue.js", "Sass", "Firebase"], experience: 5, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "David Kim", role: "Backend", techStack: ["Python", "Django", "PostgreSQL"], experience: 3, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "Emma Wilson", role: "Full-Stack", techStack: ["Next.js", "Prisma", "AWS"], experience: 4, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "James Lee", role: "Frontend", techStack: ["React", "Redux", "Material UI"], experience: 2, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "Maria Garcia", role: "Backend", techStack: ["Java", "Spring Boot", "MySQL"], experience: 6, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "Robert Taylor", role: "Full-Stack", techStack: ["Angular", ".NET Core", "Azure"], experience: 7, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "Lisa Wong", role: "Frontend", techStack: ["Svelte", "Tailwind", "Vercel"], experience: 1, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: uuidv4(), name: "Michael Brown", role: "Backend", techStack: ["Go", "Docker", "Kubernetes"], experience: 4, createdBy: adminId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];

      this.data = { users: [adminUser], developers: seedDevs };
      this.save();
    } else {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      this.data = JSON.parse(raw);
    }
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  public getUsers() { return this.data.users; }
  public getDevelopers() { return this.data.developers; }
  
  public addUser(user: User) {
    this.data.users.push(user);
    this.save();
  }

  public addDeveloper(dev: Developer) {
    this.data.developers.push(dev);
    this.save();
  }

  public updateDeveloper(index: number, dev: Developer) {
    this.data.developers[index] = dev;
    this.save();
  }

  public deleteDeveloper(index: number) {
    this.data.developers.splice(index, 1);
    this.save();
  }

  public hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}

const db = new FileDB();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Auth Middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string };
  headers: any;
  query: any;
  body: any;
  params: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  // Simple Base64 mock verification (In prod use jsonwebtoken.verify)
  // Here we are decoding the payload to get user ID for the demo
  try {
     const [header, payload, signature] = token.split('.');
     const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
     // Validate signature logic would go here in real JWT
     req.user = decoded;
     next();
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Helper to sign token (Mock JWT for demo)
const signToken = (user: User) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + (60 * 60) })).toString('base64'); // 1 hour
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64');
  return `${header}.${payload}.${signature}`;
}

// --- Auth Routes ---

app.post('/auth/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  const existing = db.getUsers().find(u => u.email === email);
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    passwordHash: db.hashPassword(password)
  };
  db.addUser(newUser);

  const token = signToken(newUser);
  res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
});

app.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.getUsers().find(u => u.email === email);
  
  if (!user || user.passwordHash !== db.hashPassword(password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// --- Developer Routes ---

// GET /developers (Pagination, Filter, Sort)
app.get('/developers', authenticateToken, (req: AuthRequest, res: Response) => {
  let results = [...db.getDevelopers()];
  const { role, tech, search, sort, page = 1, limit = 9 } = req.query;

  // Filters
  if (role) {
    results = results.filter(d => d.role.toLowerCase() === (role as string).toLowerCase());
  }
  if (tech) {
    const techQuery = (tech as string).toLowerCase();
    results = results.filter(d => d.techStack.some(t => t.toLowerCase().includes(techQuery)));
  }
  if (search) {
    const searchQuery = (search as string).toLowerCase();
    results = results.filter(d => d.name.toLowerCase().includes(searchQuery));
  }

  // Sorting
  if (sort === 'experience_asc') {
    results.sort((a, b) => a.experience - b.experience);
  } else if (sort === 'experience_desc') {
    results.sort((a, b) => b.experience - a.experience);
  } else {
    // Default: Newest first (based on createdAt)
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const total = results.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const paginatedResults = results.slice(start, start + limitNum);

  res.json({
    data: paginatedResults,
    total,
    page: pageNum,
    totalPages
  });
});

// GET /developers/:id
app.get('/developers/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const dev = db.getDevelopers().find(d => d.id === req.params.id);
  if (!dev) return res.status(404).json({ message: "Not found" });
  res.json(dev);
});

// POST /developers
app.post('/developers', authenticateToken, (req: AuthRequest, res: Response) => {
  const { name, role, techStack, experience, about, joiningDate } = req.body;
  
  // Validation
  if (!name || name.length < 2) return res.status(400).json({ message: "Invalid Name" });
  if (!techStack || !Array.isArray(techStack)) return res.status(400).json({ message: "Invalid Tech Stack" });

  const newDev: Developer = {
    id: uuidv4(),
    name,
    role,
    techStack,
    experience,
    about,
    joiningDate,
    createdBy: req.user!.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.addDeveloper(newDev);
  res.status(201).json(newDev);
});

// PUT /developers/:id
app.put('/developers/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const index = db.getDevelopers().findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  const existing = db.getDevelopers()[index];
  const updated: Developer = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  db.updateDeveloper(index, updated);
  res.json(updated);
});

// DELETE /developers/:id
app.delete('/developers/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const index = db.getDevelopers().findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  db.deleteDeveloper(index);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});