/**
 * To run this server:
 * 1. Initialize npm: npm init -y
 * 2. Install dependencies: npm install express cors body-parser uuid
 * 3. Run: node index.js (or ts-node index.ts if using TypeScript)
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types (Mirrored from frontend)
interface Developer {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Full-Stack';
  techStack: string[];
  experience: number;
}

// In-memory "Database" seeded with example data
let developers: Developer[] = [
  { id: uuidv4(), name: "Aman Roy", role: "Full-Stack", techStack: ["React", "Node.js", "MongoDB"], experience: 3 },
  { id: uuidv4(), name: "Priya Singh", role: "Frontend", techStack: ["React", "Tailwind"], experience: 2 },
  { id: uuidv4(), name: "Vikram Patel", role: "Backend", techStack: ["Node.js", "Express", "SQLite"], experience: 4 },
  { id: uuidv4(), name: "Sarah Chen", role: "Frontend", techStack: ["Vue.js", "Sass", "Firebase"], experience: 5 },
  { id: uuidv4(), name: "David Kim", role: "Backend", techStack: ["Python", "Django", "PostgreSQL"], experience: 3 },
  { id: uuidv4(), name: "Emma Wilson", role: "Full-Stack", techStack: ["Next.js", "Prisma", "AWS"], experience: 4 },
  { id: uuidv4(), name: "James Lee", role: "Frontend", techStack: ["React", "Redux", "Material UI"], experience: 2 },
  { id: uuidv4(), name: "Maria Garcia", role: "Backend", techStack: ["Java", "Spring Boot", "MySQL"], experience: 6 },
  { id: uuidv4(), name: "Robert Taylor", role: "Full-Stack", techStack: ["Angular", ".NET Core", "Azure"], experience: 7 },
  { id: uuidv4(), name: "Lisa Wong", role: "Frontend", techStack: ["Svelte", "Tailwind", "Vercel"], experience: 1 },
  { id: uuidv4(), name: "Michael Brown", role: "Backend", techStack: ["Go", "Docker", "Kubernetes"], experience: 4 }
];

// GET /developers
app.get('/developers', (req: Request, res: Response) => {
  try {
    const { role, tech, search } = req.query;
    let results = [...developers];

    // Filter by Role
    if (role && typeof role === 'string') {
      results = results.filter(d => d.role.toLowerCase() === role.toLowerCase());
    }

    // Filter by Tech Stack (keyword match)
    if (tech && typeof tech === 'string') {
      const techQuery = tech.toLowerCase();
      results = results.filter(d => 
        d.techStack.some(t => t.toLowerCase().includes(techQuery))
      );
    }

    // Search by Name
    if (search && typeof search === 'string') {
      results = results.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /developers
app.post('/developers', (req: Request, res: Response) => {
  try {
    const { name, role, techStack, experience } = req.body;

    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Name is required and must be at least 2 characters." });
    }
    const validRoles = ['Frontend', 'Backend', 'Full-Stack'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    if (!Array.isArray(techStack) || techStack.length === 0) {
      return res.status(400).json({ message: "Tech Stack must be a non-empty array." });
    }
    if (experience === undefined || experience < 0) {
      return res.status(400).json({ message: "Experience must be a positive number." });
    }

    const newDeveloper: Developer = {
      id: uuidv4(),
      name,
      role,
      techStack,
      experience
    };

    developers.push(newDeveloper);
    res.status(201).json(newDeveloper);
  } catch (error) {
    res.status(500).json({ message: "Failed to create developer." });
  }
});

// PUT /developers/:id
app.put('/developers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, techStack, experience } = req.body;
    
    const index = developers.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Name is required and must be at least 2 characters." });
    }
    const validRoles = ['Frontend', 'Backend', 'Full-Stack'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    if (!Array.isArray(techStack) || techStack.length === 0) {
      return res.status(400).json({ message: "Tech Stack must be a non-empty array." });
    }
    if (experience === undefined || experience < 0) {
      return res.status(400).json({ message: "Experience must be a positive number." });
    }

    const updatedDeveloper: Developer = {
      ...developers[index],
      name,
      role,
      techStack,
      experience
    };

    developers[index] = updatedDeveloper;
    res.json(updatedDeveloper);
  } catch (error) {
    res.status(500).json({ message: "Failed to update developer." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});