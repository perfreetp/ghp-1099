import React, { useState, useMemo } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { equipmentList, nearbyHydrants, equipmentTypeLabels } from '@/data/equipment';
import type { Equipment } from '@/types';

const MapPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'hydrant', label: '消火栓' },
    { key: 'extinguisher', label: '灭火器' },
    { key: 'hose', label: '消防水带' },
    { key: 'axe', label: '消防斧' },
    { key: 'mask', label: '防毒面具' }
  ];

  const filteredEquipment = useMemo(() => {
    let list = equipmentList;
    if (activeFilter !== 'all') {
      list = list.filter(e => e.type === activeFilter);
    }
    if (searchText) {
      list = list.filter(e =>
        e.name.includes(searchText) || e.location.includes(searchText)
      );
    }
    return list;
  }, [activeFilter, searchText]);

  const getIconClass = (type: string) => {
    switch (type) {
      case 'hydrant': return styles.iconHydrant;
      case 'extinguisher': return styles.iconExtinguisher;
      case 'hose': return styles.iconHose;
      case 'axe': return styles.iconAxe;
      case 'mask': return styles.iconMask;
      default: return styles.iconHydrant;
    }
  };

  const getIconEmoji = (type: string) => {
    switch (type) {
      case 'hydrant': return '🚒';
      case 'extinguisher': return '🧯';
      case 'hose': return '💧';
      case 'axe': return '🪓';
      case 'mask': return '😷';
      default: return '📦';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal': return styles.statusNormal;
      case 'maintenance': return styles.statusMaintenance;
      case 'expired': return styles.statusExpired;
      default: return styles.statusNormal;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'maintenance': return '维护中';
      case 'expired': return '已过期';
      default: return '正常';
    }
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '导航功能开发中', icon: 'none' });
  };

  const handleEquipmentClick = (item: Equipment) => {
    Taro.showModal({
      title: item.name,
      content: `位置：${item.location}\n楼层：${item.floor}\n状态：${getStatusText(item.status)}\n距离：${item.distance}`,
      showCancel: true,
      cancelText: '关闭',
      confirmText: '导航前往',
      success: (res) => {
        if (res.confirm) {
          handleNavigate();
        }
      }
    });
  };

  const markers = useMemo(() => {
    return [
      { id: 1, emoji: '🚒', pinClass: styles.pinRed, left: '25%', top: '20%', label: '消火栓#001' },
      { id: 2, emoji: '🧯', pinClass: styles.pinOrange, left: '70%', top: '25%', label: '灭火器' },
      { id: 3, emoji: '🚒', pinClass: styles.pinRed, left: '80%', top: '45%', label: '消火栓#002' },
      { id: 4, emoji: '💧', pinClass: styles.pinBlue, left: '20%', top: '50%', label: '消防水带' },
      { id: 5, emoji: '🧯', pinClass: styles.pinOrange, left: '60%', top: '70%', label: '灭火器' },
      { id: 6, emoji: '🚒', pinClass: styles.pinRed, left: '40%', top: '85%', label: '消火栓#003' },
      { id: 7, emoji: '🪓', pinClass: styles.pinPurple, left: '15%', top: '25%', label: '消防斧' }
    ];
  }, []);

  return (
    <View className={styles.pageContainer}>
      <View style={{ paddingTop: 32 }} className={styles.contentWrapper}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索器材名称或位置"
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
          />
        </View>

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

        <View className={styles.mapContainer}>
          <View className={styles.mapGrid} />
          <View className={classnames(styles.mapLabel, styles.labelF1)}>一层 1F</View>
          <View className={classnames(styles.mapLabel, styles.labelF2)}>二层 2F</View>
          <View className={classnames(styles.mapLabel, styles.labelF3)}>三层 3F</View>

          {markers.map(m => (
            <View
              key={m.id}
              className={styles.marker}
              style={{ left: m.left, top: m.top }}
            >
              <View className={classnames(styles.markerPin, m.pinClass)}>{m.emoji}</View>
              <View className={styles.markerLabel}>{m.label}</View>
            </View>
          ))}

          <View className={styles.myLocationDot} />

          <View className={styles.myLocation} onClick={handleNavigate}>
            📍
          </View>
        </View>

        <View className={styles.nearbyCard}>
          <View className={styles.nearbyHeader}>
            <Text className={styles.nearbyTitle}>
              <Text className={styles.nearbyIcon}>🔥</Text>
              最近消火栓
            </Text>
            <Button className={styles.navigateBtn} onClick={handleNavigate}>
              一键导航
            </Button>
          </View>
          <View className={styles.nearbyList}>
            {nearbyHydrants.map((h, idx) => (
              <View key={h.id} className={styles.nearbyItem} onClick={handleNavigate}>
                <View className={classnames(
                  styles.nearbyRank,
                  idx === 0 && styles.rankFirst
                )}>
                  {idx + 1}
                </View>
                <View className={styles.nearbyInfo}>
                  <Text className={styles.nearbyName}>{h.name}</Text>
                  <Text className={styles.nearbyLocation}>📍 {h.location} · {h.floor}</Text>
                </View>
                <View className={styles.nearbyDistance}>
                  <Text className={styles.distanceValue}>{h.distance}</Text>
                  <View className={styles.distanceLabel}>步行约{idx === 0 ? '1' : idx === 1 ? '2' : '3'}分钟</View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text className={styles.titleText}>
            <Text className={styles.titleIcon}>📋</Text>
            器材列表（{filteredEquipment.length}）
          </Text>
          <Text className={styles.viewAll}>查看地图 ›</Text>
        </View>

        <View className={styles.equipmentList}>
          {filteredEquipment.map(item => (
            <View
              key={item.id}
              className={styles.equipmentCard}
              onClick={() => handleEquipmentClick(item)}
            >
              <View className={classnames(styles.equipmentIcon, getIconClass(item.type))}>
                {getIconEmoji(item.type)}
              </View>
              <View className={styles.equipmentInfo}>
                <Text className={styles.equipmentName}>{item.name}</Text>
                <View className={styles.equipmentMeta}>
                  <Text className={styles.metaTag}>📍 {item.location}</Text>
                  <Text className={classnames(styles.metaTag, styles.floorTag)}>{item.floor}</Text>
                  <Text className={styles.metaTag}>
                    {equipmentTypeLabels[item.type]}
                  </Text>
                </View>
              </View>
              <View className={styles.equipmentRight}>
                <Text className={classnames(styles.statusBadge, getStatusClass(item.status))}>
                  {getStatusText(item.status)}
                </Text>
                <Text className={styles.distanceText}>{item.distance}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MapPage;
