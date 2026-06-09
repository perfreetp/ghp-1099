import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro, { useRouter, useDidShow, useReady } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { categoryLabels } from '@/data/inspection';
import { useInspectionStore, type VoiceRecord } from '@/store/inspection';
import type { CheckItemState } from '@/store/inspection';

const InspectionDetailPage: React.FC = () => {
  const router = useRouter();
  const inspId = router.params.id || 'insp1';
  const autoVoice = router.params.autovoice === '1';
  const autoPhoto = router.params.autophoto === '1';

  const getInspection = useInspectionStore(s => s.getInspection);
  const updateCheckItem = useInspectionStore(s => s.updateCheckItem);
  const saveDraft = useInspectionStore(s => s.saveDraft);
  const submitInspection = useInspectionStore(s => s.submitInspection);
  const addPhoto = useInspectionStore(s => s.addPhoto);
  const removePhoto = useInspectionStore(s => s.removePhoto);
  const setVoice = useInspectionStore(s => s.setVoice);
  const addRemark = useInspectionStore(s => s.addRemark);

  const [, forceUpdate] = useState(0);
  const template = getInspection(inspId);

  const [items, setItems] = useState<CheckItemState[]>(template ? template.items : []);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [remarkInput, setRemarkInput] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceTimer, setVoiceTimer] = useState<number | null>(null);
  const [voiceTargetItemId, setVoiceTargetItemId] = useState<string | null>(null);

  useReady(() => {
    if (template) {
      setItems(template.items);
    }
    if (autoVoice) {
      setTimeout(() => {
        const firstUnfinished = template?.items.find(i => !i.checked && !i.abnormal) || template?.items[0];
        if (firstUnfinished) {
          setVoiceTargetItemId(firstUnfinished.id);
          triggerVoice(firstUnfinished.id);
        }
      }, 400);
    }
    if (autoPhoto) {
      setTimeout(() => {
        const firstUnfinished = template?.items.find(i => !i.checked && !i.abnormal) || template?.items[0];
        if (firstUnfinished) {
          handleAddPhoto(firstUnfinished.id);
        }
      }, 400);
    }
  });

  useDidShow(() => {
    const t = getInspection(inspId);
    if (t) {
      setItems(t.items);
      forceUpdate(n => n + 1);
    }
  });

  const progress = useMemo(() => {
    const checked = items.filter(i => i.checked || i.abnormal).length;
    return { checked, total: items.length, percent: items.length > 0 ? Math.round((checked / items.length) * 100) : 0 };
  }, [items]);

  const categoryIcon = template?.category === 'hose' ? '🧯' :
    template?.category === 'extinguisher' ? '🔥' : '🚰';

  const syncState = (newItems: CheckItemState[]) => {
    setItems(newItems);
    const patch: any = {};
    newItems.forEach(it => {
      updateCheckItem(inspId, it.id, {
        checked: it.checked,
        abnormal: it.abnormal,
        photos: it.photos,
        remark: it.remark,
        voice: it.voice
      });
    });
    saveDraft(inspId, patch);
  };

  const handleToggleCheck = (id: string) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, checked: !item.checked, abnormal: false }
        : item
    );
    syncState(newItems);
  };

  const handleToggleAbnormal = (id: string) => {
    const newItems = items.map(item =>
      item.id === id
        ? { ...item, abnormal: !item.abnormal, checked: false }
        : item
    );
    syncState(newItems);
  };

  const handleAddPhoto = (itemId: string) => {
    Taro.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFilePaths.forEach(p => addPhoto(inspId, itemId, p));
        const t = getInspection(inspId);
        if (t) setItems(t.items);
        Taro.showToast({ title: '照片已保存', icon: 'success' });
      },
      fail: () => {
        const cur = items.find(i => i.id === itemId);
        if (cur && cur.photos.length < 3) {
          addPhoto(inspId, itemId, `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
          const t = getInspection(inspId);
          if (t) setItems(t.items);
          Taro.showToast({ title: '已添加照片', icon: 'success' });
        }
      }
    });
  };

  const handleRemovePhoto = (itemId: string, photoIdx: number, e: any) => {
    e.stopPropagation();
    removePhoto(inspId, itemId, photoIdx);
    const t = getInspection(inspId);
    if (t) setItems(t.items);
  };

  const triggerVoice = (itemId: string) => {
    setVoiceTargetItemId(itemId);
    setShowVoiceModal(true);
    setVoiceSeconds(0);
    const timer = Taro.setInterval(() => {
      setVoiceSeconds(s => s + 1);
    }, 1000) as unknown as number;
    setVoiceTimer(timer);
  };

  const handleGlobalVoice = () => {
    const firstUnfinished = items.find(i => !i.checked && !i.abnormal) || items[0];
    if (firstUnfinished) {
      triggerVoice(firstUnfinished.id);
    }
  };

  const handleVoiceStop = (done: boolean) => {
    if (voiceTimer) {
      clearInterval(voiceTimer);
      setVoiceTimer(null);
    }
    if (done && voiceTargetItemId) {
      const voice: VoiceRecord = {
        id: `v_${Date.now()}`,
        duration: voiceSeconds,
        size: `${(voiceSeconds * 8).toFixed(1)}KB`,
        createdAt: new Date().toISOString(),
        url: `voice_${voiceTargetItemId}_${Date.now()}.mp3`
      };
      setVoice(inspId, voiceTargetItemId, voice);
      const t = getInspection(inspId);
      if (t) setItems(t.items);
      Taro.showToast({ title: '语音备注已保存', icon: 'success' });
    }
    setShowVoiceModal(false);
  };

  const handleOpenRemark = (itemId: string, current?: string) => {
    setRemarkInput(current || '');
    setActiveItemId(itemId);
  };

  const handleSaveRemark = (itemId: string) => {
    if (!remarkInput.trim()) {
      setActiveItemId(null);
      return;
    }
    addRemark(inspId, itemId, remarkInput.trim());
    const t = getInspection(inspId);
    if (t) setItems(t.items);
    setRemarkInput('');
    setActiveItemId(null);
  };

  const handleSubmit = () => {
    const { checked, total } = progress;
    const hasAbnormal = items.some(i => i.abnormal);

    Taro.showModal({
      title: '提交检查结果',
      content: `共 ${total} 项，已完成 ${checked} 项${hasAbnormal ? `，其中 ${items.filter(i=>i.abnormal).length} 项异常` : ''}。确认提交？`,
      confirmText: '确认提交',
      confirmColor: '#1E40AF',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            submitInspection(inspId);
            Taro.hideLoading();
            Taro.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1200);
          }, 700);
        }
      }
    });
  };

  const handleSaveDraft = () => {
    saveDraft(inspId);
    Taro.showToast({ title: '已暂存，可随时继续', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 800);
  };

  const formatVoiceTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!template) {
    return (
      <View style={{ padding: 60, textAlign: 'center' }}>
        <Text style={{ fontSize: 26, color: '#888' }}>检查项不存在</Text>
      </View>
    );
  }

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
          {template.isDraft && (
            <Text className={styles.metaItem} style={{ background: 'rgba(254, 243, 199, 0.3)', padding: '4rpx 16rpx', borderRadius: 20 }}>
              📝 有暂存内容
            </Text>
          )}
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
        <Button className={classnames(styles.quickBtn, styles.quickBtnPhoto)} onClick={() => {
          const first = items.find(i => !i.checked && !i.abnormal) || items[0];
          if (first) handleAddPhoto(first.id);
        }}>
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
                    className={classnames(styles.tagBtn, (!!item.voice || activeItemId === item.id) && styles.tagBtnActive)}
                    onClick={() => triggerVoice(item.id)}
                  >
                    <Text className={styles.tagIcon}>🎙️</Text>
                    {item.voice ? `${formatVoiceTime(item.voice.duration)}` : '语音'}
                  </Button>
                  <Button
                    className={classnames(styles.tagBtn, (!!item.remark) && styles.tagBtnActive)}
                    onClick={() => handleOpenRemark(item.id, item.remark)}
                  >
                    <Text className={styles.tagIcon}>📝</Text>
                    {item.remark ? '已备注' : '备注'}
                  </Button>
                </View>

                {(item.photos.length > 0 || item.remark || item.voice) && (
                  <View className={styles.remarkBox}>
                    {item.voice && (
                      <Text className={styles.remarkText}>
                        🎙️ 语音备注 · {formatVoiceTime(item.voice.duration)} · {item.voice.size}
                      </Text>
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
                        保存备注
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
            <Text className={styles.voiceTitle}>正在录入语音备注...</Text>
            <View className={styles.voiceCircle}>🎤</View>
            <Text className={styles.voiceTime}>{formatVoiceTime(voiceSeconds)}</Text>
            <Text className={styles.voiceHint}>请清晰描述异常情况</Text>
            <View className={styles.voiceActions}>
              <Button className={styles.voiceCancel} onClick={() => handleVoiceStop(false)}>
                取消
              </Button>
              <Button
                className={styles.voiceDone}
                onClick={() => handleVoiceStop(true)}
                disabled={voiceSeconds < 1}
              >
                {voiceSeconds < 1 ? '录音中...' : '完成'}
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          返回
        </Button>
        <Button className={styles.saveBtn} onClick={handleSaveDraft}>
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
