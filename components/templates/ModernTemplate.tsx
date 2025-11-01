"use client";

import { useResumeStore } from "@/lib/store";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown-renderer";

export function ModernTemplate() {
  const { resumeData } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, achievements } = resumeData;

  return (
    <div className="p-8 bg-white text-gray-900 min-h-[1056px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{renderMarkdown(personalInfo.summary)}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-3">EXPERIENCE</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-sm text-gray-700">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{exp.startDate} - {exp.endDate}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                {exp.description.map((desc, i) => (
                  <li key={i}>{renderMarkdown(desc)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-3">PROJECTS</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-700 mb-1">{project.description}</p>
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-3">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  {edu.field && <p className="text-sm text-gray-600">{edu.field}</p>}
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{edu.graduationDate}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-2">SKILLS</h2>
          {skills.technical.length > 0 && (
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-semibold">Technical:</span> {skills.technical.join(", ")}
            </p>
          )}
          {skills.soft.length > 0 && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Soft Skills:</span> {skills.soft.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-2">CERTIFICATIONS</h2>
          <ul className="list-disc list-outside ml-5 text-sm text-gray-700">
            {certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-1 mb-2">ACHIEVEMENTS</h2>
          <ul className="list-disc list-outside ml-5 text-sm text-gray-700">
            {achievements.map((achievement, idx) => (
              <li key={idx}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
