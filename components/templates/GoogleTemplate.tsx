"use client";

import { useResumeStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function GoogleTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    <div className="p-8 bg-white text-gray-900 min-h-[1056px]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header - Colorful accent */}
      <div className="border-l-4 border-blue-500 pl-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName || "Your Name"}</h1>
        <div className="text-sm text-gray-600 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          <div className="flex gap-3 mt-1">
            {personalInfo.linkedin && <span className="text-blue-600">LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span className="text-blue-600">GitHub: {personalInfo.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">ABOUT</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed pl-4">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">EXPERIENCE</h2>
          </div>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 pl-4">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-600 font-medium">{exp.company} · {exp.location}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
              </div>
              <ul className="list-none text-sm text-gray-700 space-y-1 mt-2">
                {exp.description.map((desc, i) => (
                  <li key={i}>
                    <span className="text-blue-500 mt-1.5">▸</span>
                    {renderMarkdown(desc)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">PROJECTS</h2>
          </div>
          {projects.map((project) => (
            <div key={project.id} className="mb-3 pl-4">
              <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-semibold">Tech:</span> {project.technologies.join(", ")}
                </p>
              )}
              {project.link && (
                <p className="text-xs text-green-600 mt-0.5">
                  <span className="font-semibold">Link:</span> {project.link}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">EDUCATION</h2>
          </div>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2 pl-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree} {edu.field && `· ${edu.field}`}</h3>
                </div>
                <span className="text-xs text-gray-500">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.technical.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">SKILLS</h2>
          </div>
          <p className="text-sm text-gray-700 pl-4">{skills.technical.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
