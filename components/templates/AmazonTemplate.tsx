"use client";

import { useResumeStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function AmazonTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-white text-black min-h-[1056px]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header - Simple and Clean */}
      <div className="mb-6 pb-3 border-b-2 border-black">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-1">{personalInfo.fullName || "YOUR NAME"}</h1>
        <div className="text-xs space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>LinkedIn: {personalInfo.linkedin}</p>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2">SUMMARY</h2>
          <p className="text-sm text-gray-700">{renderMarkdown(personalInfo.summary)}</p>
        </div>
      )}

      {/* Experience - Focus on Impact */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2">PROFESSIONAL EXPERIENCE</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <p className="font-bold text-xs">{exp.company} - {exp.position}</p>
                <p className="text-xs">{exp.startDate} - {exp.endDate}</p>
              </div>
              <ul className="list-none text-xs space-y-1 ml-0">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-sm">{renderMarkdown(desc)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2">KEY PROJECTS</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <p className="font-bold text-xs">{project.name}</p>
              <p className="text-xs leading-relaxed mb-1">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs italic">Technologies: {project.technologies.join(", ")}</p>
              )}
              {project.link && (
                <p className="text-xs text-blue-700 mt-0.5">Link: {project.link}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <p className="font-bold text-xs">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p className="text-xs">{edu.graduationDate}</p>
              </div>
              <p className="text-xs">{edu.institution}{edu.gpa && ` - GPA: ${edu.gpa}`}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.technical.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2">TECHNICAL SKILLS</h2>
          <p className="text-xs">{skills.technical.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}
