import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { todayTasks } from '@/data/tasks';
import { useInspectionStore } from '@/store/inspection';
import { useIncidentStore } from '@/store/incident';

const modules = [
  {
    key: 'tasks',
    label: '任务',
    desc: '值勤排班',
    icon: '📋',
    iconClass: styles.miTask,
    action: () => Taro.switchTab({ url: '/pages/tasks/index' })
  },
  {
    key: 'map',
    label: '地图',
    desc: '器材导航',
    icon: '🗺️',
    iconClass: styles.miMap,
    action: () => Taro.switchTab({ url: '/pages/map/index' })
  },
  {
    key: 'inspection',
    label: '检查',
    desc: '器材巡检',
    icon: '✅',
    iconClass: styles.miInspect,
    action: () => Taro.switchTab({ url: '/pages/inspection/index' })
  },
  {
    key: 'incident',
    label: '事件',
    desc: '火情处置',
    icon: '🚨',
    iconClass: styles.miIncident,
    action: () => Taro.switchTab({ url: '/pages/incident/index' })
  },
  {
    key: 'learning',
    label: '学习',
    desc: '预案培训',
    icon: '📚',
    iconClass: styles.miLearn,
    action: () => Taro.navigateTo({ url: '/pages/learning/index' })
  },
  {
    key: 'profile',
    label: '我的',
    desc: '值勤统计',
    icon: '👤',
    iconClass: styles.miProfile,
    action: () => Taro.switchTab({ url: '/pages/profile/index' })
  }
];

const HomePage: React.FC = () => {
  useDidShow(() => {
    console.log('[HomePage] 显示');
  });

  const { getPendingCount, getAbnormalCount } = useInspectionStore();
  const { getPendingCount: getIncidentPending } = useIncidentStore();

  const currentDate = useMemo(() => {
    const now = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
  }, []);

  const heroStats = useMemo(() => {
    const pendingInspect = getPendingCount();
    const pendingIncident = getIncidentPending();
    const todayTaskPending = todayTasks.filter(
      t => t.status === 'pending' || t.status === 'urgent' || t.status === 'progress'
    ).length;
    return {
      tasks: todayTaskPending,
      inspect: pendingInspect,
      incidents: pendingIncident
    };
  }, [getPendingCount, getIncidentPending]);

  const badgeMap: Record<string, number> = {
    inspection: getAbnormalCount() > 0 ? getAbnormalCount() : 0,
    incident: getIncidentPending()
  };

  const recentTasks = todayTasks.slice(0, 4);

  const statusDotMap: Record<string, string> = {
    pending: styles.tsPending,
    progress: styles.tsProgress,
    completed: styles.tsCompleted,
    urgent: styles.tsUrgent
  };

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY enableBackToTop style={{ height: '100vh' }}>
        <View className={styles.heroBanner}>
          <View className={styles.heroTop}>
            <View>
              <Text className={styles.heroGreeting}>早上好，{currentDate}</Text>
              <Text className={styles.heroName}>李明 · 东门站</Text>
            </View>
            <View className={styles.heroDuty}>🔥 早班值勤中</View>
          </View>
          <View className={styles.heroStats}>
            <View className={styles.heroStatItem}>
              <Text className={styles.heroStatNum}>{heroStats.tasks}</Text>
              <Text className={styles.heroStatLabel}>待办任务</Text>
            </View>
            <View className={styles.heroStatItem}>
              <Text className={styles.heroStatNum}>{heroStats.inspect}</Text>
              <Text className={styles.heroStatLabel}>待检查项</Text>
            </View>
            <View className={styles.heroStatItem}>
              <Text className={styles.heroStatNum}>{heroStats.incidents}</Text>
              <Text className={styles.heroStatLabel}>待处置</Text>
            </View>
          </View>
        </View>

        <View className={styles.sectionWrap}>
          <View className={styles.modulesCard}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>
                <Text className={styles.cardTitleIcon}>🧭</Text>
                功能模块
              </Text>
              <Text className={styles.cardSubtitle}>6 大核心能力</Text>
            </View>
            <View className={styles.modulesGrid}>
              {modules.map(mod => (
                <View key={mod.key} className={styles.moduleItem} onClick={mod.action}>
                  {badgeMap[mod.key] > 0 && (
                    <View className={styles.moduleBadge}>{badgeMap[mod.key]}</View>
                  )}
                  <View className={classnames(styles.moduleIcon, mod.iconClass)}>
                    {mod.icon}
                  </View>
                  <Text className={styles.moduleLabel}>{mod.label}</Text>
                  <Text className={styles.moduleDesc}>{mod.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.quickRow}>
            <View
              className={classnames(styles.quickCard, styles.qcRed)}
              onClick={() => Taro.navigateTo({ url: '/pages/incident-report/index' })}
            >
              <View className={classnames(styles.quickIcon, styles.qiRed)}>🚨</View>
              <View className={styles.quickContent}>
                <Text className={styles.quickTitle}>一键火情上报</Text>
                <Text className={styles.quickDesc}>快速启动应急响应流程</Text>
              </View>
            </View>
            <View
              className={classnames(styles.quickCard, styles.qcTeal)}
              onClick={() => Taro.navigateTo({ url: '/pages/emergency-plan/index' })}
            >
              <View className={classnames(styles.quickIcon, styles.qiTeal)}>📘</View>
              <View className={styles.quickContent}>
                <Text className={styles.quickTitle}>应急预案</Text>
                <Text className={styles.quickDesc}>随时查阅处置步骤要点</Text>
              </View>
            </View>
          </View>

          <View className={styles.tasksMiniCard}>
            <View className={styles.tasksHeader}>
              <Text className={styles.cardTitle}>
                <Text className={styles.cardTitleIcon}>📋</Text>
                今日任务
              </Text>
              <View
                className={styles.tasksCount}
                onClick={() => Taro.switchTab({ url: '/pages/tasks/index' })}
              >
                查看全部 ›
              </View>
            </View>
            {recentTasks.map(task => (
              <View
                key={task.id}
                className={styles.taskRowItem}
                onClick={() => Taro.switchTab({ url: '/pages/tasks/index' })}
              >
                <View className={classnames(styles.taskStatusDot, statusDotMap[task.status])} />
                <View className={styles.taskInfo}>
                  <View className={styles.taskTitleRow}>
                    <Text>{task.title}</Text>
                    <Text className={styles.taskTimeTxt}>{task.time}</Text>
                  </View>
                  <Text className={styles.taskMetaTxt}>
                    {task.location || '—'} · {task.type === 'patrol' ? '巡查' : task.type === 'inspection' ? '检查' : task.type === 'training' ? '培训' : '值班'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;
