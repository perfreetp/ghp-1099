import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import InspectionItemComponent from '@/components/InspectionItem';
import { categoryLabels } from '@/data/inspection';
import { useInspectionStore } from '@/store/inspection';

const InspectionPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [, forceRender] = useState(0);
  const getAllInspections = useInspectionStore(s => s.getAllInspections);
  const getProgress = useInspectionStore(s => s.getProgress);

  useDidShow(() => {
    forceRender(n => n + 1);
  });

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'hose', label: '水带' },
    { key: 'extinguisher', label: '灭火器' },
    { key: 'hydrant', label: '消火栓' }
  ];

  const allList = getAllInspections() as any[];

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return allList;
    return allList.filter(i => i.category === activeFilter);
  }, [allList, activeFilter]);

  const stats = useMemo(() => {
    const total = allList.length;
    const completed = allList.filter(i => i.status === 'completed').length;
    const pending = allList.filter(i => i.status === 'pending').length;
    const abnormal = allList.filter(i => i.status === 'abnormal').length;
    const totalItems = allList.reduce((acc, i) => acc + i.items.length, 0);
    const p = getProgress();
    return {
      total, completed, pending, abnormal,
      totalItems,
      checkedItems: p.checked,
      percent: p.percent
    };
  }, [allList, getProgress]);

  const handleVoiceRecord = () => {
    const pending = filteredList.find(i => i.status !== 'completed');
    if (pending) {
      Taro.navigateTo({ url: `/pages/inspection-detail/index?id=${pending.id}&autovoice=1` });
    } else {
      Taro.showToast({ title: '暂无可记录检查项', icon: 'none' });
    }
  };

  const handleTakePhoto = () => {
    const pending = filteredList.find(i => i.status !== 'completed');
    if (pending) {
      Taro.navigateTo({ url: `/pages/inspection-detail/index?id=${pending.id}&autophoto=1` });
    } else {
      Taro.showToast({ title: '暂无可拍照检查项', icon: 'none' });
    }
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
    Taro.showLoading({ title: '同步中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '同步成功', icon: 'success' });
    }, 600);
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
              <Text className={styles.statNum} style={{ color: '#B91C1C' }}>{stats.abnormal}</Text>
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

        {filteredList.length === 0 ? (
          <View style={{ padding: 60, textAlign: 'center' }}>
            <Text style={{ fontSize: 26, color: '#8E8E8E' }}>暂无该类检查项</Text>
          </View>
        ) : (
          filteredList.map(item => (
            <InspectionItemComponent key={item.id} item={item} />
          ))
        )}
      </View>
    </View>
  );
};

export default InspectionPage;
