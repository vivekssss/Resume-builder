// AI Service using free APIs (HuggingFace Inference API)
// You can also use other free APIs like Google's Gemini, Cohere, etc.

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

export interface AIResponse {
  text: string;
  suggestions?: string[];
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string = '') {
    // For demo purposes, can work without API key with rate limits
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      // Using Google Gemini API
      const apiKey = 'AIzaSyBpjG5vwEq3bVYQKJXqOYZ4kF8u_9eEq3U';
      const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        console.warn('Gemini API error, using fallback');
        return '';
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text;
    } catch (error) {
      console.error('AI generation error:', error);
      return '';
    }
  }

  async enhanceSummary(currentSummary: string, jobTitle: string): Promise<string> {
    const prompt = `You are an expert resume writer. Improve this professional summary for a ${jobTitle} position.

Original: "${currentSummary}"

Requirements:
- Make it concise (3-4 sentences, under 100 words)
- Use strong action verbs and quantifiable achievements
- Make it ATS-friendly and professional
- Avoid excessive punctuation and multiple commas
- Use proper sentence structure
- Focus on value proposition and key skills

Return ONLY the improved summary text, nothing else.`;
    
    try {
      const enhanced = await this.generateContent(prompt);
      
      // If AI returns something useful, use it
      if (enhanced && enhanced.trim().length > 50) {
        // Clean up the response
        let cleaned = enhanced.trim();
        
        // Remove common AI prefixes
        cleaned = cleaned.replace(/^(Here's|Here is|Summary:|Professional Summary:|Improved Summary:)/i, '').trim();
        
        // Remove quotes if the entire text is quoted
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
        }
        
        // Fix multiple commas and excessive punctuation
        cleaned = cleaned.replace(/,\s*,+/g, ','); // Remove double commas
        cleaned = cleaned.replace(/\s+,/g, ','); // Fix spacing before commas
        cleaned = cleaned.replace(/,(\S)/g, ', $1'); // Ensure space after comma
        cleaned = cleaned.replace(/\.{2,}/g, '.'); // Remove multiple periods
        
        return cleaned;
      }
    } catch (error) {
      console.warn('AI enhancement failed, using offline enhancement');
    }
    
    // Offline fallback enhancement
    return this.offlineEnhanceSummary(currentSummary);
  }

  private offlineEnhanceSummary(summary: string): string {
    // Extract key information
    const hasYears = summary.match(/(\d+)\s*\+?\s*(year|yr)/i);
    const skills = summary.match(/(react|angular|vue|node|python|java|javascript|typescript|aws|azure|frontend|backend|fullstack|full-stack|developer|engineer|api|database|mongodb|mysql|postgresql|firebase|nextjs|next\.js)/gi);
    
    // Build enhanced summary with professional language
    let enhanced = summary;
    
    // Capitalize first letter
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    
    // Replace casual language with professional terms
    enhanced = enhanced
      .replace(/\bi am\b/gi, 'I am')
      .replace(/\bwith\s+(\d+)\s*\+?\s*year/gi, 'with $1+ years')
      .replace(/\balso have\b/gi, 'Additionally experienced in')
      .replace(/\bexperience in\b/gi, 'expertise in')
      .replace(/\bhandling\b/gi, 'managing')
      .replace(/\bteam handling\b/gi, 'team leadership and management')
      .replace(/\bintegrating api\b/gi, 'API integration')
      .replace(/\band\b(?!.*\band\b)/gi, ', and'); // Replace last 'and' with ', and'
    
    // Add period if missing
    if (!enhanced.endsWith('.') && !enhanced.endsWith('!')) {
      enhanced += '.';
    }
    
    return enhanced;
  }

  async improveJobDescription(description: string, jobTitle: string): Promise<string[]> {
    const prompt = `You are an expert resume writer. Improve this job responsibility for a ${jobTitle} position.

Original: "${description}"

Requirements:
- Start with a strong action verb (Led, Developed, Implemented, Managed, etc.)
- Add quantifiable metrics or impact (percentages, numbers, scale)
- Make it concise and impactful (one clear sentence)
- Avoid excessive commas - use proper sentence structure
- Make it ATS-friendly
- Keep it under 150 characters if possible

Return ONLY ONE improved version, nothing else. No bullet points, no numbering, just the improved text.`;
    
    try {
      const improved = await this.generateContent(prompt);
      
      // Clean up the response
      let cleaned = improved.trim();
      
      // Remove bullet points, numbers, prefixes
      cleaned = cleaned.replace(/^[-•*]\s*/, '');
      cleaned = cleaned.replace(/^\d+\.\s*/, '');
      cleaned = cleaned.replace(/^(Improved:|Enhanced:|Better:)/i, '').trim();
      
      // Remove quotes
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      
      // Fix punctuation issues
      cleaned = cleaned.replace(/,\s*,+/g, ','); // Remove double commas
      cleaned = cleaned.replace(/\s+,/g, ','); // Fix spacing before commas
      cleaned = cleaned.replace(/,(\S)/g, ', $1'); // Ensure space after comma
      
      // Ensure it starts with capital letter
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      
      return cleaned.length > 10 ? [cleaned] : [description];
    } catch (error) {
      console.error('Error improving description:', error);
      return [description];
    }
  }

  async generateSkillSuggestions(jobTitle: string, currentSkills: string[]): Promise<string[]> {
    const prompt = `List 10 important technical skills for a ${jobTitle} position. Exclude these skills already listed: ${currentSkills.join(', ')}. Return ONLY a comma-separated list of skills, nothing else.`;

    const result = await this.generateContent(prompt);
    if (!result) return [];

    return result
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .slice(0, 10);
  }

  async analyzResumeScore(resumeData: any): Promise<{
    score: number;
    suggestions: string[];
    strengths: string[];
  }> {
    // Simple rule-based analysis
    const suggestions: string[] = [];
    const strengths: string[] = [];
    let score = 60; // Base score

    // Check personal info
    if (resumeData.personalInfo.email && resumeData.personalInfo.phone) {
      score += 5;
      strengths.push('Complete contact information');
    } else {
      suggestions.push('Add complete contact information (email and phone)');
    }

    // Check summary
    if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 50) {
      score += 10;
      strengths.push('Professional summary present');
    } else {
      suggestions.push('Add a compelling professional summary (3-4 sentences)');
    }

    // Check experience
    if (resumeData.experience.length > 0) {
      score += 10;
      strengths.push(`${resumeData.experience.length} work experience entries`);
      
      const hasMetrics = resumeData.experience.some((exp: any) =>
        exp.description.some((desc: string) => /\d+/.test(desc))
      );
      if (hasMetrics) {
        score += 10;
        strengths.push('Quantifiable achievements included');
      } else {
        suggestions.push('Add metrics and numbers to your achievements');
      }
    } else {
      suggestions.push('Add at least one work experience entry');
    }

    // Check education
    if (resumeData.education.length > 0) {
      score += 5;
      strengths.push('Education information included');
    } else {
      suggestions.push('Add your educational background');
    }

    // Check skills
    const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length;
    if (totalSkills >= 8) {
      score += 10;
      strengths.push(`${totalSkills} skills listed`);
    } else if (totalSkills >= 5) {
      score += 5;
      suggestions.push('Consider adding more relevant skills (aim for 8-12)');
    } else {
      suggestions.push('Add more skills relevant to your target role');
    }

    return {
      score: Math.min(score, 100),
      suggestions,
      strengths,
    };
  }

  // Offline fallback suggestions
  async getActionVerbs(): Promise<string[]> {
    return [
      'Developed', 'Implemented', 'Designed', 'Led', 'Managed', 'Created',
      'Optimized', 'Increased', 'Reduced', 'Improved', 'Launched', 'Built',
      'Coordinated', 'Analyzed', 'Achieved', 'Delivered', 'Established',
      'Streamlined', 'Spearheaded', 'Executed', 'Collaborated', 'Directed',
    ];
  }

  async getTechnicalSkillSuggestions(category: string): Promise<string[]> {
    const skillSuggestions: Record<string, string[]> = {
      'Software Engineering': [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
        'Docker', 'Kubernetes', 'AWS', 'Git', 'CI/CD', 'REST APIs', 'GraphQL'
      ],
      'Data Science': [
        'Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
        'Machine Learning', 'Deep Learning', 'Data Visualization', 'Statistics'
      ],
      'Product Management': [
        'Agile', 'Scrum', 'JIRA', 'Product Strategy', 'User Research',
        'A/B Testing', 'Analytics', 'Roadmapping', 'Stakeholder Management'
      ],
      'Marketing': [
        'SEO', 'SEM', 'Google Analytics', 'Content Marketing', 'Social Media',
        'Email Marketing', 'Marketing Automation', 'CRM', 'A/B Testing'
      ],
      'Default': [
        'Communication', 'Leadership', 'Project Management', 'Problem Solving',
        'Teamwork', 'Analytical Skills', 'Time Management', 'Adaptability'
      ]
    };

    return skillSuggestions[category] || skillSuggestions['Default'];
  }

  async parseResume(resumeText: string): Promise<any> {
    console.log('Starting resume parsing, text length:', resumeText.length);
    
    // First try AI parsing
    try {
      const aiParsed = await this.aiParseResume(resumeText);
      if (aiParsed && aiParsed.personalInfo && aiParsed.personalInfo.fullName) {
        console.log('AI parsing successful');
        return aiParsed;
      }
    } catch (error) {
      console.warn('AI parsing failed, using offline parser:', error);
    }
    
    // Fallback to offline parsing
    console.log('Using offline resume parser');
    return this.offlineParseResume(resumeText);
  }

  private async aiParseResume(resumeText: string): Promise<any> {
    const prompt = `Extract structured data from this resume text and return ONLY a JSON object. Format:
{
  "personalInfo": {"fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "summary": ""},
  "experience": [{"company": "", "position": "", "location": "", "startDate": "", "endDate": "", "description": []}],
  "education": [{"institution": "", "degree": "", "field": "", "graduationDate": "", "gpa": ""}],
  "skills": {"technical": [], "soft": []},
  "projects": [{"name": "", "description": "", "technologies": []}],
  "certifications": [],
  "achievements": []
}

Resume text:
${resumeText.substring(0, 3000)}`; // Limit text to avoid token limits

    const result = await this.generateContent(prompt);
    if (!result) throw new Error('No AI response');
    
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid JSON response');
  }

  private offlineParseResume(resumeText: string): any {
    // Clean and normalize text
    const text = resumeText
      .replace(/\s+/g, ' ')
      .replace(/[\u0000-\u001F]/g, '')
      .trim();

    // Extract personal info
    const personalInfo = this.extractPersonalInfo(text);
    
    // Extract experience
    const experience = this.extractExperience(text);
    
    // Extract education
    const education = this.extractEducation(text);
    
    // Extract skills
    const skills = this.extractSkills(text);
    
    // Extract projects
    const projects = this.extractProjects(text);
    
    // Extract certifications and achievements
    const certifications = this.extractCertifications(text);
    const achievements = this.extractAchievements(text);

    const parsed = {
      personalInfo,
      experience,
      education,
      skills,
      projects,
      certifications,
      achievements
    };

    console.log('Offline parsing complete:', parsed);
    return parsed;
  }

  private extractPersonalInfo(text: string): any {
    const info: any = {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      summary: ''
    };

    // Extract name (usually at the beginning)
    const namePatterns = [
      /^([A-Z][a-z]+(\s+[A-Z][a-z]+){1,3})/,
      /^([A-Z\.]+\s+[A-Z][a-z]+)/,
      /^([A-Z][A-Z\s]+[A-Z][a-z]+)/
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = text.match(pattern);
      if (nameMatch) {
        info.fullName = nameMatch[1].trim();
        break;
      }
    }

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) info.email = emailMatch[1];

    // Extract phone
    const phonePatterns = [
      /\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\(\d{3}\)\s*\d{3}-\d{4}/,
      /\d{3}[\s.-]\d{3}[\s.-]\d{4}/,
      /\+\d{1,3}[\s.-]?\d{4,14}/
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch) {
        info.phone = phoneMatch[0].trim();
        break;
      }
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    if (linkedinMatch) info.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i);
    if (githubMatch) info.github = `github.com/${githubMatch[1]}`;

    // Extract location
    const locationPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2})(?:\s+\d{5})?/,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z][a-z]+)/
    ];
    
    for (const pattern of locationPatterns) {
      const locationMatch = text.match(pattern);
      if (locationMatch) {
        info.location = `${locationMatch[1]}, ${locationMatch[2]}`;
        break;
      }
    }

    // Extract summary/objective
    const summaryPatterns = [
      /(?:summary|objective|profile|about)\s*:?\s*([^\n]{50,500})/i,
      /(?:professional\s+summary)\s*:?\s*([^\n]{50,500})/i
    ];
    
    for (const pattern of summaryPatterns) {
      const summaryMatch = text.match(pattern);
      if (summaryMatch) {
        info.summary = summaryMatch[1].trim();
        break;
      }
    }

    return info;
  }

  private extractExperience(text: string): any[] {
    const experiences: any[] = [];
    
    // Common job title keywords
    const jobTitleKeywords = [
      'engineer', 'developer', 'manager', 'analyst', 'designer',
      'coordinator', 'specialist', 'consultant', 'director', 'lead',
      'architect', 'administrator', 'associate', 'assistant', 'intern'
    ];

    // Split text into sections
    const experienceSection = text.match(/(?:experience|employment|work\s+history)[\s\S]{0,3000}/i);
    const searchText = experienceSection ? experienceSection[0] : text;

    // Pattern to match job entries
    const jobPattern = new RegExp(
      `([A-Z][\w\s&,.-]+?)\s+(?:at|@|\||-)\s+([A-Z][\w\s&,.-]+?)\s*(?:\n|\||-)\s*([A-Za-z]{3,9}\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(?:-|to|–)\s*(Present|Current|[A-Za-z]{3,9}\s+\d{4}|\d{1,2}\/\d{4}|\d{4})?`,
      'gi'
    );

    const matches = Array.from(searchText.matchAll(jobPattern));
    
    for (const match of matches.slice(0, 5)) { // Limit to 5 experiences
      const position = match[1].trim();
      const company = match[2].trim();
      const startDate = match[3].trim();
      const endDate = match[4] ? match[4].trim() : 'Present';

      // Validate if it's likely a job title
      const isValidJob = jobTitleKeywords.some(keyword => 
        position.toLowerCase().includes(keyword)
      );

      if (isValidJob || position.length > 3) {
        experiences.push({
          id: String(experiences.length + 1),
          position: position,
          company: company,
          location: '',
          startDate: startDate,
          endDate: endDate,
          current: endDate.toLowerCase() === 'present' || endDate.toLowerCase() === 'current',
          description: []
        });
      }
    }

    // If no experiences found with pattern, try basic extraction
    if (experiences.length === 0) {
      // Look for company names and positions
      const lines = searchText.split('\n');
      let currentExp: any = null;
      
      for (const line of lines) {
        const hasJobKeyword = jobTitleKeywords.some(kw => line.toLowerCase().includes(kw));
        if (hasJobKeyword && line.length < 100) {
          if (currentExp) experiences.push(currentExp);
          currentExp = {
            id: String(experiences.length + 1),
            position: line.trim(),
            company: 'Company',
            location: '',
            startDate: '2020',
            endDate: 'Present',
            current: true,
            description: []
          };
        }
      }
      if (currentExp) experiences.push(currentExp);
    }

    return experiences;
  }

  private extractEducation(text: string): any[] {
    const education: any[] = [];
    
    // Common degree patterns
    const degreePatterns = [
      /(?:Bachelor|B\.?S\.?|B\.?A\.?|Master|M\.?S\.?|M\.?A\.?|PhD|Ph\.?D\.?|Associate|A\.?S\.?)\s+(?:of|in)?\s+([A-Za-z\s]+?)\s*(?:from|at|-|,)?\s*([A-Z][\w\s]+?)(?:\s*(?:,|-)\s*(\d{4}))?/gi,
      /([A-Z][\w\s]+?(?:University|College|Institute|School))\s*(?:,|-)\s*([A-Za-z\s]+?)\s*(?:,|-)\s*(\d{4})/gi
    ];

    for (const pattern of degreePatterns) {
      const matches = Array.from(text.matchAll(pattern));
      for (const match of matches.slice(0, 3)) { // Limit to 3 education entries
        const degree = match[1] ? match[1].trim() : 'Degree';
        const institution = match[2] ? match[2].trim() : '';
        const year = match[3] ? match[3].trim() : '';

        if (institution.length > 3) {
          education.push({
            id: String(education.length + 1),
            institution: institution,
            degree: degree.includes('University') || degree.includes('College') ? 'Bachelor of Science' : degree,
            field: degree.includes('University') || degree.includes('College') ? '' : degree,
            graduationDate: year || '2020',
            gpa: '',
            location: ''
          });
        }
      }
    }

    return education;
  }

  private extractSkills(text: string): any {
    const skills = {
      technical: [] as string[],
      soft: [] as string[],
      languages: [] as string[]
    };

    // Technical skills patterns
    const techSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'PHP', 'Ruby', 'Go', 'Swift',
      'React', 'Angular', 'Vue', 'Node\\.js', 'Express', 'Django', 'Flask', 'Spring',
      'HTML', 'CSS', 'SASS', 'Bootstrap', 'Tailwind',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins',
      'Git', 'GitHub', 'GitLab', 'CI/CD', 'REST', 'GraphQL', 'API'
    ];

    // Soft skills patterns
    const softSkills = [
      'Leadership', 'Communication', 'Teamwork', 'Problem Solving',
      'Project Management', 'Time Management', 'Critical Thinking',
      'Adaptability', 'Creativity', 'Collaboration'
    ];

    // Extract technical skills
    for (const skill of techSkills) {
      const pattern = new RegExp(`\\b${skill}\\b`, 'i');
      if (pattern.test(text) && !skills.technical.includes(skill)) {
        skills.technical.push(skill.replace(/\\/g, ''));
      }
    }

    // Extract soft skills
    for (const skill of softSkills) {
      const pattern = new RegExp(`\\b${skill}\\b`, 'i');
      if (pattern.test(text) && !skills.soft.includes(skill)) {
        skills.soft.push(skill);
      }
    }

    // Extract languages
    const langPattern = /(English|Spanish|French|German|Chinese|Japanese|Korean|Hindi|Arabic)\s*\(?(?:Native|Fluent|Professional|Intermediate|Basic)?\)?/gi;
    const langMatches = Array.from(text.matchAll(langPattern));
    for (const match of langMatches.slice(0, 3)) {
      const lang = match[0].trim();
      if (!skills.languages.includes(lang)) {
        skills.languages.push(lang);
      }
    }

    return skills;
  }

  private extractProjects(text: string): any[] {
    const projects: any[] = [];
    
    // Look for project section
    const projectSection = text.match(/(?:projects?|portfolio)[\s\S]{0,2000}/i);
    if (projectSection) {
      const lines = projectSection[0].split('\n');
      let currentProject: any = null;
      
      for (const line of lines) {
        // Check if line might be a project name
        if (line.length > 5 && line.length < 100 && /^[A-Z]/.test(line.trim())) {
          if (currentProject) projects.push(currentProject);
          currentProject = {
            id: String(projects.length + 1),
            name: line.trim(),
            description: '',
            technologies: []
          };
        }
      }
      if (currentProject) projects.push(currentProject);
    }

    return projects.slice(0, 5); // Limit to 5 projects
  }

  private extractCertifications(text: string): string[] {
    const certifications: string[] = [];
    
    // Common certification patterns
    const certPatterns = [
      /(?:Certified|Certification)\s+([A-Za-z\s]+?)(?:\n|,|\.|$)/gi,
      /([A-Z]{2,}\s+(?:Certified|Certificate)[\w\s]+)/gi
    ];

    for (const pattern of certPatterns) {
      const matches = Array.from(text.matchAll(pattern));
      for (const match of matches.slice(0, 5)) {
        const cert = match[1] ? match[1].trim() : match[0].trim();
        if (cert.length > 5 && cert.length < 100 && !certifications.includes(cert)) {
          certifications.push(cert);
        }
      }
    }

    return certifications;
  }

  private extractAchievements(text: string): string[] {
    const achievements: string[] = [];
    
    // Look for achievements section
    const achievementSection = text.match(/(?:achievements?|awards?|honors?)[\s\S]{0,1000}/i);
    if (achievementSection) {
      const lines = achievementSection[0].split('\n');
      for (const line of lines.slice(1, 6)) { // Skip header, take max 5
        if (line.trim().length > 10 && line.trim().length < 150) {
          achievements.push(line.trim());
        }
      }
    }

    return achievements;
  }
}

export const aiService = new AIService();
