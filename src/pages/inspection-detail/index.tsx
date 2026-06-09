import React, { useState, useMemo } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { inspectionTemplates, categoryLabels } from '@/data/inspection';
import type { CheckPoint } from '@/types';

interface CheckItemState extends CheckPoint {
  photos: string[];
  voiceRemark?: string;
}

const InspectionDetailPage: React.FC = () => {
  const template = inspectionTemplates[0];
  const [items, setItems] = useState<CheckItemState[]>(
    template.items.map(item => ({ ...item, photos: [] }))
  );
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceTimer, setVoiceTimer] = useState<number | null>(null);

  const progress = useMemo(() => {
    const checked = items.filter(i => i.checked || i.abnormal).length;
    return { checked, total: items.length, percent: Math.round((checked / items.length) * 100) };
  }, [items]);

  const categoryIcon = template.category === 'hose' ? '🧯' :
    template.category === 'extinguisher' ? '🔥' : '🚰';

  const handleToggleCheck = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, checked: !item.checked, abnormal: false }
        : item
    ));
  };

  const handleToggleAbnormal = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, abnormal: !item.abnormal, checked: false }
        : item
    ));
  };

  const handleAddPhoto = (itemId: string) => {
    Taro.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setItems(prev => prev.map(item =>
          item.id === itemId
            ? { ...item, photos: [...item.photos, ...res.tempFilePaths].slice(0, 3) }
            : item
        ));
      },
      fail: () => {
        setItems(prev => prev.map(item =>
          item.id === itemId && item.photos.length < 3
            ? { ...item, photos: [...item.photos, `photo_${Date.now()}`] }
            : item
        ));
        Taro.showToast({ title: '已添加照片', icon: 'success' });
      }
    });
  };

  const handleRemovePhoto = (itemId: string, photoIdx: number, e: any) => {
    e.stopPropagation();
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, photos: item.photos.filter((_, i) => i !== photoIdx) }
        : item
    ));
  };

  const handleGlobalPhoto = () => {
    const firstUnfinished = items.find(i => !i.checked && !i.abnormal);
    if (firstUnfinished) {
      handleAddPhoto(firstUnfinished.id);
    } else {
      Taro.showToast({ title: '请先选择检查项', icon: 'none' });
    }
  };

  const handleGlobalVoice = () => {
    setShowVoiceModal(true);
    setVoiceSeconds(0);
    const timer = Taro.setInterval(() => {
      setVoiceSeconds(s => s + 1);
    }, 1000) as unknown as number;
    setVoiceTimer(timer);
  };

  const handleVoiceStop = (done: boolean) => {
    if (voiceTimer) {
      clearInterval(voiceTimer);
      setVoiceTimer(null);
    }
    if (done) {
      const firstUnfinished = items.find(i => !i.checked && !i.abnormal) || items[0];
      if (firstUnfinished) {
        setItems(prev => prev.map(item =>
          item.id === firstUnfinished.id
            ? { ...item, voiceRemark: `语音备注 ${voiceSeconds}秒`, abnormal: true }
            : item
        ));
      }
      Taro.showToast({ title: '语音已保存', icon: 'success' });
    }
    setShowVoiceModal(false);
  };

  const handleSaveRemark = (itemId: string) => {
    if (!remarkInput.trim()) {
      setActiveItemId(null);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, remark: remarkInput, abnormal: true }
        : item
    ));
    setRemarkInput('');
    setActiveItemId(null);
  };

  const handleSubmit = () => {
    const { checked, total } = progress;
    const hasAbnormal = items.some(i => i.abnormal);

    Taro.showModal({
      title: '提交检查结果',
      content: `共 ${total} 项，已完成 ${checked} 项${hasAbnormal ? '，存在异常项' : ''}。确认提交？`,
      confirmText: '确认提交',
      confirmColor: '#1E40AF',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1500);
          }, 1000);
        }
      }
    });
  };

  const formatVoiceTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.headerBanner}>
        <Text className={styles.headerTitle}>
          <Text className={styles.headerIcon}>{categoryIcon}</Text>
          {template.name}
        </Text>
        <View className={styles.headerMeta}>
          <Text className={styles.metaItem}>
            <Text className={styles.metaIcon}>📍</Text>
            {template.location}
          </Text>
          <Text className={styles.metaItem}>
            <Text className={styles.metaIcon}>🏷️</Text>
            {categoryLabels[template.category]}
          </Text>
          <Text className={styles.metaItem}>
            <Text className={styles.metaIcon}>📋</Text>
            {progress.total} 项检查
          </Text>
        </View>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressCard}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>检查进度</Text>
            <Text className={styles.progressCount}>
              {progress.checked} / {progress.total} ({progress.percent}%)
            </Text>
          </View>
          <View className={styles.progressBarWrap}>
            <View className={styles.progressBar} style={{ width: `${progress.percent}%` }} />
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <Button className={classnames(styles.quickBtn, styles.quickBtnPhoto)} onClick={handleGlobalPhoto}>
          <Text className={styles.quickBtnIcon}>📷</Text>
          <Text className={styles.quickBtnText}>拍照留痕</Text>
        </Button>
        <Button className={classnames(styles.quickBtn, styles.quickBtnVoice)} onClick={handleGlobalVoice}>
          <Text className={styles.quickBtnIcon}>🎙️</Text>
          <Text className={styles.quickBtnText}>语音录入</Text>
        </Button>
      </View>

      <View className={styles.checkListSection}>
        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>✅</Text>
          检查清单
        </Text>

        {items.map((item, index) => (
          <View
            key={item.id}
            className={classnames(
              styles.checkCard,
              item.abnormal && styles.checkCardAbnormal,
              item.checked && styles.checkCardChecked
            )}
          >
            <View className={styles.checkRow}>
              <View
                className={classnames(
                  styles.checkBox,
                  item.checked && styles.checkBoxChecked,
                  item.abnormal && styles.checkBoxAbnormal
                )}
                onClick={() => handleToggleCheck(item.id)}
              >
                {(item.checked || item.abnormal) && (
                  <Text className={styles.checkMark}>
                    {item.abnormal ? '!' : '✓'}
                  </Text>
                )}
              </View>
              <View className={styles.checkContent}>
                <Text className={styles.checkTitle}>
                  {index + 1}. {item.title}
                </Text>
                <View className={styles.checkActions}>
                  <Button
                    className={classnames(
                      styles.tagBtn,
                      item.checked && styles.tagBtnNormal
                    )}
                    onClick={() => handleToggleCheck(item.id)}
                  >
                    <Text className={styles.tagIcon}>✓</Text>
                    正常
                  </Button>
                  <Button
                    className={classnames(
                      styles.tagBtn,
                      item.abnormal && styles.tagBtnAbnormal
                    )}
                    onClick={() => handleToggleAbnormal(item.id)}
                  >
                    <Text className={styles.tagIcon}>⚠️</Text>
                    异常
                  </Button>
                  <Button
                    className={classnames(styles.tagBtn, item.photos.length > 0 && styles.tagBtnActive)}
                    onClick={() => handleAddPhoto(item.id)}
                  >
                    <Text className={styles.tagIcon}>📷</Text>
                    {item.photos.length > 0 ? `${item.photos.length}张` : '拍照'}
                  </Button>
                  <Button
                    className={classnames(styles.tagBtn, activeItemId === item.id && styles.tagBtnActive)}
                    onClick={() => setActiveItemId(activeItemId === item.id ? null : item.id)}
                  >
                    <Text className={styles.tagIcon}>📝</Text>
                    {item.remark ? '已备注' : '备注'}
                  </Button>
                </View>

                {(item.photos.length > 0 || item.remark || item.voiceRemark) && (
                  <View className={styles.remarkBox}>
                    {item.voiceRemark && (
                      <Text className={styles.remarkText}>🎙️ {item.voiceRemark}</Text>
                    )}
                    {item.remark && (
                      <Text className={styles.remarkText}>📝 {item.remark}</Text>
                    )}
                    {item.photos.length > 0 && (
                      <View className={styles.photoRow}>
                        {item.photos.map((photo, idx) => (
                          <View key={idx} className={styles.photoThumb} onClick={() => handleAddPhoto(item.id)}>
                            🏙️
                            <View className={styles.photoRemove} onClick={(e) => handleRemovePhoto(item.id, idx, e)}>×</View>
                          </View>
                        ))}
                        {item.photos.length < 3 && (
                          <View className={classnames(styles.photoThumb, styles.photoAdd)} onClick={() => handleAddPhoto(item.id)}>
                            <Text className={styles.photoAddIcon}>+</Text>
                            <Text className={styles.photoAddText}>加图</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {activeItemId === item.id && (
                  <View className={styles.remarkBox}>
                    <Input
                      className={styles.checkTitle}
                      placeholder="请输入异常描述..."
                      placeholderStyle="color: #8E8E8E"
                      value={remarkInput}
                      onInput={(e) => setRemarkInput(e.detail.value)}
                      style={{
                        padding: '16rpx 20rpx',
                        background: '#F3F4F6',
                        borderRadius: '12rpx',
                        marginBottom: 16,
                        fontSize: 26,
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                    <View style={{ display: 'flex', gap: 16 }}>
                      <Button
                        className={styles.cancelBtn}
                        style={{ flex: 1, height: 72, fontSize: 26 }}
                        onClick={() => setActiveItemId(null)}
                      >
                        取消
                      </Button>
                      <Button
                        className={styles.submitBtn}
                        style={{ flex: 1, height: 72, fontSize: 26 }}
                        onClick={() => handleSaveRemark(item.id)}
                      >
                        保存
                      </Button>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {showVoiceModal && (
        <View className={styles.voiceModal}>
          <View className={styles.voiceCard}>
            <Text className={styles.voiceTitle}>语音录入中...</Text>
            <View className={styles.voiceCircle}>🎤</View>
            <Text className={styles.voiceTime}>{formatVoiceTime(voiceSeconds)}</Text>
            <Text className={styles.voiceHint}>请对着话筒描述异常情况</Text>
            <View className={styles.voiceActions}>
              <Button className={styles.voiceCancel} onClick={() => handleVoiceStop(false)}>
                取消
              </Button>
              <Button className={styles.voiceDone} onClick={() => handleVoiceStop(true)}>
                完成
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          返回
        </Button>
        <Button className={styles.saveBtn} onClick={() => Taro.showToast({ title: '已保存草稿', icon: 'success' })}>
          暂存
        </Button>
        <Button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={progress.checked === 0}
        >
          提交检查
        </Button>
      </View>
    </View>
  );
};

export default InspectionDetailPage;
