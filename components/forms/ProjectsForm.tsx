"use client";

import { useState } from "react";
import { useResumeStore, Project } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function ProjectsForm() {
  const { resumeData, addProject, deleteProject } = useResumeStore();
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    technologies: [],
    link: "",
  });
  const [techInput, setTechInput] = useState("");

  const handleAdd = () => {
    if (formData.name && formData.description) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        technologies: formData.technologies || [],
        link: formData.link,
      };
      addProject(newProject);
      setFormData({ name: "", description: "", technologies: [], link: "" });
      setTechInput("");
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Add Project</h3>
        
        <div>
          <Label htmlFor="projectName">Project Name *</Label>
          <Input
            id="projectName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="E-commerce Platform"
          />
        </div>

        <div>
          <Label htmlFor="projectDesc">Description *</Label>
          <Textarea
            id="projectDesc"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Built a full-stack e-commerce platform with..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="projectTech">Technologies</Label>
          <div className="flex gap-2">
            <Input
              id="projectTech"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTech()}
              placeholder="React, Node.js, MongoDB"
            />
            <Button type="button" onClick={handleAddTech}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.technologies?.join(", ")}
          </p>
        </div>

        <div>
          <Label htmlFor="projectLink">Link (Optional)</Label>
          <Input
            id="projectLink"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://github.com/user/project"
          />
        </div>

        <Button onClick={handleAdd} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {resumeData.projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Projects</h3>
          {resumeData.projects.map((project) => (
            <Card key={project.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {project.technologies.join(" • ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
