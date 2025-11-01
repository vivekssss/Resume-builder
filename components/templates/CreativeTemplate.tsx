"use client";

import { useResumeStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function CreativeTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className="bg-white min-h-[1056px]">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-3 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {personalInfo.summary && (
          <p className="text-gray-700 italic">{renderMarkdown(personalInfo.summary)}</p>
        )}
      </div>

      <div className="p-8">
        {/* Skills Highlight */}
        {skills.technical.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 mr-3"></span>
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.technical.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 mr-3"></span>
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 pl-4 border-l-2 border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                    <p className="text-sm text-blue-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  {exp.description.map((desc, i) => (
                    <li key={i} className="flex">
                      <span className="text-blue-600 mr-2">▸</span>
                      <span>{renderMarkdown(desc)}</span>
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
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 mr-3"></span>
              Featured Projects
            </h2>
            <div className="grid gap-3">
              {projects.map((project) => (
                <div key={project.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                  <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                  <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <p className="text-xs text-blue-600 mt-2">🔗 {project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 mr-3"></span>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 mr-3"></span>
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, idx) => (
                <span key={idx} className="text-xs text-gray-700 bg-purple-50 px-3 py-1 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
