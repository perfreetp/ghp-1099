import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { InspectionItem as InspectionItemType } from '@/types';
import { categoryLabels } from '@/data/inspection';

interface InspectionItemProps {
  item: InspectionItemType;
  onClick?: () => void;
}

const InspectionItemComponent: React.FC<InspectionItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({ url: `/pages/inspection-detail/index?id=${item.id}` });
    }
  };

  const getIconClass = (category: string) => {
    switch (category) {
      case 'hose': return styles.iconHose;
      case 'extinguisher': return styles.iconExtinguisher;
      case 'hydrant': return styles.iconHydrant;
      default: return styles.iconOther;
    }
  };

  const getIconEmoji = (category: string) => {
    switch (category) {
      case 'hose': return '🧯';
      case 'extinguisher': return '🔥';
      case 'hydrant': return '🚒';
      default: return '📦';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'completed': return styles.statusCompleted;
      case 'abnormal': return styles.statusAbnormal;
      default: return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待检查';
      case 'completed': return '已完成';
      case 'abnormal': return '异常';
      default: return '待检查';
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'pending': return '去检查';
      case 'completed': return '查看';
      case 'abnormal': return '复查';
      default: return '去检查';
    }
  };

  const checkedCount = item.items.filter(i => i.checked).length;
  const totalCount = item.items.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <View className={styles.inspectionCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.headerRow}>
          <View className={classnames(styles.iconWrapper, getIconClass(item.category))}>
            {getIconEmoji(item.category)}
          </View>
          <View className={styles.titleSection}>
            <Text className={styles.title}>{item.name}</Text>
            <Text className={styles.location}>
              <Text className={styles.locationIcon}>📍</Text>
              {item.location} · {categoryLabels[item.category]}
            </Text>
          </View>
        </View>
        <Text className={classnames(styles.statusTag, getStatusClass(item.status))}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <View className={styles.cardContent}>
        <View className={styles.progressSection}>
          <Text className={styles.progressText}>
            检查进度：{checkedCount}/{totalCount} 项
          </Text>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>
        </View>
        <Button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleClick(); }}>
          {getActionText(item.status)}
        </Button>
      </View>
    </View>
  );
};

export default InspectionItemComponent;
