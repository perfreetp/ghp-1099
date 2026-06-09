import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { emergencyPlans } from '@/data/learning';

const tagMap: Record<number, { text: string; className: string }[]> = {
  0: [
    { text: '紧急', className: styles.tagAlert },
    { text: '优先级1', className: styles.tagWarn }
  ],
  1: [
    { text: '疏散', className: styles.tagInfo },
    { text: '优先级1', className: styles.tagWarn }
  ],
  2: [
    { text: '扑救', className: styles.tagSafe },
    { text: '优先级2', className: styles.tagInfo }
  ],
  3: [
    { text: '引导', className: styles.tagInfo },
    { text: '秩序', className: styles.tagSafe }
  ],
  4: [
    { text: '断电', className: styles.tagAlert },
    { text: '防火门', className: styles.tagInfo }
  ],
  5: [
    { text: '引导', className: styles.tagInfo },
    { text: '外部', className: styles.tagSafe }
  ],
  6: [
    { text: '配合', className: styles.tagSafe },
    { text: '救援', className: styles.tagInfo }
  ],
  7: [
    { text: '保护', className: styles.tagWarn },
    { text: '调查', className: styles.tagInfo }
  ]
};

const contacts = [
  { id: 1, name: '张队', role: '站长·总指挥', initial: '张', av: styles.av1, phone: '138****1234' },
  { id: 2, name: '李工', role: '灭火组组长', initial: '李', av: styles.av2, phone: '139****5678' },
  { id: 3, name: '王姐', role: '疏散组组长', initial: '王', av: styles.av3, phone: '137****9012' },
  { id: 4, name: '赵工', role: '联络组组长', initial: '赵', av: styles.av4, phone: '136****3456' }
];

const EmergencyPlanPage: React.FC = () => {
  const [activePlanId, setActivePlanId] = useState(emergencyPlans[0].id);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  const activePlan = useMemo(() => {
    return emergencyPlans.find(p => p.id === activePlanId) || emergencyPlans[0];
  }, [activePlanId]);

  const toggleStep = (index: number) => {
    const key = `${activePlan.id}-${index}`;
    setCheckedSteps(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleCall = (contact: typeof contacts[0]) => {
    Taro.showModal({
      title: `联系${contact.name}`,
      content: `${contact.role}\n${contact.phone}\n\n是否立即拨打电话？`,
      confirmText: '立即拨打',
      confirmColor: '#0F766E',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '呼叫功能模拟中', icon: 'none' });
        }
      }
    });
  };

  const handleSign = () => {
    Taro.showModal({
      title: '预案学习确认',
      content: `您已学习《${activePlan.title}》，共${activePlan.steps.length}个步骤。是否确认已完成学习并签到？`,
      confirmText: '确认签到',
      confirmColor: '#0F766E',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '签到中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '签到成功', icon: 'success' });
          }, 800);
        }
      }
    });
  };

  const handleShare = () => {
    Taro.showActionSheet({
      itemList: ['分享到站内群', '发送给同事', '生成图片分享'],
      success: (res) => {
        const labels = ['站内群', '同事', '图片'];
        Taro.showToast({ title: `已分享到${labels[res.tapIndex]}`, icon: 'success' });
      }
    });
  };

  const tips = [
    '发生火情时保持冷静，第一时间报警并通知站长',
    '扑救初起火灾时，确保自身安全为先',
    '疏散时引导人员弯腰低姿前行，避免吸入烟雾',
    '严禁使用电梯进行疏散',
    '熟记所在区域的逃生路线和安全出口位置'
  ];

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerBanner}>
        <Text className={styles.headerTitle}>
          <Text className={styles.headerIcon}>📘</Text>
          {activePlan.title}
        </Text>
        <Text className={styles.headerDesc}>
          本预案适用于{activePlan.category}类紧急情况，所有值班人员应熟悉掌握各步骤要点，
          在突发事件发生时能够快速、正确地进行处置。
        </Text>
        <View className={styles.headerMeta}>
          <Text className={styles.metaItem}>
            <Text className={styles.metaIcon}>📅</Text>
            更新于 {activePlan.updateTime}
          </Text>
          <Text className={styles.metaItem}>
            <Text className={styles.metaIcon}>📋</Text>
            {activePlan.steps.length} 个关键步骤
          </Text>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionItem} onClick={() => handleCall(contacts[0])}>
          <View className={classnames(styles.actionIcon, styles.a1)}>📞</View>
          <Text className={styles.actionLabel}>站长</Text>
        </View>
        <View className={styles.actionItem} onClick={() => Taro.showToast({ title: '已启动消防广播', icon: 'success' })}>
          <View className={classnames(styles.actionIcon, styles.a2)}>📢</View>
          <Text className={styles.actionLabel}>广播</Text>
        </View>
        <View className={styles.actionItem} onClick={() => Taro.showToast({ title: '已通知灭火组', icon: 'success' })}>
          <View className={classnames(styles.actionIcon, styles.a3)}>🧯</View>
          <Text className={styles.actionLabel}>灭火</Text>
        </View>
        <View className={styles.actionItem} onClick={() => Taro.showToast({ title: '已启动疏散', icon: 'success' })}>
          <View className={classnames(styles.actionIcon, styles.a4)}>🚶</View>
          <Text className={styles.actionLabel}>疏散</Text>
        </View>
      </View>

      <View className={styles.selectorTabs}>
        {emergencyPlans.map(plan => (
          <View
            key={plan.id}
            className={classnames(
              styles.selectorTab,
              plan.id === activePlanId && styles.selectorTabActive
            )}
            onClick={() => {
              setActivePlanId(plan.id);
              setCheckedSteps(new Set());
            }}
          >
            {plan.category}
          </View>
        ))}
      </View>

      <View className={styles.stepsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>
            处置步骤
          </Text>
          <View className={styles.sectionCount}>
            {checkedSteps.size} / {activePlan.steps.length}
          </View>
        </View>

        {activePlan.steps.map((step, index) => {
          const key = `${activePlan.id}-${index}`;
          const isChecked = checkedSteps.has(key);
          const tags = tagMap[index] || [{ text: '标准', className: styles.tagInfo }];

          return (
            <View key={index} className={styles.stepCard}>
              <View className={styles.stepRow}>
                <View className={styles.stepNumber}>{index + 1}</View>
                <View className={styles.stepContent}>
                  <Text className={styles.stepTitle}>{step}</Text>
                  <View className={styles.stepTags}>
                    {tags.map((tag, ti) => (
                      <View key={ti} className={classnames(styles.stepTag, tag.className)}>
                        {tag.text}
                      </View>
                    ))}
                  </View>
                  <View className={styles.stepCheck} onClick={() => toggleStep(index)}>
                    <View className={classnames(styles.checkBox, isChecked && styles.checkBoxChecked)}>
                      {isChecked && <Text className={styles.checkMark}>✓</Text>}
                    </View>
                    <Text className={styles.checkLabel}>
                      {isChecked ? '已确认完成' : '点击确认已掌握此步骤'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.tipsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💡</Text>
            注意事项
          </Text>
        </View>
        <View className={styles.tipsCard}>
          <View className={styles.tipsHeader}>
            <Text className={styles.tipsIcon}>⚠️</Text>
            <Text className={styles.tipsTitle}>应急处置重要提示</Text>
          </View>
          <View className={styles.tipsList}>
            {tips.map((tip, i) => (
              <Text key={i} className={styles.tipItem}>{tip}</Text>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.contactSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👥</Text>
            关键联络人
          </Text>
        </View>
        <View className={styles.contactCard}>
          {contacts.map(contact => (
            <View key={contact.id} className={styles.contactRow}>
              <View className={styles.contactInfo}>
                <View className={classnames(styles.contactAvatar, contact.av)}>
                  {contact.initial}
                </View>
                <View>
                  <Text className={styles.contactName}>{contact.name}</Text>
                  <Text className={styles.contactRole}>{contact.role}</Text>
                </View>
              </View>
              <Button className={styles.contactBtn} onClick={() => handleCall(contact)}>
                📞 联系
              </Button>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.shareBtn} onClick={handleShare}>
          分享预案
        </Button>
        <Button className={styles.signBtn} onClick={handleSign}>
          ✅ 确认学习并签到
        </Button>
      </View>
    </View>
  );
};

export default EmergencyPlanPage;
