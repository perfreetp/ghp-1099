export interface Task {
  id: string;
  title: string;
  description: string;
  time: string;
  status: 'pending' | 'progress' | 'completed' | 'urgent';
  type: 'patrol' | 'inspection' | 'training' | 'duty';
  location?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'hydrant' | 'extinguisher' | 'hose' | 'axe' | 'mask';
  location: string;
  floor: string;
  status: 'normal' | 'maintenance' | 'expired';
  lat?: number;
  lng?: number;
  distance?: string;
  lastCheckDate?: string;
  expireDate?: string;
}

export interface InspectionItem {
  id: string;
  name: string;
  category: 'hose' | 'extinguisher' | 'hydrant' | 'other';
  items: CheckPoint[];
  location: string;
  status: 'pending' | 'completed' | 'abnormal';
}

export interface CheckPoint {
  id: string;
  title: string;
  checked: boolean;
  abnormal: boolean;
  remark?: string;
  photoUrl?: string;
}

export interface Incident {
  id: string;
  title: string;
  level: 'minor' | 'general' | 'major' | 'critical';
  location: string;
  reportTime: string;
  dispatchTime?: string;
  arriveTime?: string;
  resolveTime?: string;
  status: 'reporting' | 'dispatched' | 'handling' | 'resolved';
  description?: string;
  result?: string;
  reporter: string;
  photos?: string[];
}

export interface LearningItem {
  id: string;
  type: 'plan' | 'quiz' | 'drill';
  title: string;
  description: string;
  status: 'unread' | 'in_progress' | 'completed';
  deadline?: string;
  score?: number;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  station: string;
  role: string;
  phone: string;
  totalDutyHours: number;
  monthlyDutyHours: number;
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  name: string;
  expireDate: string;
  daysLeft: number;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'on' | 'off' | 'busy';
}

export interface EmergencyPlan {
  id: string;
  title: string;
  category: string;
  steps: string[];
  updateTime: string;
}
