import { create } from 'zustand';
import { inspectionTemplates } from '@/data/inspection';
import type { InspectionItem, CheckPoint } from '@/types';

export interface VoiceRecord {
  id: string;
  duration: number;
  size: string;
  createdAt: string;
  url?: string;
}

export interface CheckItemState extends CheckPoint {
  photos: string[];
  voice?: VoiceRecord;
}

export interface InspectionState extends Omit<InspectionItem, 'items'> {
  items: CheckItemState[];
  isDraft: boolean;
  updatedAt?: string;
  submittedAt?: string;
  abnormalCount: number;
  photoCount: number;
  voiceCount: number;
}

interface InspectionStore {
  inspections: Record<string, InspectionState>;
  initAll: () => void;
  getInspection: (id: string) => InspectionState | undefined;
  getAllInspections: () => InspectionItem[];
  updateCheckItem: (inspId: string, itemId: string, patch: Partial<CheckItemState>) => void;
  saveDraft: (inspId: string, state?: Partial<InspectionState>) => void;
  submitInspection: (inspId: string) => void;
  getPendingCount: () => number;
  getAbnormalCount: () => number;
  getProgress: () => { checked: number; total: number; percent: number };
  addPhoto: (inspId: string, itemId: string, photo: string) => void;
  removePhoto: (inspId: string, itemId: string, idx: number) => void;
  setVoice: (inspId: string, itemId: string, voice: VoiceRecord) => void;
  addRemark: (inspId: string, itemId: string, remark: string) => void;
}

const convertToState = (tpl: InspectionItem): InspectionState => {
  const checkedItems = tpl.items.filter(i => i.checked || i.abnormal).length;
  const status = checkedItems === 0 ? 'pending' : tpl.status;
  return {
    ...tpl,
    status,
    items: tpl.items.map(i => ({ ...i, photos: [] })),
    isDraft: false,
    abnormalCount: 0,
    photoCount: 0,
    voiceCount: 0
  };
};

const createInitial = (): Record<string, InspectionState> => {
  const map: Record<string, InspectionState> = {};
  inspectionTemplates.forEach(tpl => {
    map[tpl.id] = convertToState(tpl);
  });
  return map;
};

export const useInspectionStore = create<InspectionStore>((set, get) => ({
  inspections: createInitial(),

  initAll: () => set({ inspections: createInitial() }),

  getInspection: (id) => get().inspections[id],

  getAllInspections: () => {
    const map = get().inspections;
    return Object.values(map).map(insp => {
      const checkedItems = insp.items.filter(i => i.checked || i.abnormal).length;
      const abnormalItems = insp.items.filter(i => i.abnormal).length;
      const photoCount = insp.items.reduce((acc, it) => acc + it.photos.length, 0);
      const voiceCount = insp.items.filter(i => !!i.voice).length;
      let status: InspectionItem['status'] = insp.status;
      if (checkedItems === insp.items.length) {
        status = abnormalItems > 0 ? 'abnormal' : 'completed';
      } else if (checkedItems > 0) {
        status = abnormalItems > 0 ? 'abnormal' : 'pending';
      } else {
        status = 'pending';
      }
      return {
        id: insp.id,
        name: insp.name,
        category: insp.category,
        location: insp.location,
        status,
        items: insp.items.map(i => ({
          id: i.id,
          title: i.title,
          checked: i.checked,
          abnormal: i.abnormal,
          remark: i.remark,
          photoUrl: i.photos[0]
        })),
        abnormalCount: abnormalItems,
        photoCount,
        voiceCount,
        progress: insp.items.length > 0 ? Math.round((checkedItems / insp.items.length) * 100) : 0
      } as InspectionItem & {
        abnormalCount: number;
        photoCount: number;
        voiceCount: number;
        progress: number;
      };
    });
  },

  updateCheckItem: (inspId, itemId, patch) => {
    set(state => {
      const insp = state.inspections[inspId];
      if (!insp) return state;
      const newItems = insp.items.map(it =>
        it.id === itemId ? { ...it, ...patch } : it
      );
      const abnormalCount = newItems.filter(i => i.abnormal).length;
      const photoCount = newItems.reduce((acc, it) => acc + it.photos.length, 0);
      const voiceCount = newItems.filter(i => !!i.voice).length;
      return {
        inspections: {
          ...state.inspections,
          [inspId]: {
            ...insp,
            items: newItems,
            isDraft: true,
            updatedAt: new Date().toISOString(),
            abnormalCount,
            photoCount,
            voiceCount
          }
        }
      };
    });
  },

  saveDraft: (inspId, extra) => {
    set(state => {
      const insp = state.inspections[inspId];
      if (!insp) return state;
      return {
        inspections: {
          ...state.inspections,
          [inspId]: {
            ...insp,
            ...extra,
            isDraft: true,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  },

  submitInspection: (inspId) => {
    set(state => {
      const insp = state.inspections[inspId];
      if (!insp) return state;
      const abnormalCount = insp.items.filter(i => i.abnormal).length;
      const status = abnormalCount > 0 ? 'abnormal' : 'completed';
      return {
        inspections: {
          ...state.inspections,
          [inspId]: {
            ...insp,
            status,
            isDraft: false,
            submittedAt: new Date().toISOString()
          }
        }
      };
    });
  },

  getPendingCount: () => {
    const list = get().getAllInspections();
    return list.filter(i => i.status === 'pending').length;
  },

  getAbnormalCount: () => {
    const list = get().getAllInspections();
    return list.filter(i => i.status === 'abnormal').length;
  },

  getProgress: () => {
    const map = get().inspections;
    let checked = 0;
    let total = 0;
    Object.values(map).forEach(insp => {
      total += insp.items.length;
      checked += insp.items.filter(i => i.checked || i.abnormal).length;
    });
    return { checked, total, percent: total > 0 ? Math.round((checked / total) * 100) : 0 };
  },

  addPhoto: (inspId, itemId, photo) => {
    const state = get();
    const insp = state.inspections[inspId];
    if (!insp) return;
    const item = insp.items.find(i => i.id === itemId);
    if (!item || item.photos.length >= 3) return;
    state.updateCheckItem(inspId, itemId, { photos: [...item.photos, photo] });
  },

  removePhoto: (inspId, itemId, idx) => {
    const state = get();
    const insp = state.inspections[inspId];
    if (!insp) return;
    const item = insp.items.find(i => i.id === itemId);
    if (!item) return;
    state.updateCheckItem(inspId, itemId, {
      photos: item.photos.filter((_, i) => i !== idx)
    });
  },

  setVoice: (inspId, itemId, voice) => {
    const state = get();
    state.updateCheckItem(inspId, itemId, { voice, abnormal: true });
  },

  addRemark: (inspId, itemId, remark) => {
    const state = get();
    state.updateCheckItem(inspId, itemId, { remark, abnormal: true });
  }
}));
