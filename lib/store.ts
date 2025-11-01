import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: string[];
  achievements: string[];
}

interface ResumeStore extends ResumeData {
  selectedTemplate: string;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: WorkExperience) => void;
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  updateSkills: (skills: Partial<Skills>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateCertifications: (certs: string[]) => void;
  updateAchievements: (achievements: string[]) => void;
  setTemplate: (template: string) => void;
  populateFromAI: (data: any) => void;
  loadFromStorage: () => void;
  clearAllData: () => void;
  hasStoredData: () => boolean;
}

const initialState: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
  },
  projects: [],
  certifications: [],
  achievements: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialState,
  selectedTemplate: 'modern',
  
  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
    })),
  
  addExperience: (exp) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [...state.resumeData.experience, exp],
      },
    })),
  
  updateExperience: (id, exp) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      },
    })),
  
  deleteExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((e) => e.id !== id),
      },
    })),
  
  addEducation: (edu) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [...state.resumeData.education, edu],
      },
    })),
  
  updateEducation: (id, edu) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((e) =>
          e.id === id ? { ...e, ...edu } : e
        ),
      },
    })),
  
  deleteEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((e) => e.id !== id),
      },
    })),
  
  addProject: (project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [...state.resumeData.projects, project],
      },
    })),
  
  updateProject: (id, project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    })),
  
  deleteProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((p) => p.id !== id),
      },
    })),
  
  updateSkills: (skills) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: { ...state.resumeData.skills, ...skills },
      },
    })),
  
  updateCertifications: (certs) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: certs,
      },
    })),
  
  updateAchievements: (achievements) => set((state) => ({ resumeData: { ...state.resumeData, achievements } })),
  
  populateFromAI: (data: any) => set((state) => {
    const updates: any = {};
    
    if (data.personalInfo) {
      updates.personalInfo = { ...state.personalInfo, ...data.personalInfo };
    }
    if (data.experience) {
      updates.experience = data.experience;
    }
    if (data.education) {
      updates.education = data.education;
    }
    if (data.skills) {
      updates.skills = { ...state.skills, ...data.skills };
    }
    if (data.projects) {
      updates.projects = data.projects;
    }
    if (data.certifications) {
      updates.certifications = data.certifications;
    }
    if (data.achievements) {
      updates.achievements = data.achievements;
    }
    
    return updates;
  }),

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('resume-storage');
      if (stored) {
        const data = JSON.parse(stored);
        set(data.state || data);
        console.log('✅ Resume data loaded from localStorage');
        return true;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return false;
  },

  clearAllData: () => {
    set({ resumeData: initialState, selectedTemplate: 'modern' });
    localStorage.removeItem('resume-storage');
    console.log('🗑️  All resume data cleared');
  },

  hasStoredData: () => {
    try {
      const stored = localStorage.getItem('resume-storage');
      if (stored) {
        const data = JSON.parse(stored);
        const state = data.state || data;
        // Check if there's any meaningful data
        return (
          state.personalInfo?.fullName ||
          state.experience?.length > 0 ||
          state.education?.length > 0 ||
          state.skills?.technical?.length > 0
        );
      }
    } catch (error) {
      console.error('Error checking stored data:', error);
    }
    return false;
  },

  setTemplate: (template) => set({ selectedTemplate: template }),
  
  resetResume: () => set({ resumeData: initialState }),
}));
