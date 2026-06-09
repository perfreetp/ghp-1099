import type { InspectionItem } from '@/types';

export const inspectionTemplates: InspectionItem[] = [
  {
    id: 'insp1',
    name: '1层消防水带检查',
    category: 'hose',
    location: '1层消防柜',
    status: 'pending',
    items: [
      { id: 'c1', title: '水带无破损、无老化裂纹', checked: false, abnormal: false },
      { id: 'c2', title: '水带接口完好、密封圈齐全', checked: false, abnormal: false },
      { id: 'c3', title: '水带卷盘转动灵活', checked: false, abnormal: false },
      { id: 'c4', title: '水带卡扣固定牢固', checked: false, abnormal: false },
      { id: 'c5', title: '水压正常、压力表读数正确', checked: false, abnormal: false }
    ]
  },
  {
    id: 'insp2',
    name: '1层灭火器检查',
    category: 'extinguisher',
    location: '1层电梯口/大厅',
    status: 'pending',
    items: [
      { id: 'c6', title: '压力表指针在绿色区域', checked: false, abnormal: false },
      { id: 'c7', title: '瓶身无锈蚀、无变形', checked: false, abnormal: false },
      { id: 'c8', title: '铅封、保险销完好', checked: false, abnormal: false },
      { id: 'c9', title: '喷管无堵塞、无龟裂', checked: false, abnormal: false },
      { id: 'c10', title: '在有效期内', checked: false, abnormal: false }
    ]
  },
  {
    id: 'insp3',
    name: '1层消火栓检查',
    category: 'hydrant',
    location: '1层大厅东侧',
    status: 'pending',
    items: [
      { id: 'c11', title: '消火栓箱门开启灵活', checked: false, abnormal: false },
      { id: 'c12', title: '箱内配件齐全（水枪、水带、阀门）', checked: false, abnormal: false },
      { id: 'c13', title: '阀门无渗漏', checked: false, abnormal: false },
      { id: 'c14', title: '消火栓周围无遮挡物', checked: false, abnormal: false },
      { id: 'c15', title: '启泵按钮正常', checked: false, abnormal: false }
    ]
  },
  {
    id: 'insp4',
    name: '2层消防水带检查',
    category: 'hose',
    location: '2层走廊西端',
    status: 'pending',
    items: [
      { id: 'c16', title: '水带无破损、无老化裂纹', checked: false, abnormal: false },
      { id: 'c17', title: '水带接口完好、密封圈齐全', checked: false, abnormal: false },
      { id: 'c18', title: '水带卷盘转动灵活', checked: false, abnormal: false },
      { id: 'c19', title: '水带卡扣固定牢固', checked: false, abnormal: false },
      { id: 'c20', title: '水压正常、压力表读数正确', checked: false, abnormal: false }
    ]
  },
  {
    id: 'insp5',
    name: '2层灭火器检查',
    category: 'extinguisher',
    location: '2层办公室门口',
    status: 'pending',
    items: [
      { id: 'c21', title: '压力表指针在绿色区域', checked: false, abnormal: false },
      { id: 'c22', title: '瓶身无锈蚀、无变形', checked: false, abnormal: false },
      { id: 'c23', title: '铅封、保险销完好', checked: false, abnormal: false },
      { id: 'c24', title: '喷管无堵塞、无龟裂', checked: false, abnormal: false },
      { id: 'c25', title: '在有效期内', checked: false, abnormal: false }
    ]
  },
  {
    id: 'insp6',
    name: '3层消火栓检查',
    category: 'hydrant',
    location: '3层楼梯口',
    status: 'pending',
    items: [
      { id: 'c26', title: '消火栓箱门开启灵活', checked: false, abnormal: false },
      { id: 'c27', title: '箱内配件齐全', checked: false, abnormal: false },
      { id: 'c28', title: '阀门无渗漏', checked: false, abnormal: false },
      { id: 'c29', title: '消火栓周围无遮挡物', checked: false, abnormal: false },
      { id: 'c30', title: '启泵按钮正常', checked: false, abnormal: false }
    ]
  }
];

export const categoryLabels: Record<string, string> = {
  hose: '消防水带',
  extinguisher: '灭火器',
  hydrant: '消火栓',
  other: '其他器材'
};
