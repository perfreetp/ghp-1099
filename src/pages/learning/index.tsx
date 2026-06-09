import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import { learningList, dailyQuizzes, emergencyPlans } from '@/data/learning';
import type { LearningItem } from '@/types';

const LearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [list, setList] = useState<LearningItem[]>(learningList);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'plan', label: '预案' },
    { key: 'quiz', label: '问答' },
    { key: 'drill', label: '演练' }
  ];

  const stats = useMemo(() => {
    const total = list.length;
    const unread = list.filter(l => l.status === 'unread').length;
    const completed = list.filter(l => l.status === 'completed').length;
    const inProgress = list.filter(l => l.status === 'in_progress').length;
    return { total, unread, completed, inProgress };
  }, [list]);

  const filteredList = useMemo(() => {
    if (activeTab === 'all') return list;
    return list.filter(l => l.type === activeTab);
  }, [list, activeTab]);

  const getIconClass = (type: string) => {
    switch (type) {
      case 'plan': return styles.iconPlan;
      case 'quiz': return styles.iconQuiz;
      case 'drill': return styles.iconDrill;
      default: return styles.iconPlan;
    }
  };

  const getIconEmoji = (type: string) => {
    switch (type) {
      case 'plan': return '📋';
      case 'quiz': return '📝';
      case 'drill': return '🚒';
      default: return '📚';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'unread': return styles.tagUnread;
      case 'in_progress': return styles.tagProgress;
      case 'completed': return styles.tagCompleted;
      default: return styles.tagUnread;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread': return '未学习';
      case 'in_progress': return '学习中';
      case 'completed': return '已完成';
      default: return '未学习';
    }
  };

  const handleItemClick = (item: LearningItem) => {
    if (item.type === 'plan') {
      Taro.navigateTo({ url: '/pages/emergency-plan/index' });
    } else if (item.type === 'quiz') {
      startQuiz();
    } else {
      handleDrillSignIn();
    }
  };

  const startQuiz = () => {
    let current = 0;
    let score = 0;

    const showQuestion = () => {
      if (current >= dailyQuizzes.length) {
        Taro.showModal({
          title: '答题完成',
          content: `恭喜你完成答题！得分：${(score / dailyQuizzes.length * 100).toFixed(0)}分`,
          showCancel: false,
          confirmText: '确定'
        });
        return;
      }

      const q = dailyQuizzes[current];
      Taro.showActionSheet({
        itemList: q.options,
        success: (res) => {
          if (res.tapIndex === q.answer) {
            score++;
            Taro.showToast({ title: '回答正确！', icon: 'success' });
          } else {
            Taro.showToast({ title: `正确答案：${q.options[q.answer]}`, icon: 'none' });
          }
          current++;
          setTimeout(showQuestion, 1500);
        }
      });
    };

    Taro.showModal({
      title: '每日问答',
      content: `共${dailyQuizzes.length}道题，是否开始答题？`,
      success: (res) => {
        if (res.confirm) {
          showQuestion();
        }
      }
    });
  };

  const handleDrillSignIn = () => {
    Taro.showModal({
      title: '演练签到',
      content: '6月消防演练签到\n时间：6月15日 14:00\n地点：东广场\n是否确认签到？',
      confirmText: '立即签到',
      confirmColor: '#15803D',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '签到成功', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>学习中心</Text>
        <Text className={styles.pageDesc}>学习预案，每日答题，提升消防技能</Text>
      </View>

      <View className={styles.contentWrapper}>
        <View className={styles.statsRow}>
          <StatCard value={stats.total} label="全部学习" />
          <StatCard value={stats.unread} label="待学习" variant="warning" />
          <StatCard value={stats.inProgress} label="学习中" variant="accent" />
          <StatCard value={stats.completed} label="已完成" variant="success" />
        </View>

        <SectionHeader title="快捷入口" icon="⚡" />
        <View className={styles.quickActions}>
          <View className={styles.quickCard} onClick={() => Taro.navigateTo({ url: '/pages/emergency-plan/index' })}>
            <View className={classnames(styles.quickIcon, styles.qiRed)}>📋</View>
            <Text className={styles.quickText}>应急预案</Text>
          </View>
          <View className={styles.quickCard} onClick={startQuiz}>
            <View className={classnames(styles.quickIcon, styles.qiBlue)}>📝</View>
            <Text className={styles.quickText}>每日答题</Text>
          </View>
          <View className={styles.quickCard} onClick={handleDrillSignIn}>
            <View className={classnames(styles.quickIcon, styles.qiYellow)}>🚒</View>
            <Text className={styles.quickText}>演练签到</Text>
          </View>
        </View>

        <SectionHeader title="学习列表" icon="📚" showMore moreText={`共${filteredList.length}项`} />

        <View style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 8, overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'inline-block',
                padding: '12rpx 24rpx',
                borderRadius: '48rpx',
                fontSize: '28rpx',
                fontWeight: activeTab === tab.key ? 600 : 500,
                background: activeTab === tab.key ? 'linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)' : '#FFFFFF',
                color: activeTab === tab.key ? '#FFFFFF' : '#4A4A4A',
                marginRight: 16,
                boxShadow: activeTab === tab.key ? '0 4rpx 12rpx rgba(230,57,70,0.3)' : '0 2rpx 12rpx rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap',
                border: activeTab === tab.key ? 'none' : '2rpx solid transparent'
              }}
            >
              {tab.label}
            </View>
          ))}
        </View>

        <View className={styles.learningList}>
          {filteredList.map(item => (
            <View
              key={item.id}
              className={styles.learningCard}
              onClick={() => handleItemClick(item)}
            >
              <View className={styles.cardContent}>
                <View className={classnames(styles.cardIcon, getIconClass(item.type))}>
                  {getIconEmoji(item.type)}
                </View>
                <View className={styles.cardInfo}>
                  <Text className={styles.cardTitle}>{item.title}</Text>
                  <Text className={styles.cardDesc}>{item.description}</Text>
                  <View className={styles.cardFooter}>
                    <View className={styles.cardMeta}>
                      <Text className={classnames(styles.statusTag, getStatusClass(item.status))}>
                        {getStatusText(item.status)}
                      </Text>
                      {item.deadline && (
                        <Text className={styles.deadlineTag}>⏰ {item.deadline}</Text>
                      )}
                      {item.score !== undefined && (
                        <Text className={styles.scoreTag}>🏆 {item.score}分</Text>
                      )}
                    </View>
                    <Button
                      className={classnames(
                        styles.actionBtn,
                        item.status === 'completed' && styles.btnSuccess
                      )}
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                    >
                      {item.status === 'completed' ? '复习' : item.status === 'in_progress' ? '继续' : '开始'}
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default LearningPage;
