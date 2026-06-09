import type { Task } from '@/types';

export const todayTasks: Task[] = [
  {
    id: 't1',
    title: '早班值勤',
    description: '负责东门区域巡逻，每小时巡视一次',
    time: '08:00 - 12:00',
    status: 'progress',
    type: 'duty',
    location: '东门岗亭'
  },
  {
    id: 't2',
    title: '消防器材巡检',
    description: '检查1-3层灭火器、消火栓状态',
    time: '09:00 - 10:30',
    status: 'pending',
    type: 'inspection',
    location: '1-3层公共区域'
  },
  {
    id: 't3',
    title: '消防知识培训',
    description: '参加本月消防知识培训及考核',
    time: '14:00 - 16:00',
    status: 'pending',
    type: 'training',
    location: '会议室A'
  },
  {
    id: 't4',
    title: '午间巡逻',
    description: '重点巡查餐饮区域、配电房',
    time: '12:00 - 13:00',
    status: 'urgent',
    type: 'patrol',
    location: '餐饮区/配电房'
  },
  {
    id: 't5',
    title: '晚班交接',
    description: '与晚班人员完成交接记录',
    time: '17:30 - 18:00',
    status: 'pending',
    type: 'duty',
    location: '消防值班室'
  },
  {
    id: 't6',
    title: '昨日隐患整改复查',
    description: '复查负一层消防通道堵塞整改情况',
    time: '10:30 - 11:00',
    status: 'completed',
    type: 'inspection',
    location: '负一层'
  }
];

export const dutySchedule = [
  { day: '周一', shift: '早班', time: '08:00-16:00', status: 'completed' },
  { day: '周二', shift: '晚班', time: '16:00-24:00', status: 'completed' },
  { day: '周三', shift: '休息', time: '-', status: 'rest' },
  { day: '周四', shift: '早班', time: '08:00-16:00', status: 'progress' },
  { day: '周五', shift: '中班', time: '12:00-20:00', status: 'pending' },
  { day: '周六', shift: '全天', time: '08:00-20:00', status: 'pending' },
  { day: '周日', shift: '休息', time: '-', status: 'rest' }
];
