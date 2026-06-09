import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
  variant?: 'default' | 'accent' | 'success' | 'warning';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, unit, variant = 'default', onClick }) => {
  const variantClass = {
    default: '',
    accent: styles.statAccent,
    success: styles.statSuccess,
    warning: styles.statWarning
  };

  return (
    <View className={classnames(styles.statCard, variantClass[variant])} onClick={onClick}>
      <Text className={styles.statValue}>
        {value}
        {unit && <Text className={styles.statUnit}>{unit}</Text>}
      </Text>
      <Text className={styles.statLabel}>{label}</Text>
    </View>
  );
};

export default StatCard;
