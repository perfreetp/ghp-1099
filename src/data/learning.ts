import type { LearningItem, Quiz, EmergencyPlan } from '@/types';

export const learningList: LearningItem[] = [
  {
    id: 'l1',
    type: 'plan',
    title: '商场火灾应急预案',
    description: '包含报警、疏散、扑救、联络全流程',
    status: 'unread',
    updateTime: '2026-06-01'
  },
  {
    id: 'l2',
    type: 'quiz',
    title: '每日知识问答（6月10日）',
    description: '5道消防安全知识题，答题积分',
    status: 'unread',
    deadline: '今日 23:59'
  },
  {
    id: 'l3',
    type: 'drill',
    title: '本月消防演练签到',
    description: '6月15日 14:00 东广场集合',
    status: 'unread',
    deadline: '2026-06-15 14:00'
  },
  {
    id: 'l4',
    type: 'plan',
    title: '高层建筑疏散预案',
    description: '针对3层以上楼层的紧急疏散流程',
    status: 'in_progress',
    updateTime: '2026-05-28'
  },
  {
    id: 'l5',
    type: 'quiz',
    title: '灭火器使用专项测试',
    description: '10道关于灭火器使用的测试题',
    status: 'completed',
    score: 90
  },
  {
    id: 'l6',
    type: 'plan',
    title: '危险品泄漏处置预案',
    description: '化学品、燃气等泄漏的应急处理',
    status: 'unread',
    updateTime: '2026-06-05'
  }
];

export const dailyQuizzes: Quiz[] = [
  {
    id: 'q1',
    question: '使用灭火器扑救火灾时，应该对准火焰的哪个部位喷射？',
    options: ['上部', '中部', '根部', '任意部位'],
    answer: 2
  },
  {
    id: 'q2',
    question: '火灾中造成人员伤亡的主要原因是什么？',
    options: ['火烧', '烟雾中毒窒息', '跳楼', '踩踏'],
    answer: 1
  },
  {
    id: 'q3',
    question: '电器起火时，下列哪种做法是错误的？',
    options: ['先切断电源', '用干粉灭火器扑救', '用水扑救', '用二氧化碳灭火器扑救'],
    answer: 2
  },
  {
    id: 'q4',
    question: '我国的消防报警电话是？',
    options: ['110', '120', '119', '122'],
    answer: 2
  },
  {
    id: 'q5',
    question: '在火灾现场疏散时，应该采取什么姿势？',
    options: ['直立快速奔跑', '弯腰低姿前行', '匍匐前进', '原地等待救援'],
    answer: 1
  }
];

export const emergencyPlans: EmergencyPlan[] = [
  {
    id: 'p1',
    title: '商场火灾应急预案',
    category: '火灾处置',
    updateTime: '2026-06-01',
    steps: [
      '立即拨打119报警，并报告消防控制中心',
      '启动消防广播，通知顾客和员工有序疏散',
      '组织人员使用就近灭火器扑救初起火灾',
      '安排人员在关键位置引导疏散，确保通道畅通',
      '切断非消防电源，关闭防火门、防火卷帘',
      '派人到商场入口处引导消防车进入',
      '配合消防部门进行救援和火灾扑救',
      '火灾扑灭后，保护现场，配合事故调查'
    ]
  },
  {
    id: 'p2',
    title: '高层建筑疏散预案',
    category: '人员疏散',
    updateTime: '2026-05-28',
    steps: [
      '接到报警后，立即确认火灾楼层和位置',
      '通过广播系统通知各楼层人员准备疏散',
      '优先疏散着火层及上、下相邻楼层',
      '引导人员使用疏散楼梯，禁止使用电梯',
      '在楼梯间安排人员维持秩序，防止拥挤',
      '行动不便人员安排专人协助疏散',
      '到达安全区域后清点人数，做好记录',
      '向指挥中心报告疏散情况'
    ]
  }
];
