import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  location?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  certifications: string[];
  achievements: string[];
  selectedTemplate: string;
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
  selectedTemplate: 'modern',
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Personal Info
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    // Experience
    addExperience: (state, action: PayloadAction<WorkExperience>) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ id: string; data: Partial<WorkExperience> }>) => {
      const index = state.experience.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = { ...state.experience[index], ...action.payload.data };
      }
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
    },

    // Education
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ id: string; data: Partial<Education> }>) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...action.payload.data };
      }
    },
    deleteEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },

    // Skills
    updateSkills: (state, action: PayloadAction<Partial<Skills>>) => {
      state.skills = { ...state.skills, ...action.payload };
    },

    // Projects
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string; data: Partial<Project> }>) => {
      const index = state.projects.findIndex(proj => proj.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload.data };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(proj => proj.id !== action.payload);
    },

    // Certifications & Achievements
    updateCertifications: (state, action: PayloadAction<string[]>) => {
      state.certifications = action.payload;
    },
    updateAchievements: (state, action: PayloadAction<string[]>) => {
      state.achievements = action.payload;
    },

    // Template
    setTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = action.payload;
    },

    // Bulk operations
    loadResumeData: (state, action: PayloadAction<ResumeData>) => {
      return action.payload;
    },
    resetResumeData: () => initialState,

    // AI Population
    populateFromAI: (state, action: PayloadAction<any>) => {
      const data = action.payload;
      
      if (data.personalInfo) {
        state.personalInfo = { ...state.personalInfo, ...data.personalInfo };
      }
      if (data.experience) {
        state.experience = data.experience;
      }
      if (data.education) {
        state.education = data.education;
      }
      if (data.skills) {
        state.skills = { ...state.skills, ...data.skills };
      }
      if (data.projects) {
        state.projects = data.projects;
      }
      if (data.certifications) {
        state.certifications = data.certifications;
      }
      if (data.achievements) {
        state.achievements = data.achievements;
      }
    },

    // Save trigger for saga
    saveToCloud: (state) => {
      // This action will be caught by saga
    },
    autoSave: (state) => {
      // This action will be caught by saga for auto-save
    },
  },
});

export const {
  updatePersonalInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  updateSkills,
  addProject,
  updateProject,
  deleteProject,
  updateCertifications,
  updateAchievements,
  setTemplate,
  loadResumeData,
  resetResumeData,
  populateFromAI,
  saveToCloud,
  autoSave,
} = resumeSlice.actions;

export default resumeSlice.reducer;
