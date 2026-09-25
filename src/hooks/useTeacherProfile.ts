import { useCallback, useEffect, useState } from 'react';

export interface TeacherProfile {
  id: string;
  profileLabel: string;
  teacherName: string;
  schoolName: string;
  standard: string;
  division: string;
  subject: string;
  remarks: string;
  photo: string;
}

const STORAGE_KEY_PROFILES = 'question-paper-studio-teacher-profiles';
const STORAGE_KEY_ACTIVE_ID = 'question-paper-studio-active-profile-id';
const STORAGE_KEY_LEGACY = 'question-paper-studio-teacher-profile';
const LEGACY_STORAGE_KEY_OLD = 'edupaper-teacher-profile';
const PROFILE_CHANGE_EVENT = 'smart-paper:profile-change';

export const emptyTeacherProfile: TeacherProfile = {
  id: 'default',
  profileLabel: 'Default Profile',
  teacherName: '',
  schoolName: '',
  standard: '',
  division: '',
  subject: '',
  remarks: '',
  photo: '',
};

export const generateProfileId = () => `prof_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

export const createNewProfile = (label?: string): TeacherProfile => ({
  id: generateProfileId(),
  profileLabel: label || 'New Profile',
  teacherName: '',
  schoolName: '',
  standard: '',
  division: '',
  subject: '',
  remarks: '',
  photo: '',
});

interface ProfilesState {
  profiles: TeacherProfile[];
  activeProfileId: string;
}

const readProfilesState = (): ProfilesState => {
  if (typeof window === 'undefined') {
    return { profiles: [emptyTeacherProfile], activeProfileId: emptyTeacherProfile.id };
  }

  try {
    const savedProfilesJson = window.localStorage.getItem(STORAGE_KEY_PROFILES);
    let parsedProfiles: TeacherProfile[] = [];

    if (savedProfilesJson) {
      const parsed = JSON.parse(savedProfilesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedProfiles = parsed.map((item, idx) => ({
          ...emptyTeacherProfile,
          ...item,
          id: item.id || `prof_${Date.now()}_${idx}`,
          profileLabel:
            item.profileLabel ||
            (item.teacherName
              ? `${item.teacherName}${item.subject ? ` (${item.subject})` : ''}`
              : `Profile ${idx + 1}`),
        }));
      }
    }

    // Fallback: check legacy single profile
    if (parsedProfiles.length === 0) {
      const savedLegacy =
        window.localStorage.getItem(STORAGE_KEY_LEGACY) ||
        window.localStorage.getItem(LEGACY_STORAGE_KEY_OLD);

      if (savedLegacy) {
        try {
          const parsed = JSON.parse(savedLegacy);
          if (parsed && typeof parsed === 'object') {
            const hasData = Object.values(parsed).some(
              (val) => typeof val === 'string' && val.trim().length > 0
            );
            if (hasData) {
              const legacyProfile: TeacherProfile = {
                ...emptyTeacherProfile,
                ...parsed,
                id: parsed.id || 'prof_primary',
                profileLabel:
                  parsed.profileLabel ||
                  (parsed.teacherName
                    ? `${parsed.teacherName}${parsed.subject ? ` (${parsed.subject})` : ''}`
                    : 'Primary Profile'),
              };
              parsedProfiles = [legacyProfile];
            }
          }
        } catch {
          // ignore error
        }
      }
    }

    if (parsedProfiles.length === 0) {
      parsedProfiles = [
        {
          ...emptyTeacherProfile,
          id: 'prof_default',
          profileLabel: 'My Profile',
        },
      ];
    }

    let activeId = window.localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || '';
    if (!parsedProfiles.some((p) => p.id === activeId)) {
      activeId = parsedProfiles[0].id;
    }

    return { profiles: parsedProfiles, activeProfileId: activeId };
  } catch {
    return { profiles: [emptyTeacherProfile], activeProfileId: emptyTeacherProfile.id };
  }
};

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT));
  }
};

const persistState = (profiles: TeacherProfile[], activeProfileId: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    window.localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeProfileId);

    const active = profiles.find((p) => p.id === activeProfileId) || profiles[0] || emptyTeacherProfile;
    window.localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(active));
    notifyChange();
  } catch {
    // ignore
  }
};

export const useTeacherProfile = () => {
  const [state, setState] = useState<ProfilesState>(readProfilesState);

  useEffect(() => {
    const handleSync = () => {
      setState(readProfilesState());
    };
    window.addEventListener(PROFILE_CHANGE_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(PROFILE_CHANGE_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const activeProfile: TeacherProfile =
    state.profiles.find((p) => p.id === state.activeProfileId) ||
    state.profiles[0] ||
    emptyTeacherProfile;

  const setActiveProfileId = useCallback((id: string) => {
    setState((prev) => {
      if (prev.activeProfileId === id) return prev;
      const target = prev.profiles.find((p) => p.id === id);
      if (!target) return prev;
      persistState(prev.profiles, id);
      return { ...prev, activeProfileId: id };
    });
  }, []);

  const addProfile = useCallback(
    (profileData?: Partial<TeacherProfile>, setAsActive = true): TeacherProfile => {
      const newProfile: TeacherProfile = {
        ...emptyTeacherProfile,
        ...profileData,
        id: profileData?.id || generateProfileId(),
        profileLabel:
          profileData?.profileLabel?.trim() ||
          (profileData?.teacherName?.trim()
            ? `${profileData.teacherName.trim()}${profileData.subject ? ` (${profileData.subject})` : ''}`
            : `Profile ${state.profiles.length + 1}`),
      };

      const nextProfiles = [...state.profiles, newProfile];
      const nextActiveId = setAsActive ? newProfile.id : state.activeProfileId;

      persistState(nextProfiles, nextActiveId);
      setState({ profiles: nextProfiles, activeProfileId: nextActiveId });
      return newProfile;
    },
    [state.profiles, state.activeProfileId]
  );

  const updateProfile = useCallback((id: string, updated: Partial<TeacherProfile>) => {
    setState((prev) => {
      const nextProfiles = prev.profiles.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      );
      persistState(nextProfiles, prev.activeProfileId);
      return { ...prev, profiles: nextProfiles };
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState((prev) => {
      const nextProfiles = prev.profiles.filter((p) => p.id !== id);
      let nextActiveId = prev.activeProfileId;

      if (nextProfiles.length === 0) {
        const fresh: TeacherProfile = {
          ...emptyTeacherProfile,
          id: generateProfileId(),
          profileLabel: 'My Profile',
        };
        nextProfiles.push(fresh);
        nextActiveId = fresh.id;
      } else if (prev.activeProfileId === id) {
        nextActiveId = nextProfiles[0].id;
      }

      persistState(nextProfiles, nextActiveId);
      return { profiles: nextProfiles, activeProfileId: nextActiveId };
    });
  }, []);

  const duplicateProfile = useCallback(
    (id: string): TeacherProfile | undefined => {
      const target = state.profiles.find((p) => p.id === id);
      if (!target) return undefined;

      const copy: TeacherProfile = {
        ...target,
        id: generateProfileId(),
        profileLabel: `${target.profileLabel || target.teacherName || 'Profile'} (Copy)`,
      };

      const nextProfiles = [...state.profiles, copy];
      persistState(nextProfiles, copy.id);
      setState({ profiles: nextProfiles, activeProfileId: copy.id });
      return copy;
    },
    [state.profiles]
  );

  const saveProfile = useCallback((nextProfile: TeacherProfile) => {
    setState((prev) => {
      const index = prev.profiles.findIndex((p) => p.id === nextProfile.id);
      let nextProfiles: TeacherProfile[];

      if (index >= 0) {
        nextProfiles = prev.profiles.map((p) =>
          p.id === nextProfile.id ? { ...p, ...nextProfile } : p
        );
      } else {
        nextProfiles = prev.profiles.map((p) =>
          p.id === prev.activeProfileId ? { ...p, ...nextProfile, id: p.id } : p
        );
      }

      persistState(nextProfiles, prev.activeProfileId);
      return { ...prev, profiles: nextProfiles };
    });
  }, []);

  return {
    profile: activeProfile,
    profiles: state.profiles,
    activeProfileId: state.activeProfileId,
    setActiveProfileId,
    addProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    saveProfile,
  };
};