import type { Equipment } from '@/types';

export const equipmentList: Equipment[] = [
  {
    id: 'e1',
    name: '室内消火栓 #001',
    type: 'hydrant',
    location: '1层大厅东侧',
    floor: '1F',
    status: 'normal',
    distance: '50m',
    lastCheckDate: '2026-06-05',
    expireDate: '2028-03-15'
  },
  {
    id: 'e2',
    name: '干粉灭火器 MFZ/ABC4',
    type: 'extinguisher',
    location: '1层电梯口',
    floor: '1F',
    status: 'normal',
    distance: '32m',
    lastCheckDate: '2026-06-08',
    expireDate: '2027-11-20'
  },
  {
    id: 'e3',
    name: '消防水带 8-65-25',
    type: 'hose',
    location: '1层消防柜',
    floor: '1F',
    status: 'normal',
    distance: '55m',
    lastCheckDate: '2026-06-01'
  },
  {
    id: 'e4',
    name: '室内消火栓 #002',
    type: 'hydrant',
    location: '2层走廊西端',
    floor: '2F',
    status: 'normal',
    distance: '120m',
    lastCheckDate: '2026-06-03',
    expireDate: '2028-05-10'
  },
  {
    id: 'e5',
    name: '干粉灭火器 MFZ/ABC4',
    type: 'extinguisher',
    location: '2层办公室门口',
    floor: '2F',
    status: 'maintenance',
    distance: '135m',
    lastCheckDate: '2026-05-28',
    expireDate: '2027-08-14'
  },
  {
    id: 'e6',
    name: '室内消火栓 #003',
    type: 'hydrant',
    location: '3层楼梯口',
    floor: '3F',
    status: 'normal',
    distance: '210m',
    lastCheckDate: '2026-06-06',
    expireDate: '2028-01-30'
  },
  {
    id: 'e7',
    name: '二氧化碳灭火器 MT/3',
    type: 'extinguisher',
    location: '3层配电房门口',
    floor: '3F',
    status: 'expired',
    distance: '225m',
    lastCheckDate: '2026-05-20',
    expireDate: '2026-06-01'
  },
  {
    id: 'e8',
    name: '消防斧',
    type: 'axe',
    location: '1层消防柜',
    floor: '1F',
    status: 'normal',
    distance: '58m',
    lastCheckDate: '2026-06-02'
  },
  {
    id: 'e9',
    name: '过滤式消防面具',
    type: 'mask',
    location: '每层走廊两端',
    floor: '1-3F',
    status: 'normal',
    distance: '多位置',
    lastCheckDate: '2026-06-04',
    expireDate: '2029-12-01'
  },
  {
    id: 'e10',
    name: '室内消火栓 #004',
    type: 'hydrant',
    location: '负一层车库入口',
    floor: 'B1',
    status: 'normal',
    distance: '180m',
    lastCheckDate: '2026-06-07',
    expireDate: '2027-10-25'
  }
];

export const nearbyHydrants = [
  { id: 'h1', name: '最近消火栓', location: '1层大厅东侧', distance: '50m', floor: '1F' },
  { id: 'h2', name: '第二近消火栓', location: '1层北门', distance: '78m', floor: '1F' },
  { id: 'h3', name: '备用消火栓', location: '2层走廊西端', distance: '120m', floor: '2F' }
];

export const equipmentTypeLabels: Record<string, string> = {
  hydrant: '消火栓',
  extinguisher: '灭火器',
  hose: '消防水带',
  axe: '消防斧',
  mask: '防毒面具'
};
