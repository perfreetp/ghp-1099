import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Incident } from '@/types';
import { levelConfig, statusConfig } from '@/data/incidents';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
  onAction?: () => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick, onAction }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.showToast({ title: '事件详情开发中', icon: 'none' });
    }
  };

  const handleAction = (e: any) => {
    e.stopPropagation();
    if (onAction) {
      onAction();
    } else {
      if (incident.status === 'reporting') {
        Taro.navigateTo({ url: '/pages/incident-report/index' });
      } else {
        Taro.showToast({ title: '处理详情开发中', icon: 'none' });
      }
    }
  };

  const level = levelConfig[incident.level];
  const status = statusConfig[incident.status];

  const getActionText = (status: string) => {
    switch (status) {
      case 'reporting': return '立即出动';
      case 'dispatched': return '确认到达';
      case 'handling': return '填写结果';
      case 'resolved': return '查看详情';
      default: return '处理';
    }
  };

  return (
    <View className={styles.incidentCard} onClick={handleClick}>
      <View
        className={styles.levelIndicator}
        style={{ backgroundColor: level.color }}
      />
      <View className={styles.cardContent}>
        <View className={styles.cardHeader}>
          <Text className={styles.title}>
            <Text className={classnames(styles.levelTag)} style={{ backgroundColor: level.bgColor, color: level.color }}>
              {level.label}
            </Text>
            {incident.title}
          </Text>
          <Text
            className={styles.statusTag}
            style={{ backgroundColor: `${status.color}15`, color: status.color }}
          >
            {status.label}
          </Text>
        </View>
        {incident.description && (
          <Text className={styles.description}>{incident.description}</Text>
        )}
        <View className={styles.metaRow}>
          <View className={styles.metaItem}>
            <View className={styles.metaIcon}>📍</View>
            <Text>{incident.location}</Text>
          </View>
          <View className={styles.metaItem}>
            <View className={styles.metaIcon}>🕐</View>
            <Text>{incident.reportTime.split(' ')[1]}</Text>
          </View>
        </View>
        <View className={styles.cardFooter}>
          <Text className={styles.reporter}>上报人：{incident.reporter}</Text>
          <Button className={styles.actionBtn} onClick={handleAction}>
            {getActionText(incident.status)}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default IncidentCard;
