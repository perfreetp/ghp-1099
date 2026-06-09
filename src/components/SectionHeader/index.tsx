import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  showMore?: boolean;
  moreText?: string;
  onMore?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon = '📋',
  showMore = false,
  moreText = '查看全部',
  onMore
}) => {
  const handleMore = () => {
    if (onMore) {
      onMore();
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  return (
    <View className={styles.sectionHeader}>
      <View className={styles.leftSection}>
        <View className={styles.titleIcon}>{icon}</View>
        <Text className={styles.sectionTitle}>{title}</Text>
      </View>
      {showMore && (
        <View className={styles.rightSection} onClick={handleMore}>
          <Text className={styles.moreText}>{moreText}</Text>
          <Text className={styles.moreArrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
