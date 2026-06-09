import type { Incident, Member } from '@/types';

export const incidentList: Incident[] = [
  {
    id: 'inc1',
    title: '餐饮区垃圾桶冒烟',
    level: 'minor',
    location: '2层餐饮区东侧',
    reportTime: '2026-06-09 14:32:00',
    dispatchTime: '2026-06-09 14:32:45',
    arriveTime: '2026-06-09 14:34:20',
    resolveTime: '2026-06-09 14:38:10',
    status: 'resolved',
    description: '餐饮区员工丢弃烟蒂未熄灭引燃垃圾桶内纸屑',
    result: '使用灭火器扑灭，无人员伤亡，无财产损失，已对员工进行消防安全教育',
    reporter: '李明'
  },
  {
    id: 'inc2',
    title: '负一层烟雾报警',
    level: 'general',
    location: '负一层B区',
    reportTime: '2026-06-10 09:15:00',
    dispatchTime: '2026-06-10 09:15:30',
    arriveTime: '2026-06-10 09:17:00',
    status: 'handling',
    description: '消防控制中心收到负一层烟雾报警信号',
    reporter: '消防控制室'
  },
  {
    id: 'inc3',
    title: '3层电器短路起火',
    level: 'major',
    location: '3层305办公室',
    reportTime: '2026-06-10 10:45:00',
    status: 'reporting',
    description: '办公室打印机短路冒烟，有少量明火',
    reporter: '王芳'
  }
];

export const levelConfig = {
  minor: { label: '一般', color: '#F59E0B', bgColor: '#FEF3C7' },
  general: { label: '较大', color: '#F97316', bgColor: '#FFEDD5' },
  major: { label: '重大', color: '#EF4444', bgColor: '#FEE2E2' },
  critical: { label: '特别重大', color: '#991B1B', bgColor: '#FECACA' }
};

export const statusConfig = {
  reporting: { label: '待出动', color: '#F59E0B' },
  dispatched: { label: '已出动', color: '#3B82F6' },
  handling: { label: '处置中', color: '#8B5CF6' },
  resolved: { label: '已处置', color: '#22C55E' }
};

export const stationMembers: Member[] = [
  { id: 'm1', name: '张建国', role: '站长', phone: '138****1234', status: 'on' },
  { id: 'm2', name: '李明', role: '副站长', phone: '139****5678', status: 'on' },
  { id: 'm3', name: '王芳', role: '值勤员', phone: '137****9012', status: 'on' },
  { id: 'm4', name: '陈伟', role: '值勤员', phone: '136****3456', status: 'busy' },
  { id: 'm5', name: '刘洋', role: '值勤员', phone: '135****7890', status: 'on' },
  { id: 'm6', name: '赵丽', role: '宣传员', phone: '134****2345', status: 'off' }
];
