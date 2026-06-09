import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import IncidentCard from '@/components/IncidentCard';
import StatCard from '@/components/StatCard';
import { incidentList, stationMembers, statusConfig } from '@/data/incidents';
import type { Incident } from '@/types';

const IncidentPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [incidents, setIncidents] = useState<Incident[]>(incidentList);

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'reporting', label: '待出动' },
    { key: 'dispatched', label: '已出动' },
    { key: 'handling', label: '处置中' },
    { key: 'resolved', label: '已处置' }
  ];

  const stats = useMemo(() => {
    const today = incidents.filter(i => i.reportTime.startsWith('2026-06-10'));
    return {
      today: today.length,
      handling: incidents.filter(i => i.status === 'handling' || i.status === 'dispatched').length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      pending: incidents.filter(i => i.status === 'reporting').length
    };
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    if (activeFilter === 'all') return incidents;
    return incidents.filter(i => i.status === activeFilter);
  }, [incidents, activeFilter]);

  const handleReport = () => {
    Taro.navigateTo({ url: '/pages/incident-report/index' });
  };

  const handleNotifyAll = () => {
    Taro.showModal({
      title: '一键通知',
      content: '确定要向所有站内成员发送紧急通知吗？',
      confirmText: '发送',
      confirmColor: '#E63946',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '通知已发送', icon: 'success' });
        }
      }
    });
  };

  const handleMemberClick = (member: any) => {
    Taro.showActionSheet({
      itemList: ['拨打电话', '发送短信', '查看详情'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showToast({ title: '呼叫功能开发中', icon: 'none' });
        } else {
          Taro.showToast({ title: '功能开发中', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>事件处理</Text>
        <Text className={styles.pageDesc}>快速响应火情，记录处置全过程</Text>
      </View>

      <View className={styles.contentWrapper}>
        <Button className={styles.emergencyBtn} onClick={handleReport}>
          <Text className={styles.btnIcon}>🚨</Text>
          <Text className={styles.btnText}>一键上报火情</Text>
          <Text className={styles.btnSubText}>快速启动应急响应流程</Text>
        </Button>

        <View className={styles.statsRow}>
          <StatCard value={stats.today} label="今日事件" />
          <StatCard value={stats.pending} label="待出动" variant="warning" />
          <StatCard value={stats.handling} label="处置中" variant="accent" />
          <StatCard value={stats.resolved} label="已完成" variant="success" />
        </View>

        <View className={styles.memberCard}>
          <View className={styles.memberHeader}>
            <Text className={styles.memberTitle}>
              <Text className={styles.memberIcon}>👥</Text>
              站内成员
            </Text>
            <Button className={styles.notifyBtn} onClick={handleNotifyAll}>
              🔔 一键通知
            </Button>
          </View>
          <View className={styles.memberGrid}>
            {stationMembers.map(member => (
              <View
                key={member.id}
                className={styles.memberItem}
                onClick={() => handleMemberClick(member)}
              >
                <View className={styles.memberAvatar}>
                  {member.name.charAt(0)}
                  <View
                    className={classnames(
                      styles.statusDot,
                      member.status === 'on' && styles.dotOn,
                      member.status === 'busy' && styles.dotBusy,
                      member.status === 'off' && styles.dotOff
                    )}
                  />
                </View>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionHeader title="事件列表" icon="📋" showMore moreText={`共${filteredIncidents.length}条`} />

        <View className={styles.filterBar}>
          {filters.map(f => (
            <View
              key={f.key}
              className={classnames(
                styles.filterChip,
                activeFilter === f.key && styles.filterChipActive
              )}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </View>
          ))}
        </View>

        {filteredIncidents.length > 0 ? (
          filteredIncidents.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
            />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无相关事件记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default IncidentPage;
