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
${resumeText}`;

    try {
      const result = await this.generateContent(prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Resume parsing error:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
