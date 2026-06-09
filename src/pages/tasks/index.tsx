import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import TaskCard from '@/components/TaskCard';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import { todayTasks, dutySchedule } from '@/data/tasks';
import type { Task } from '@/types';

const TasksPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>(todayTasks);

  useDidShow(() => {
    console.log('[TasksPage] 页面显示');
  });

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'progress').length;
    const urgent = tasks.filter(t => t.status === 'urgent').length;
    return { total, completed, inProgress, urgent };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks;
    if (activeFilter === 'pending') {
      return tasks.filter(t => t.status === 'pending' || t.status === 'urgent');
    }
    return tasks.filter(t => t.status === activeFilter);
  }, [tasks, activeFilter]);

  const currentDate = useMemo(() => {
    const now = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'report':
        Taro.navigateTo({ url: '/pages/incident-report/index' });
        break;
      case 'inspect':
        Taro.switchTab({ url: '/pages/inspection/index' });
        break;
      case 'map':
        Taro.switchTab({ url: '/pages/map/index' });
        break;
      case 'learn':
        Taro.navigateTo({ url: '/pages/learning/index' });
        break;
      default:
        Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY enableBackToTop refresherEnabled refresherTriggered={false}>
        <View className={styles.headerSection}>
          <View className={styles.greetingRow}>
            <View>
              <Text className={styles.greeting}>早上好，李明</Text>
              <View className={styles.dateText}>{currentDate}</View>
            </View>
            <View className={styles.weatherBadge}>
              <Text className={styles.weatherIcon}>☀️</Text>
              <Text>28°C 晴</Text>
            </View>
          </View>
        </View>

        <View className={styles.contentWrapper}>
          <View className={styles.dutyInfoCard}>
            <View className={styles.dutyHeader}>
              <Text className={styles.dutyTitle}>
                <Text className={styles.dutyIcon}>🔥</Text>
                今日值勤
              </Text>
              <Text className={styles.shiftTag}>早班</Text>
            </View>
            <Text className={styles.dutyTime}>08:00 - 16:00</Text>
            <Text className={styles.dutyLocation}>📍 东门岗亭 · 1-3层公共区域</Text>
            <View className={styles.dutyProgress}>
              <Text className={styles.progressText}>值班进度</Text>
              <Text className={styles.progressValue}>2h 35min</Text>
            </View>
          </View>

          <View className={styles.statsRow}>
            <StatCard value={stats.total} label="今日任务" />
            <StatCard value={stats.inProgress} label="进行中" variant="accent" />
            <StatCard value={stats.completed} label="已完成" variant="success" />
            <StatCard value={stats.urgent} label="紧急" variant="warning" />
          </View>

          <SectionHeader title="快捷操作" icon="⚡" />
          <View className={styles.quickActions}>
            <View className={styles.quickActionBtn} onClick={() => handleQuickAction('report')}>
              <View className={classnames(styles.quickActionIcon, styles.iconRed)}>🚨</View>
              <Text className={styles.quickActionText}>火情上报</Text>
            </View>
            <View className={styles.quickActionBtn} onClick={() => handleQuickAction('inspect')}>
              <View className={classnames(styles.quickActionIcon, styles.iconBlue)}>✅</View>
              <Text className={styles.quickActionText}>器材检查</Text>
            </View>
            <View className={styles.quickActionBtn} onClick={() => handleQuickAction('map')}>
              <View className={classnames(styles.quickActionIcon, styles.iconGreen)}>🗺️</View>
              <Text className={styles.quickActionText}>器材地图</Text>
            </View>
            <View className={styles.quickActionBtn} onClick={() => handleQuickAction('learn')}>
              <View className={classnames(styles.quickActionIcon, styles.iconYellow)}>📚</View>
              <Text className={styles.quickActionText}>学习培训</Text>
            </View>
          </View>

          <SectionHeader title="任务列表" icon="📋" showMore />
          <View className={styles.filterTabs}>
            {[
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待开始' },
              { key: 'progress', label: '进行中' },
              { key: 'completed', label: '已完成' }
            ].map(tab => (
              <View
                key={tab.key}
                className={classnames(
                  styles.filterTab,
                  activeFilter === tab.key && styles.filterTabActive
                )}
                onClick={() => setActiveFilter(tab.key)}
              >
                {tab.label}
              </View>
            ))}
          </View>

          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          <SectionHeader title="本周排班" icon="📅" />
          <View className={styles.scheduleCard}>
            <View className={styles.scheduleList}>
              {dutySchedule.map((item, index) => (
                <View key={index} className={styles.scheduleItem}>
                  <Text className={styles.dayName}>{item.day}</Text>
                  <View className={styles.shiftInfo}>
                    <Text className={styles.shiftName}>{item.shift}</Text>
                    <Text className={styles.shiftTime}>{item.time}</Text>
                  </View>
                  <Text
                    className={classnames(
                      styles.scheduleStatus,
                      item.status === 'completed' && styles.statusCompleted,
                      item.status === 'progress' && styles.statusProgress,
                      item.status === 'pending' && styles.statusPending,
                      item.status === 'rest' && styles.statusRest
                    )}
                  >
                    {item.status === 'completed' && '已完成'}
                    {item.status === 'progress' && '进行中'}
                    {item.status === 'pending' && '待值勤'}
                    {item.status === 'rest' && '休息'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TasksPage;
