import React, { useMemo, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { nearbyHydrants, equipmentList } from '@/data/equipment';

interface NavStep {
  type: 'start' | 'mid' | 'end';
  text: string;
  meta: string;
  hint?: string;
}

const NavigationPage: React.FC = () => {
  const router = useRouter();
  const [arrived, setArrived] = useState(false);
  const equipId = router.params.equipId;
  const hydrantId = router.params.hydrant;

  const target = useMemo(() => {
    if (hydrantId) {
      const h = nearbyHydrants.find(x => x.id === hydrantId) || nearbyHydrants[0];
      return {
        id: h.id,
        name: h.name,
        location: h.location,
        floor: h.floor,
        type: 'hydrant' as const,
        distance: h.distance,
        minutes: Number(h.distance.replace(/[^0-9]/g, '')) >= 80 ? 2 : 1
      };
    }
    if (equipId) {
      const e = equipmentList.find(x => x.id === equipId) || equipmentList[0];
      const dist = Number((e.distance || '50m').replace(/[^0-9]/g, '')) || 50;
      return {
        id: e.id,
        name: e.name,
        location: e.location,
        floor: e.floor,
        type: e.type,
        distance: e.distance || '50m',
        minutes: dist >= 80 ? 2 : 1
      };
    }
    const h = nearbyHydrants[0];
    return {
      id: h.id,
      name: h.name,
      location: h.location,
      floor: h.floor,
      type: 'hydrant' as const,
      distance: h.distance,
      minutes: 1
    };
  }, [equipId, hydrantId]);

  const steps: NavStep[] = useMemo(() => {
    const isHydrant = target.type === 'hydrant';
    const baseSteps: NavStep[] = [
      {
        type: 'start',
        text: '从当前位置（东门岗亭）出发',
        meta: '起点 · 面向大厅方向',
        hint: '请确认随身携带值勤对讲机'
      },
      {
        type: 'mid',
        text: '沿主通道直行约 30m，经过服务台右转',
        meta: '沿途注意疏散通道畅通',
      }
    ];
    if (target.floor && target.floor !== '1层' && target.floor !== '1F') {
      baseSteps.push({
        type: 'mid',
        text: `乘坐东侧电梯或走楼梯上至 ${target.floor}`,
        meta: '优先使用疏散楼梯，紧急时不搭乘电梯',
        hint: '如遇火情，禁止使用电梯，通过疏散楼梯到达'
      });
    }
    baseSteps.push({
      type: 'mid',
      text: '进入东侧走廊，前进约 20m',
      meta: '注意观察右侧墙面标识'
    });
    baseSteps.push({
      type: 'end',
      text: `到达目的地：${target.name}`,
      meta: `位于 ${target.location}`,
      hint: isHydrant
        ? '请确认消火栓周围无遮挡物，箱门可正常开启，配件齐全'
        : '请确认器材状态完好，在有效期内'
    });
    return baseSteps;
  }, [target]);

  const summary = useMemo(() => {
    const totalDist = Number(target.distance.replace(/[^0-9]/g, '')) || 80;
    const turnCount = target.floor && target.floor !== '1层' ? 3 : 2;
    return {
      distance: `${totalDist}m`,
      minutes: `${target.minutes}分${totalDist > 100 ? '30秒' : ''}`,
      turns: `${turnCount}次`
    };
  }, [target]);

  const targetIcon = target.type === 'hydrant' ? '🚒' :
    target.type === 'extinguisher' ? '🧯' :
    target.type === 'hose' ? '💧' :
    target.type === 'axe' ? '🪓' : '😷';

  const handleGuide = () => {
    Taro.showLoading({ title: '模拟导航中...' });
    setTimeout(() => {
      Taro.hideLoading();
      setArrived(true);
      Taro.showToast({ title: '已到达目的地', icon: 'success' });
    }, 1500);
  };

  useDidShow(() => {
    console.log('[Navigation] target=', target);
  });

  return (
    <View className={styles.pageContainer}>
      <View className={styles.navHeader}>
        <Text className={styles.navTitle}>
          <Text className={styles.navIcon}>🧭</Text>
          导航到 {target.name}
        </Text>
        <Text className={styles.navInfo}>📍 {target.location} · {target.floor}</Text>
        <View className={styles.navSummary}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{summary.distance}</Text>
            <Text className={styles.summaryLabel}>总距离</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{summary.minutes}</Text>
            <Text className={styles.summaryLabel}>预计耗时</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryNum}>{summary.turns}</Text>
            <Text className={styles.summaryLabel}>转弯数</Text>
          </View>
        </View>
      </View>

      <View className={styles.routeSection}>
        <View className={styles.routeCard}>
          <View className={styles.routeHeader}>
            <Text className={styles.routeTitle}>
              <Text className={styles.routeTitleIcon}>🛣️</Text>
              步行路线（{steps.length} 步）
            </Text>
            <Text style={{ fontSize: 24, color: '#1D3557', fontWeight: 600 }}>
              推荐路线
            </Text>
          </View>
          <View className={styles.routeSteps}>
            <View className={styles.routeLine} />
            {steps.map((s, idx) => (
              <View key={idx} className={styles.stepItem}>
                <View className={classnames(
                  styles.stepDot,
                  s.type === 'start' && styles.sdStart,
                  s.type === 'mid' && styles.sdMid,
                  s.type === 'end' && styles.sdEnd
                )}>
                  {s.type === 'start' ? '起' : s.type === 'end' ? '终' : idx}
                </View>
                <View className={styles.stepContent}>
                  <Text className={styles.stepText}>{s.text}</Text>
                  <Text className={styles.stepMeta}>{s.meta}</Text>
                  {s.hint && (
                    <View className={styles.stepHint}>
                      <Text className={styles.stepHintIcon}>💡</Text>
                      <Text>{s.hint}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.targetSection}>
        <View className={styles.targetCard}>
          <View className={styles.targetIcon}>{targetIcon}</View>
          <View className={styles.targetInfo}>
            <Text className={styles.targetName}>{target.name}</Text>
            <Text className={styles.targetMeta}>
              📍 {target.location} · {target.floor} · 状态：正常
            </Text>
            <Text className={styles.targetMeta}>
              🏷️ 最近检查：2026-06-08 · 下次检查：2026-06-15
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.alertSection}>
        <View className={styles.alertCard}>
          <View className={styles.alertHeader}>
            <Text className={styles.alertIcon}>⚠️</Text>
            <Text className={styles.alertTitle}>值勤注意事项</Text>
          </View>
          <View className={styles.alertList}>
            <Text className={styles.alertItem}>导航时注意观察周围环境，避让顾客和物品</Text>
            <Text className={styles.alertItem}>若途中遇火情或异常，立即上报站长并启动预案</Text>
            <Text className={styles.alertItem}>到达后先检查器材状态，做好使用前确认</Text>
            <Text className={styles.alertItem}>使用器材后及时复位，填写使用记录</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={styles.shareBtn}
          onClick={() => Taro.navigateBack()}
        >
          返回
        </Button>
        <Button className={styles.guideBtn} onClick={handleGuide}>
          {arrived ? '✅ 已到达' : '▶ 开始导航'}
        </Button>
      </View>
    </View>
  );
};

export default NavigationPage;
