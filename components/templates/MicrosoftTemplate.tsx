"use client";

import { useResumeStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function MicrosoftTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;

  return (
    <div className="p-8 bg-white text-gray-900 min-h-[1056px]" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Header with blue accent */}
      <div className="border-b-4 border-blue-600 pb-4 mb-6">
        <h1 className="text-4xl font-light text-gray-900 mb-2">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="text-blue-600">in/{personalInfo.linkedin.split('/').pop()}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{renderMarkdown(personalInfo.summary)}</p>
        </div>
      )}

      {/* Technical Skills - Highlighted */}
      {skills.technical.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 uppercase tracking-wide">Core Competencies</h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.technical.map((skill, idx) => (
              <div key={idx} className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 uppercase tracking-wide">Professional Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-sm font-medium text-gray-600">{exp.company} | {exp.location}</p>
                </div>
                <span className="text-sm text-gray-500">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc list-outside ml-5 text-sm text-gray-700 space-y-1 mt-2">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-sm text-gray-700">{renderMarkdown(desc)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 uppercase tracking-wide">Key Projects</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
              <p className="text-sm text-gray-700 mt-0.5">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 uppercase tracking-wide">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2 uppercase tracking-wide">Certifications</h2>
          <div className="grid grid-cols-2 gap-2">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-sm text-gray-700">✓ {cert}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
