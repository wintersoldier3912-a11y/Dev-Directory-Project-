import { Developer, FilterState, Role } from '../types';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:3001';

// Fallback data for offline mode
const mockDevelopers: Developer[] = [
  { id: '1', name: "Aman Roy", role: Role.FULLSTACK, techStack: ["React", "Node.js", "MongoDB"], experience: 3 },
  { id: '2', name: "Priya Singh", role: Role.FRONTEND, techStack: ["React", "Tailwind"], experience: 2 },
  { id: '3', name: "Vikram Patel", role: Role.BACKEND, techStack: ["Node.js", "Express", "SQLite"], experience: 4 },
  { id: '4', name: "Sarah Chen", role: Role.FRONTEND, techStack: ["Vue.js", "Sass", "Firebase"], experience: 5 },
  { id: '5', name: "David Kim", role: Role.BACKEND, techStack: ["Python", "Django", "PostgreSQL"], experience: 3 },
  { id: '6', name: "Emma Wilson", role: Role.FULLSTACK, techStack: ["Next.js", "Prisma", "AWS"], experience: 4 },
  { id: '7', name: "James Lee", role: Role.FRONTEND, techStack: ["React", "Redux", "Material UI"], experience: 2 },
  { id: '8', name: "Maria Garcia", role: Role.BACKEND, techStack: ["Java", "Spring Boot", "MySQL"], experience: 6 },
  { id: '9', name: "Robert Taylor", role: Role.FULLSTACK, techStack: ["Angular", ".NET Core", "Azure"], experience: 7 },
  { id: '10', name: "Lisa Wong", role: Role.FRONTEND, techStack: ["Svelte", "Tailwind", "Vercel"], experience: 1 },
  { id: '11', name: "Michael Brown", role: Role.BACKEND, techStack: ["Go", "Docker", "Kubernetes"], experience: 4 }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDevelopers = async (filters: FilterState): Promise<Developer[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.tech) params.append('tech', filters.tech);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_URL}/developers?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch developers');
    }
    
    return await response.json();
  } catch (error) {
    console.warn("Backend unavailable or fetch failed, serving mock data.", error);
    
    // Fallback logic wrapped to prevent re-throwing
    try {
      await delay(300); // Simulate network latency

      let results = [...mockDevelopers];

      // Safe filtering
      if (filters?.role) {
        results = results.filter(d => d.role === filters.role);
      }

      if (filters?.tech) {
        const techQuery = filters.tech.toLowerCase();
        results = results.filter(d => 
          d.techStack.some(t => t.toLowerCase().includes(techQuery))
        );
      }

      if (filters?.search) {
        const searchQuery = filters.search.toLowerCase();
        results = results.filter(d => 
          d.name.toLowerCase().includes(searchQuery)
        );
      }

      return results;
    } catch (fallbackError) {
      console.error("Fallback logic failed", fallbackError);
      return [];
    }
  }
};

export const createDeveloper = async (developer: Omit<Developer, 'id'>): Promise<Developer> => {
  try {
    const response = await fetch(`${API_URL}/developers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developer),
    });

    if (!response.ok) {
      throw new Error('Failed to create developer');
    }

    return await response.json();
  } catch (error) {
    console.warn("Using mock data for creation.", error);
    await delay(300);
    
    const newDev: Developer = {
      ...developer,
      id: uuidv4()
    };
    mockDevelopers.push(newDev);
    return newDev;
  }
};

export const updateDeveloper = async (id: string, developer: Omit<Developer, 'id'>): Promise<Developer> => {
  try {
    const response = await fetch(`${API_URL}/developers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developer),
    });

    if (!response.ok) {
      throw new Error('Failed to update developer');
    }

    return await response.json();
  } catch (error) {
    console.warn("Using mock data for update.", error);
    await delay(300);

    const index = mockDevelopers.findIndex(d => d.id === id);
    if (index === -1) {
        // Create if not found in mock to behave nicely
        const newDev = { ...developer, id };
        mockDevelopers.push(newDev);
        return newDev;
    }

    const updatedDev = { ...mockDevelopers[index], ...developer };
    mockDevelopers[index] = updatedDev;
    return updatedDev;
  }
};