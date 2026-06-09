import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { InspectionItem as InspectionItemType } from '@/types';
import { categoryLabels } from '@/data/inspection';

type PropsInspection = InspectionItemType & {
  abnormalCount?: number;
  photoCount?: number;
  voiceCount?: number;
  progress?: number;
};

interface InspectionItemProps {
  item: PropsInspection;
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
      case 'completed': return '复查';
      case 'abnormal': return '处理异常';
      default: return '去检查';
    }
  };

  const checkedCount = item.items.filter(i => i.checked || i.abnormal).length;
  const totalCount = item.items.length;
  const progress = typeof item.progress === 'number'
    ? item.progress
    : totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const abnormalCount = typeof item.abnormalCount === 'number'
    ? item.abnormalCount
    : item.items.filter(i => i.abnormal).length;
  const photoCount = item.photoCount ?? 0;
  const voiceCount = item.voiceCount ?? 0;

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
            <View style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              {photoCount > 0 && (
                <Text style={{ fontSize: 20, color: '#1D4ED8', background: '#DBEAFE', padding: '2rpx 12rpx', borderRadius: 20 }}>
                  📷 {photoCount}张
                </Text>
              )}
              {voiceCount > 0 && (
                <Text style={{ fontSize: 20, color: '#92400E', background: '#FEF3C7', padding: '2rpx 12rpx', borderRadius: 20 }}>
                  🎙️ {voiceCount}条
                </Text>
              )}
              {abnormalCount > 0 && (
                <Text style={{ fontSize: 20, color: '#B91C1C', background: '#FEE2E2', padding: '2rpx 12rpx', borderRadius: 20 }}>
                  ⚠️ {abnormalCount}处异常
                </Text>
              )}
            </View>
          </View>
        </View>
        <Text className={classnames(styles.statusTag, getStatusClass(item.status))}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <View className={styles.cardContent}>
        <View className={styles.progressSection}>
          <Text className={styles.progressText}>
            检查进度：{checkedCount}/{totalCount} 项 · {progress}%
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
