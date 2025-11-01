"use client";

import { useState } from "react";
import { useResumeStore, WorkExperience } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Sparkles, Edit2, X, Loader2 } from "lucide-react";
import { aiService } from "@/lib/ai-service";
import { toast } from 'sonner';

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<WorkExperience>>({
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: [""],
  });

  const handleAdd = () => {
    if (formData.company && formData.position) {
      if (editingId) {
        // Update existing experience
        updateExperience(editingId, {
          company: formData.company,
          position: formData.position,
          location: formData.location || "",
          startDate: formData.startDate || "",
          endDate: formData.current ? "Present" : formData.endDate || "",
          current: formData.current || false,
          description: formData.description?.filter(d => d.trim()) || [],
        });
        setEditingId(null);
        toast.success('Experience updated successfully! ✅');
      } else {
        // Add new experience
        const newExp: WorkExperience = {
          id: Date.now().toString(),
          company: formData.company,
          position: formData.position,
          location: formData.location || "",
          startDate: formData.startDate || "",
          endDate: formData.current ? "Present" : formData.endDate || "",
          current: formData.current || false,
          description: formData.description?.filter(d => d.trim()) || [],
        };
        addExperience(newExp);
        toast.success('Experience added successfully! 💼');
      }
      
      // Reset form
      setFormData({
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: [""],
      });
    }
  };

  const handleDelete = (id: string, company: string) => {
    console.log('🗑️  Delete button clicked');
    console.log('  Company:', company);
    console.log('  ID:', id);
    console.log('  Current experiences:', resumeData.experience.length);
    console.log('  Experience IDs:', resumeData.experience.map(e => e.id));
    
    // Direct delete for testing
    try {
      deleteExperience(id);
      console.log('✅ deleteExperience called successfully');
      
      // Check if it actually deleted
      setTimeout(() => {
        const current = useResumeStore.getState().resumeData.experience;
        console.log('  After delete, experiences:', current.length);
        console.log('  Remaining IDs:', current.map(e => e.id));
      }, 100);
      
      toast.success(`${company} deleted! 🗑️`);
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('Failed to delete experience');
    }
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate === "Present" ? "" : exp.endDate,
      current: exp.current,
      description: exp.description.length > 0 ? exp.description : [""],
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    });
  };

  const handleAddBullet = () => {
    setFormData({
      ...formData,
      description: [...(formData.description || []), ""],
    });
  };

  const handleUpdateBullet = (index: number, value: string) => {
    const newDesc = [...(formData.description || [])];
    newDesc[index] = value;
    setFormData({ ...formData, description: newDesc });
  };

  const handleRemoveBullet = (index: number) => {
    const newDesc = formData.description?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, description: newDesc });
  };

  const handleEnhanceBullet = async (index: number) => {
    const bullet = formData.description?.[index];
    const trimmedBullet = bullet?.trim() || '';
    
    if (trimmedBullet.length < 3) {
      alert('Please enter at least a few words before enhancing.');
      return;
    }
    
    if (!formData.position) {
      alert('Please enter a position/job title first.');
      return;
    }

    setEnhancingIndex(index);
    try {
      const position = formData.position || 'Professional';
      const suggestions = await aiService.improveJobDescription(trimmedBullet, position);
      if (suggestions.length > 0) {
        handleUpdateBullet(index, suggestions[0]);
      } else {
        alert('Enhancement failed. Please try again or edit manually.');
      }
    } catch (error) {
      console.error("Error enhancing bullet:", error);
      alert('Enhancement failed. Please try again or edit manually.');
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {editingId ? '✏️ Edit Work Experience' : 'Add Work Experience'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Amazon"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Seattle, WA"
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="Jan 2020"
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              placeholder="Dec 2023"
              disabled={formData.current}
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                className="mr-2"
              />
              <Label htmlFor="current" className="font-normal">Currently working here</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Responsibilities & Achievements *</Label>
          <div className="space-y-3 mt-2">
            {formData.description?.map((bullet, index) => (
              <div key={index} className="space-y-2">
                <RichTextarea
                  value={bullet}
                  onChange={(value) => {
                    const newDescription = [...(formData.description || [])];
                    newDescription[index] = value;
                    setFormData({ ...formData, description: newDescription });
                  }}
                  placeholder="Led development of feature that increased revenue by 20%"
                  rows={3}
                  className="w-full"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceBullet(index)}
                    disabled={enhancingIndex === index}
                  >
                    {enhancingIndex === index ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Enhance
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDescription = (formData.description || []).filter((_, i) => i !== index);
                      setFormData({ ...formData, description: newDescription });
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ ...formData, description: [...(formData.description || []), ''] })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bullet Point
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={handleAdd} className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? 'Update Experience' : 'Add Experience'}
          </Button>
          {editingId && (
            <Button type="button" onClick={handleCancelEdit} variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Existing Experience */}
      {resumeData.experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Experience</h3>
          {resumeData.experience.map((exp) => (
            <Card key={exp.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.endDate} • {exp.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(exp)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exp.id, exp.company)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ul className="mt-2 text-sm space-y-1">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-muted-foreground">• {desc}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
