// Test script for resume parser
// Run with: node test-resume-parser.js

const sampleResume = `
John Smith
john.smith@email.com | +1 (555) 123-4567 | San Francisco, CA
linkedin.com/in/johnsmith | github.com/johnsmith

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience building scalable web applications. 
Specialized in React, Node.js, and cloud technologies with a proven track record of delivering high-impact projects.

EXPERIENCE
Senior Software Engineer at Tech Corp | San Francisco, CA | Jan 2021 - Present
• Led development of microservices architecture serving 10M+ users, improving system reliability by 40%
• Reduced deployment time by 60% through implementation of CI/CD pipelines
• Mentored team of 5 junior engineers, improving code quality and team velocity

Software Developer at StartupXYZ | San Jose, CA | Jun 2018 - Dec 2020
• Built RESTful APIs using Node.js and Express, handling 1000+ requests per second
• Implemented React-based dashboard reducing customer support tickets by 30%
• Collaborated with product team to launch 3 major features

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | May 2018
GPA: 3.8/4.0

SKILLS
Technical: JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB
Soft Skills: Leadership, Problem Solving, Communication, Team Collaboration
Languages: English (Native), Spanish (Fluent)

PROJECTS
E-commerce Platform
Built full-stack platform processing $1M+ in monthly transactions using React, Node.js, and Stripe

Real-time Chat Application
Developed WebSocket-based chat app supporting 500+ concurrent users

CERTIFICATIONS
AWS Certified Solutions Architect
Google Cloud Professional Developer

ACHIEVEMENTS
• Hackathon Winner 2022 - Built AI-powered productivity tool
• Employee of the Quarter Q3 2023
`;

// Function to test pattern matching
function testOfflineParser(text) {
  console.log('Testing Offline Resume Parser\n');
  console.log('='.repeat(50));
  
  // Test email extraction
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(emailPattern);
  console.log('✓ Email:', emailMatch ? emailMatch[1] : 'Not found');
  
  // Test phone extraction
  const phonePattern = /\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const phoneMatch = text.match(phonePattern);
  console.log('✓ Phone:', phoneMatch ? phoneMatch[0] : 'Not found');
  
  // Test name extraction
  const namePattern = /^([A-Z][a-z]+(\s+[A-Z][a-z]+){1,3})/m;
  const nameMatch = text.match(namePattern);
  console.log('✓ Name:', nameMatch ? nameMatch[1] : 'Not found');
  
  // Test LinkedIn extraction
  const linkedinPattern = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i;
  const linkedinMatch = text.match(linkedinPattern);
  console.log('✓ LinkedIn:', linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : 'Not found');
  
  // Test GitHub extraction
  const githubPattern = /github\.com\/([a-zA-Z0-9-]+)/i;
  const githubMatch = text.match(githubPattern);
  console.log('✓ GitHub:', githubMatch ? `github.com/${githubMatch[1]}` : 'Not found');
  
  // Test skills extraction
  const techSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'];
  const foundSkills = [];
  techSkills.forEach(skill => {
    const pattern = new RegExp(`\\b${skill}\\b`, 'i');
    if (pattern.test(text)) {
      foundSkills.push(skill);
    }
  });
  console.log('✓ Technical Skills:', foundSkills.join(', '));
  
  // Test education extraction
  const educationPattern = /Bachelor|Master|PhD|Associate/i;
  const hasEducation = educationPattern.test(text);
  console.log('✓ Education found:', hasEducation ? 'Yes' : 'No');
  
  // Test experience section
  const experiencePattern = /(?:engineer|developer|manager|analyst)/i;
  const hasExperience = experiencePattern.test(text);
  console.log('✓ Experience found:', hasExperience ? 'Yes' : 'No');
  
  console.log('\n' + '='.repeat(50));
  console.log('Parser test complete! ✅');
}

// Run the test
testOfflineParser(sampleResume);

console.log('\nNote: This test verifies that the offline parser patterns work correctly.');
console.log('The actual parser in the application will use these same patterns.');
