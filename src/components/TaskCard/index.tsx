import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Task } from '@/types';

const typeMap: Record<string, string> = {
  patrol: '巡逻',
  inspection: '检查',
  training: '培训',
  duty: '值勤'
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.showToast({ title: '任务详情开发中', icon: 'none' });
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'progress': return styles.statusProgress;
      case 'completed': return styles.statusCompleted;
      case 'urgent': return styles.statusUrgent;
      default: return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待开始';
      case 'progress': return '进行中';
      case 'completed': return '已完成';
      case 'urgent': return '紧急';
      default: return '待开始';
    }
  };

  return (
    <View className={styles.taskCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <Text className={styles.title}>{task.title}</Text>
        <Text className={classnames(styles.statusTag, getStatusClass(task.status))}>
          {getStatusText(task.status)}
        </Text>
      </View>
      <Text className={styles.description}>{task.description}</Text>
      <View className={styles.cardFooter}>
        <View className={styles.metaItem}>
          <View className={styles.metaIcon}>⏰</View>
          <Text>{task.time}</Text>
        </View>
        <View className={styles.metaItem}>
          {task.location && (
            <>
              <View className={styles.metaIcon}>📍</View>
              <Text style={{ marginRight: 16 }}>{task.location}</Text>
            </>
          )}
          <Text className={styles.typeTag}>{typeMap[task.type]}</Text>
        </View>
      </View>
    </View>
  );
};

export default TaskCard;
