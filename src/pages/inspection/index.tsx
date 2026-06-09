import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import InspectionItemComponent from '@/components/InspectionItem';
import { inspectionTemplates, categoryLabels } from '@/data/inspection';
import type { InspectionItem } from '@/types';

const InspectionPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [inspections, setInspections] = useState<InspectionItem[]>(inspectionTemplates);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'hose', label: '水带' },
    { key: 'extinguisher', label: '灭火器' },
    { key: 'hydrant', label: '消火栓' }
  ];

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return inspections;
    return inspections.filter(i => i.category === activeFilter);
  }, [inspections, activeFilter]);

  const stats = useMemo(() => {
    const total = inspections.length;
    const completed = inspections.filter(i => i.status === 'completed').length;
    const pending = inspections.filter(i => i.status === 'pending').length;
    const abnormal = inspections.filter(i => i.status === 'abnormal').length;
    const totalItems = inspections.reduce((acc, i) => acc + i.items.length, 0);
    const checkedItems = inspections.reduce(
      (acc, i) => acc + i.items.filter(c => c.checked).length,
      0
    );
    const percent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    return { total, completed, pending, abnormal, totalItems, checkedItems, percent };
  }, [inspections]);

  const handleTakePhoto = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: () => {
        Taro.showToast({ title: '拍照成功', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '拍照功能开发中', icon: 'none' });
      }
    });
  };

  const handleVoiceRecord = () => {
    Taro.showToast({ title: '语音录入功能开发中', icon: 'none' });
  };

  const handleStartInspection = () => {
    const pendingItem = filteredList.find(i => i.status !== 'completed');
    if (pendingItem) {
      Taro.navigateTo({ url: `/pages/inspection-detail/index?id=${pendingItem.id}` });
    } else {
      Taro.showToast({ title: '今日检查已全部完成', icon: 'success' });
    }
  };

  const handleSync = () => {
    Taro.showToast({ title: '同步成功', icon: 'success' });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>器材检查</Text>
        <Text className={styles.pageDesc}>按照清单逐项检查，拍照留痕，发现异常及时上报</Text>
      </View>

      <View className={styles.contentWrapper}>
        <View className={styles.summaryCard}>
          <View className={styles.summaryHeader}>
            <Text className={styles.summaryTitle}>
              <Text className={styles.summaryIcon}>📊</Text>
              今日检查概览
            </Text>
          </View>
          <View className={styles.summaryStats}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{stats.total}</Text>
              <Text className={styles.statLabel}>检查项总数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{stats.completed}</Text>
              <Text className={styles.statLabel}>已完成</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{stats.pending}</Text>
              <Text className={styles.statLabel}>待检查</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{stats.abnormal}</Text>
              <Text className={styles.statLabel}>异常</Text>
            </View>
          </View>
          <View className={styles.progressSection}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>
                检查进度（{stats.checkedItems}/{stats.totalItems}项）
              </Text>
              <Text className={styles.progressPercent}>{stats.percent}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${stats.percent}%` }} />
            </View>
          </View>
        </View>

        <View className={styles.quickActions}>
          <View className={styles.actionCard} onClick={handleTakePhoto}>
            <View className={classnames(styles.actionIcon, styles.iconPhoto)}>📷</View>
            <View className={styles.actionInfo}>
              <Text className={styles.actionTitle}>拍照留痕</Text>
              <Text className={styles.actionDesc}>拍摄器材状态照片</Text>
            </View>
          </View>
          <View className={styles.actionCard} onClick={handleVoiceRecord}>
            <View className={classnames(styles.actionIcon, styles.iconVoice)}>🎙️</View>
            <View className={styles.actionInfo}>
              <Text className={styles.actionTitle}>语音录入</Text>
              <Text className={styles.actionDesc}>语音记录异常情况</Text>
            </View>
          </View>
        </View>

        <View className={styles.batchActions}>
          <Button className={classnames(styles.batchBtn, styles.btnPrimary)} onClick={handleStartInspection}>
            ▶ 开始巡检
          </Button>
          <Button className={classnames(styles.batchBtn, styles.btnSecondary)} onClick={handleSync}>
            ↻ 同步数据
          </Button>
        </View>

        <View className={styles.filterBar}>
          {filters.map(f => (
            <View
              key={f.key}
              className={classnames(
                styles.filterTab,
                activeFilter === f.key && styles.filterTabActive
              )}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>

        <SectionHeader
          title="检查清单"
          icon="✅"
          showMore
          moreText={`共${filteredList.length}项`}
        />

        {filteredList.map(item => (
          <InspectionItemComponent key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

export default InspectionPage;
