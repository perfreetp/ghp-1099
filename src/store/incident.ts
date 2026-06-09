import { create } from 'zustand';
import { incidentList } from '@/data/incidents';
import type { Incident } from '@/types';

export interface VoiceRecord {
  id: string;
  duration: number;
  size: string;
  createdAt: string;
  url?: string;
}

export interface IncidentExtended extends Omit<Incident, 'photos'> {
  photos: string[];
  voice?: VoiceRecord;
  notifiedMemberIds: string[];
  resultNote?: string;
  handler?: string;
}

interface IncidentStore {
  incidents: IncidentExtended[];
  addIncident: (data: Partial<IncidentExtended> & {
    location: string;
    level: IncidentExtended['level'];
    description?: string;
    photos?: string[];
    notifiedMemberIds?: string[];
    voice?: VoiceRecord;
  }) => IncidentExtended;
  updateIncident: (id: string, patch: Partial<IncidentExtended>) => void;
  getAll: (status?: string) => IncidentExtended[];
  getById: (id: string) => IncidentExtended | undefined;
  recordDispatch: (id: string) => void;
  recordArrive: (id: string) => void;
  recordResolve: (id: string, result: string, handler?: string) => void;
  getPendingCount: () => number;
  getHandlingCount: () => number;
  getTodayCount: () => number;
  getResolvedCount: () => number;
}

const formatTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const extendInitial = (list: Incident[]): IncidentExtended[] => {
  return list.map(inc => ({
    ...inc,
    photos: inc.photos || [],
    notifiedMemberIds: []
  }));
};

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: extendInitial(incidentList),

  addIncident: (data) => {
    const now = new Date();
    const id = `inc_${now.getTime()}`;
    const newItem: IncidentExtended = {
      id,
      title: data.level === 'critical' ? '特别重大火情' :
             data.level === 'major' ? '重大火情' :
             data.level === 'general' ? '较大火情' : '一般火情',
      level: data.level,
      location: data.location,
      reportTime: formatTime(now),
      status: 'reporting',
      description: data.description || '',
      reporter: '李明',
      photos: data.photos || [],
      notifiedMemberIds: data.notifiedMemberIds || [],
      voice: data.voice
    };
    set(state => ({
      incidents: [newItem, ...state.incidents]
    }));
    return newItem;
  },

  updateIncident: (id, patch) => {
    set(state => ({
      incidents: state.incidents.map(inc =>
        inc.id === id ? { ...inc, ...patch } : inc
      )
    }));
  },

  getAll: (status) => {
    const list = get().incidents;
    if (!status || status === 'all') return list;
    return list.filter(i => i.status === status);
  },

  getById: (id) => get().incidents.find(i => i.id === id),

  recordDispatch: (id) => {
    const now = new Date();
    get().updateIncident(id, {
      status: 'dispatched',
      dispatchTime: formatTime(now)
    });
  },

  recordArrive: (id) => {
    const now = new Date();
    get().updateIncident(id, {
      status: 'handling',
      arriveTime: formatTime(now)
    });
  },

  recordResolve: (id, result, handler) => {
    const now = new Date();
    get().updateIncident(id, {
      status: 'resolved',
      resolveTime: formatTime(now),
      result,
      resultNote: result,
      handler: handler || '李明'
    });
  },

  getPendingCount: () => get().incidents.filter(i => i.status === 'reporting').length,

  getHandlingCount: () => get().incidents.filter(i => i.status === 'dispatched' || i.status === 'handling').length,

  getTodayCount: () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const fmt = formatTime(new Date()).slice(0, 10);
    return get().incidents.filter(i => i.reportTime.startsWith(fmt)).length;
  },

  getResolvedCount: () => get().incidents.filter(i => i.status === 'resolved').length
}));
