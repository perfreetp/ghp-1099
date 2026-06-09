import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { stationMembers } from '@/data/incidents';

const levels = [
  { key: 'minor', label: '一般', desc: '冒烟/小火情', icon: '🟡', iconClass: styles.liMinor },
  { key: 'general', label: '较大', desc: '可控明火', icon: '🟠', iconClass: styles.liGeneral },
  { key: 'major', label: '重大', desc: '蔓延风险', icon: '🔴', iconClass: styles.liMajor },
  { key: 'critical', label: '特别重大', desc: '需外部支援', icon: '🔥', iconClass: styles.liCritical }
];

const IncidentReportPage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [notifiedMembers, setNotifiedMembers] = useState<string[]>([]);

  const handleAddPhoto = () => {
    Taro.chooseImage({
      count: 3 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setPhotos([...photos, ...res.tempFilePaths.slice(0, 3 - photos.length)]);
      },
      fail: () => {
        if (photos.length < 3) {
          const newPhotos = [...photos];
          newPhotos.push(`photo_${Date.now()}`);
          setPhotos(newPhotos);
          Taro.showToast({ title: '已添加照片', icon: 'success' });
        }
      }
    });
  };

  const handleRemovePhoto = (idx: number, e: any) => {
    e.stopPropagation();
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleVoice = () => {
    Taro.showToast({ title: '语音录入功能开发中', icon: 'none' });
  };

  const toggleMember = (id: string) => {
    if (notifiedMembers.includes(id)) {
      setNotifiedMembers(notifiedMembers.filter(m => m !== id));
    } else {
      setNotifiedMembers([...notifiedMembers, id]);
    }
  };

  const handleSubmit = () => {
    if (!location) {
      Taro.showToast({ title: '请填写事发位置', icon: 'none' });
      return;
    }
    if (!selectedLevel) {
      Taro.showToast({ title: '请选择事件等级', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认上报',
      content: '确定要上报该火情吗？上报后将立即通知相关人员。',
      confirmText: '确认上报',
      confirmColor: '#E63946',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '上报中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '上报成功', icon: 'success' });
            setTimeout(() => {
              Taro.switchTab({ url: '/pages/incident/index' });
            }, 1500);
          }, 1000);
        }
      }
    });
  };

  const handleCallFire = () => {
    Taro.showModal({
      title: '拨打119',
      content: '是否立即拨打消防报警电话119？',
      confirmText: '立即拨打',
      confirmColor: '#E63946',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '呼叫功能模拟中', icon: 'none' });
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.warningBanner}>
        <Text className={styles.warningTitle}>
          <Text className={styles.warningIcon}>🚨</Text>
          初起火情上报
        </Text>
        <Text className={styles.warningDesc}>请准确填写信息，必要时请立即拨打119报警</Text>
      </View>

      <View className={styles.contentWrapper}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>
            基本信息
          </Text>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>事发位置
            </Text>
            <Input
              className={styles.formInput}
              placeholder="请输入具体位置，如：2层东侧走廊"
              placeholderStyle="color: #8E8E8E"
              value={location}
              onInput={(e) => setLocation(e.detail.value)}
            />
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>事件等级
            </Text>
            <View className={styles.levelGrid}>
              {levels.map(level => (
                <View
                  key={level.key}
                  className={classnames(
                    styles.levelCard,
                    selectedLevel === level.key && styles.levelCardActive
                  )}
                  style={selectedLevel === level.key ? {
                    background: level.key === 'minor' ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' :
                               level.key === 'general' ? 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)' :
                               level.key === 'major' ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' :
                               'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)'
                  } : {}}
                  onClick={() => setSelectedLevel(level.key)}
                >
                  <View className={classnames(styles.levelIcon, level.iconClass)}>
                    {level.icon}
                  </View>
                  <Text className={styles.levelName}>{level.label}</Text>
                  <Text className={styles.levelDesc}>{level.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>情况描述</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请详细描述火情情况，如：燃烧物类型、火势大小、是否有人员被困等"
              placeholderStyle="color: #8E8E8E"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📷</Text>
            现场照片
          </Text>
          <View className={styles.photoGrid}>
            {photos.map((photo, idx) => (
              <View key={idx} className={styles.photoItem} onClick={handleAddPhoto}>
                <View className={styles.photoImg}>
                  🏙️
                  <View className={styles.photoRemove} onClick={(e) => handleRemovePhoto(idx, e)}>×</View>
                </View>
              </View>
            ))}
            {photos.length < 3 && (
              <View className={classnames(styles.photoItem, styles.addPhoto)} onClick={handleAddPhoto}>
                <Text className={styles.addIcon}>+</Text>
                <Text className={styles.addText}>添加照片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎙️</Text>
            语音录入
          </Text>
          <Button className={styles.voiceBtn} onClick={handleVoice}>
            <Text className={styles.voiceIcon}>🎤</Text>
            <Text className={styles.voiceText}>点击录音描述异常情况</Text>
          </Button>
        </View>

        <View className={styles.section}>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              <Text className={styles.sectionIcon}>👥</Text>
              通知站内成员
            </Text>
            <Text
              style={{ fontSize: '24rpx', color: notifiedMembers.length > 0 ? '#165DFF' : '#8E8E8E', fontWeight: 500 }}
              onClick={() => setNotifiedMembers(stationMembers.filter(m => m.status === 'on').map(m => m.id))}
            >
              {notifiedMembers.length > 0 ? `已选${notifiedMembers.length}人` : '全选在岗'}
            </Text>
          </View>
          <View className={styles.memberSection}>
            {stationMembers.map(member => (
              <View key={member.id} className={styles.memberRow} onClick={() => toggleMember(member.id)}>
                <View className={styles.memberInfo}>
                  <View className={styles.memberAvatar}>{member.name.charAt(0)}</View>
                  <View>
                    <Text className={styles.memberName}>
                      <Text className={classnames(
                        styles.statusDot,
                        member.status === 'on' && styles.dotOn,
                        member.status === 'busy' && styles.dotBusy,
                        member.status === 'off' && styles.dotOff
                      )} />
                      {member.name}
                    </Text>
                    <Text className={styles.memberRole}>{member.role} · {member.phone}</Text>
                  </View>
                </View>
                <View style={{
                  width: 40, height: 40, borderRadius: 20,
                  background: notifiedMembers.includes(member.id) ? '#E63946' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, color: notifiedMembers.includes(member.id) ? '#fff' : '#C9CDD4',
                  fontWeight: 600
                }}>
                  {notifiedMembers.includes(member.id) ? '✓' : ''}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          取消
        </Button>
        <Button className={styles.btnNotify} onClick={handleCallFire}>
          📞 119
        </Button>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          确认上报
        </Button>
      </View>
    </View>
  );
};

export default IncidentReportPage;
