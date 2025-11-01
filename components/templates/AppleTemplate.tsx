"use client";

import { useResumeStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function AppleTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    <div className="p-10 bg-white text-black min-h-[1056px]" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Minimalist Header */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-light tracking-tight mb-3">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-sm text-gray-600 space-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto">{renderMarkdown(personalInfo.summary)}</p>
        </div>
      )}

      <hr className="border-gray-200 mb-6" />

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-4">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between mb-1">
                <h3 className="text-lg font-medium">{exp.position}</h3>
                <span className="text-sm text-gray-500">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exp.company}, {exp.location}</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-sm text-gray-600">{renderMarkdown(desc)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-4">Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="text-lg font-medium">{project.name}</h3>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{project.description}</p>
              <p className="text-xs text-gray-500 mt-1">{project.technologies.join(" • ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-4">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.technical.length > 0 && (
        <div>
          <h2 className="text-2xl font-light mb-4">Skills</h2>
          <p className="text-sm text-gray-700">{skills.technical.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
