# 🔄 Migration Guide: Zustand → Redux Saga

## Overview
Your resume builder has been upgraded from Zustand to Redux Saga with cloud storage!

---

## ⚠️ Breaking Changes

### 1. **Import Changes**

**OLD (Zustand):**
```typescript
import { useResumeStore } from '@/lib/store';
```

**NEW (Redux):**
```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updatePersonalInfo, addExperience } from '@/lib/redux/resumeSlice';
```

### 2. **Usage Pattern Changes**

**OLD:**
```typescript
const { resumeData, updatePersonalInfo, addExperience } = useResumeStore();

// Update
updatePersonalInfo({ fullName: 'John' });
```

**NEW:**
```typescript
const resumeData = useAppSelector((state) => state.resume);
const dispatch = useAppDispatch();

// Update
dispatch(updatePersonalInfo({ fullName: 'John' }));
```

---

## 📝 Component Migration Examples

### **PersonalInfoForm.tsx**

**OLD:**
```typescript
import { useResumeStore } from "@/lib/store";

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;

  return (
    <Input
      value={personalInfo.fullName}
      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
    />
  );
}
```

**NEW:**
```typescript
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { updatePersonalInfo } from '@/lib/redux/resumeSlice';

export function PersonalInfoForm() {
  const personalInfo = useAppSelector((state) => state.resume.personalInfo);
  const dispatch = useAppDispatch();

  return (
    <Input
      value={personalInfo.fullName}
      onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
    />
  );
}
```

### **ExperienceForm.tsx**

**OLD:**
```typescript
const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeStore();

const handleAdd = () => {
  addExperience(newExp);
};
```

**NEW:**
```typescript
const experience = useAppSelector((state) => state.resume.experience);
const dispatch = useAppDispatch();

const handleAdd = () => {
  dispatch(addExperience(newExp));
};
```

### **TemplateSelector.tsx**

**OLD:**
```typescript
const { selectedTemplate, setTemplate } = useResumeStore();

<button onClick={() => setTemplate('modern')}>Modern</button>
```

**NEW:**
```typescript
const selectedTemplate = useAppSelector((state) => state.resume.selectedTemplate);
const dispatch = useAppDispatch();

<button onClick={() => dispatch(setTemplate('modern'))}>Modern</button>
```

---

## 🔑 Complete Action Reference

### **All Available Actions:**

```typescript
// Personal Info
dispatch(updatePersonalInfo({ fullName: 'John', email: 'john@example.com' }))

// Experience
dispatch(addExperience(experience))
dispatch(updateExperience({ id: '1', data: { position: 'New Title' } }))
dispatch(deleteExperience('1'))

// Education
dispatch(addEducation(education))
dispatch(updateEducation({ id: '1', data: { degree: 'Masters' } }))
dispatch(deleteEducation('1'))

// Skills
dispatch(updateSkills({ technical: ['React', 'Node'] }))

// Projects
dispatch(addProject(project))
dispatch(updateProject({ id: '1', data: { name: 'New Name' } }))
dispatch(deleteProject('1'))

// Certifications & Achievements
dispatch(updateCertifications(['AWS Certified']))
dispatch(updateAchievements(['Award Winner']))

// Template
dispatch(setTemplate('modern'))

// Bulk Operations
dispatch(loadResumeData(fullResumeData))
dispatch(resetResumeData())
dispatch(populateFromAI(aiParsedData))

// Storage
dispatch(autoSave())        // Auto-triggered
dispatch(saveToCloud())     // Manual save
```

---

## ✅ Migration Checklist

### Phase 1: Update Imports
- [ ] Replace `@/lib/store` with `@/lib/redux/hooks`
- [ ] Import specific actions from `@/lib/redux/resumeSlice`
- [ ] Import auth actions from `@/lib/redux/authSlice` if needed

### Phase 2: Update Component Logic
- [ ] Replace `useResumeStore()` with `useAppSelector()` and `useAppDispatch()`
- [ ] Wrap all state updates with `dispatch()`
- [ ] Update selectors to use `state.resume.property`

### Phase 3: Test Functionality
- [ ] Test personal info updates
- [ ] Test adding/editing/deleting experience
- [ ] Test adding/editing/deleting education
- [ ] Test adding/editing/deleting projects
- [ ] Test template switching
- [ ] Test AI features
- [ ] Test PDF export

### Phase 4: Add New Features
- [ ] Add Google Auth button to header
- [ ] Add Auto-Save indicator
- [ ] Test Google login
- [ ] Verify cloud save works
- [ ] Test resume loading from cloud

---

## 🆕 New Features Available

### 1. **Google Authentication**
```typescript
import { GoogleAuthButton } from '@/components/GoogleAuthButton';

// In your component
<GoogleAuthButton />
```

### 2. **Auto-Save Indicator**
```typescript
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';

// In your header
<AutoSaveIndicator />
```

### 3. **Auth State Access**
```typescript
const { user, isAuthenticated } = useAppSelector((state) => state.auth);

if (isAuthenticated) {
  console.log(`Welcome ${user.name}!`);
}
```

---

## 🐛 Common Issues & Fixes

### **Issue: "Cannot read property 'resume' of undefined"**
**Fix:** Make sure Redux Provider is wrapped around your app in `app/layout.tsx`

### **Issue: "dispatch is not a function"**
**Fix:** Use `useAppDispatch()` instead of `useDispatch()`

### **Issue: "Action was not dispatched"**
**Fix:** Wrap action in `dispatch()`: `dispatch(updatePersonalInfo({...}))`

### **Issue: "State not updating"**
**Fix:** Make sure you're selecting state correctly:
```typescript
// ✅ Correct
const data = useAppSelector((state) => state.resume)

// ❌ Wrong
const data = useAppSelector((state) => state)
```

---

## 📦 File Structure

```
lib/
├── redux/
│   ├── store.ts              # Redux store configuration
│   ├── hooks.ts              # Typed Redux hooks
│   ├── resumeSlice.ts        # Resume state & actions
│   ├── authSlice.ts          # Auth state & actions
│   └── sagas/
│       ├── index.ts          # Root saga
│       ├── resumeSaga.ts     # Auto-save & cloud sync
│       └── authSaga.ts       # Google login handling
```

---

## 🎓 Learning Resources

- **Redux Toolkit**: https://redux-toolkit.js.org/
- **Redux Saga**: https://redux-saga.js.org/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2

---

## 💡 Best Practices

1. **Always use typed hooks**: `useAppSelector` and `useAppDispatch`
2. **Select only what you need**: `state.resume.personalInfo` not `state.resume`
3. **Dispatch actions, don't mutate**: Always use `dispatch(action())`
4. **Use auto-save**: It's automatic, but you can trigger manual saves
5. **Login for cloud**: Encourage users to login for cloud backup

---

## ✨ Benefits of Migration

✅ **Better Performance** - Optimized re-renders  
✅ **Type Safety** - Full TypeScript support  
✅ **DevTools** - Redux DevTools Extension  
✅ **Side Effects** - Clean saga handling  
✅ **Cloud Storage** - Google Drive integration  
✅ **Auto-Save** - Never lose data  
✅ **Scalability** - Easy to add features  

Your resume builder is now production-ready! 🚀
