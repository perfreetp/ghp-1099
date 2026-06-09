import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

const userData = {
  name: '李明',
  avatar: '李',
  station: '城东微型消防站',
  role: '副站长',
  phone: '139****5678',
  totalDutyHours: 486,
  monthlyDutyHours: 64,
  totalTasks: 128,
  certs: [
    { id: 'c1', name: '消防员职业资格证', expireDate: '2026-08-15', daysLeft: 66 },
    { id: 'c2', name: '急救员证', expireDate: '2026-07-20', daysLeft: 40 }
  ]
};

const ProfilePage: React.FC = () => {
  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case 'learning':
        Taro.navigateTo({ url: '/pages/learning/index' });
        break;
      case 'emergency':
        Taro.navigateTo({ url: '/pages/emergency-plan/index' });
        break;
      default:
        Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerBg}>
        <View className={styles.headerRow}>
          <View className={styles.avatar}>{userData.avatar}</View>
          <View className={styles.userInfo}>
            <Text className={styles.userName}>{userData.name}</Text>
            <Text className={styles.userStation}>📍 {userData.station}</Text>
            <Text className={styles.userRole}>{userData.role}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>
          <Text className={styles.statsIcon}>📊</Text>
          个人值勤统计
        </Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {userData.monthlyDutyHours}
              <Text className={styles.statUnit}>h</Text>
            </Text>
            <Text className={styles.statLabel}>本月值勤</Text>
          </View>
          <View className={classnames(styles.statItem, styles.statAccent)}>
            <Text className={styles.statValue}>
              {userData.totalDutyHours}
              <Text className={styles.statUnit}>h</Text>
            </Text>
            <Text className={styles.statLabel}>累计值勤</Text>
          </View>
          <View className={classnames(styles.statItem, styles.statSuccess)}>
            <Text className={styles.statValue}>
              {userData.totalTasks}
              <Text className={styles.statUnit}>次</Text>
            </Text>
            <Text className={styles.statLabel}>完成任务</Text>
          </View>
        </View>
      </View>

      {userData.certs[0].daysLeft < 90 && (
        <View className={styles.certCard} onClick={() => handleMenuClick('cert')}>
          <View className={styles.certIcon}>📜</View>
          <View className={styles.certInfo}>
            <Text className={styles.certTitle}>{userData.certs[0].name}</Text>
            <Text className={styles.certDate}>有效期至：{userData.certs[0].expireDate}</Text>
          </View>
          <View className={styles.certDays}>
            <Text className={styles.daysNum}>{userData.certs[0].daysLeft}</Text>
            <Text className={styles.daysLabel}>天后到期</Text>
          </View>
        </View>
      )}

      <View className={styles.menuGroup}>
        <View className={styles.menuHeader}>学习培训</View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('learning')}>
          <View className={classnames(styles.menuIcon, styles.iconBlue)}>📚</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>学习中心</Text>
            <Text className={styles.menuDesc}>应急预案、每日问答、演练签到</Text>
          </View>
          <Text className={classnames(styles.menuBadge)}>3项待学</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('emergency')}>
          <View className={classnames(styles.menuIcon, styles.iconRed)}>🚨</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>应急预案</Text>
            <Text className={styles.menuDesc}>火灾、疏散、泄漏处置预案</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View className={styles.menuGroup}>
        <View className={styles.menuHeader}>个人管理</View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('cert')}>
          <View className={classnames(styles.menuIcon, styles.iconYellow)}>📜</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>证件管理</Text>
            <Text className={styles.menuDesc}>执业证书、到期提醒</Text>
          </View>
          <Text className={classnames(styles.menuBadge, styles.badgeWarning)}>2证将到期</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('record')}>
          <View className={classnames(styles.menuIcon, styles.iconGreen)}>📝</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>值勤记录</Text>
            <Text className={styles.menuDesc}>查看历史值勤记录</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('notify')}>
          <View className={classnames(styles.menuIcon, styles.iconPurple)}>🔔</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>消息通知</Text>
            <Text className={styles.menuDesc}>系统通知、任务提醒</Text>
          </View>
          <Text className={classnames(styles.menuBadge, styles.badgeError)}>2</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>

      <View className={styles.menuGroup}>
        <View className={styles.menuHeader}>系统设置</View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('station')}>
          <View className={classnames(styles.menuIcon, styles.iconBlue)}>🏢</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>站点信息</Text>
            <Text className={styles.menuDesc}>城东微型消防站</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenuClick('settings')}>
          <View className={classnames(styles.menuIcon, styles.iconGray)}>⚙️</View>
          <View className={styles.menuContent}>
            <Text className={styles.menuTitle}>设置</Text>
            <Text className={styles.menuDesc}>账号、隐私、关于</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
