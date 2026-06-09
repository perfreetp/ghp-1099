import React, { useMemo, useState } from 'react';
import { View, Text, Button, Textarea } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useIncidentStore, type VoiceRecord } from '@/store/incident';
import { stationMembers, levelConfig, statusConfig } from '@/data/incidents';

type TimelineNode = {
  key: string;
  name: string;
  desc: string;
  status: 'done' | 'current' | 'pending';
  time: string;
  action?: { label: string; handler: () => void };
};

const levelBannerMap: Record<string, string> = {
  minor: styles.lvMinor,
  general: styles.lvGeneral,
  major: styles.lvMajor,
  critical: styles.lvCritical
};

const IncidentDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';
  const getById = useIncidentStore(s => s.getById);
  const recordDispatch = useIncidentStore(s => s.recordDispatch);
  const recordArrive = useIncidentStore(s => s.recordArrive);
  const recordResolve = useIncidentStore(s => s.recordResolve);
  const updateIncident = useIncidentStore(s => s.updateIncident);

  const incident = getById(id);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultText, setResultText] = useState('');
  const [, forceRender] = useState(0);

  useDidShow(() => {
    forceRender(n => n + 1);
  });

  const level = incident ? levelConfig[incident.level] : { label: '一般', color: '#F59E0B', bgColor: '#FEF3C7' };
  const status = incident ? statusConfig[incident.status] : { label: '待出动', color: '#F59E0B' };

  const timeline: TimelineNode[] = useMemo(() => {
    if (!incident) return [];
    const nodes: TimelineNode[] = [
      {
        key: 'report',
        name: '火情上报',
        desc: `${incident.reporter} 提交事件`,
        status: 'done',
        time: incident.reportTime
      }
    ];

    if (incident.dispatchTime || incident.status === 'reporting') {
      nodes.push({
        key: 'dispatch',
        name: '出动响应',
        desc: '通知人员赶往现场',
        status: incident.dispatchTime ? 'done' : 'current',
        time: incident.dispatchTime || '—',
        action: incident.status === 'reporting' ? {
          label: '记录出动',
          handler: () => {
            Taro.showModal({
              title: '确认出动',
              content: '确认记录当前为出动时间，并通知所有在岗成员？',
              confirmColor: '#E63946',
              success: (res) => {
                if (res.confirm) {
                  recordDispatch(id);
                  Taro.showToast({ title: '出动时间已记录', icon: 'success' });
                }
              }
            });
          }
        } : undefined
      });
    }

    if (incident.dispatchTime || incident.status === 'dispatched' || incident.status === 'handling' || incident.status === 'resolved') {
      nodes.push({
        key: 'arrive',
        name: '到场确认',
        desc: '确认到达现场，开展处置',
        status: incident.arriveTime ? 'done' : (incident.status === 'dispatched' ? 'current' : 'pending'),
        time: incident.arriveTime || '—',
        action: incident.status === 'dispatched' ? {
          label: '确认到场',
          handler: () => {
            recordArrive(id);
            Taro.showToast({ title: '到场时间已记录', icon: 'success' });
          }
        } : undefined
      });
    }

    nodes.push({
      key: 'resolve',
      name: '处置完成',
      desc: '填写处置结果，归档事件',
      status: incident.resolveTime ? 'done' : (incident.status === 'handling' ? 'current' : 'pending'),
      time: incident.resolveTime || '—',
      action: incident.status === 'handling' ? {
        label: '填写结果',
        handler: () => {
          setResultText(incident.resultNote || '');
          setShowResultModal(true);
        }
      } : (incident.status === 'resolved' ? {
        label: '查看结果',
        handler: () => {
          setResultText(incident.resultNote || incident.result || '');
          setShowResultModal(true);
        }
      } : undefined)
    });

    return nodes;
  }, [incident, id, recordDispatch, recordArrive, recordResolve]);

  const notifiedMembers = useMemo(() => {
    if (!incident) return [];
    const ids = incident.notifiedMemberIds || [];
    if (ids.length === 0) return stationMembers.slice(0, 3);
    return stationMembers.filter(m => ids.includes(m.id));
  }, [incident]);

  const handleSubmitResult = () => {
    if (!resultText.trim()) {
      Taro.showToast({ title: '请填写处置结果', icon: 'none' });
      return;
    }
    if (incident?.status === 'handling') {
      recordResolve(id, resultText.trim(), '李明');
    } else {
      updateIncident(id, { resultNote: resultText.trim(), result: resultText.trim() });
    }
    setShowResultModal(false);
    Taro.showToast({ title: '处置结果已保存', icon: 'success' });
  };

  if (!incident) {
    return (
      <View style={{ padding: 80, textAlign: 'center' }}>
        <Text style={{ fontSize: 28, color: '#888' }}>事件不存在</Text>
        <Button style={{ marginTop: 24 }} onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    );
  }

  const voice = incident.voice as VoiceRecord | undefined;
  const formatVoice = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View className={styles.pageContainer}>
      <View className={classnames(styles.levelBanner, levelBannerMap[incident.level])}>
        <View className={styles.bannerTitleRow}>
          <Text className={styles.bannerTitle}>
            <Text className={styles.bannerIcon}>🚨</Text>
            {incident.title}
          </Text>
          <View className={styles.statusBadge}>{status.label}</View>
        </View>
        <View className={styles.bannerInfo}>
          📍 {incident.location}{'\n'}
          🕐 上报时间：{incident.reportTime}{'\n'}
          👤 上报人：{incident.reporter}
        </View>
      </View>

      <View className={styles.timelineSection}>
        <View className={styles.timelineCard}>
          <View className={styles.timelineHeader}>
            <Text className={styles.timelineTitle}>
              <Text className={styles.timelineTitleIcon}>⏱️</Text>
              处置时间轴
            </Text>
          </View>
          <View className={styles.timelineList}>
            <View className={styles.tlLine} />
            {timeline.map((n, idx) => (
              <View key={n.key} className={styles.tlItem}>
                <View className={classnames(
                  styles.tlDot,
                  n.status === 'done' && styles.tdDone,
                  n.status === 'current' && styles.tdCurrent,
                  n.status === 'pending' && styles.tdPending
                )}>
                  {idx + 1}
                </View>
                <View className={styles.tlInfo}>
                  <Text className={styles.tlName}>{n.name}</Text>
                  <Text className={styles.tlDesc}>{n.desc}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <Text className={styles.tlTime}>{n.time}</Text>
                  {n.action && (
                    <Button className={styles.tlBtn} onClick={n.action.handler}>
                      {n.action.label}
                    </Button>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.infoSection}>
        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>事件等级</Text>
            <Text className={styles.infoValue} style={{ color: level.color, fontWeight: 600 }}>
              {level.label}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>事发位置</Text>
            <Text className={styles.infoValue}>{incident.location}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>情况描述</Text>
            <Text className={styles.infoValue}>
              {incident.description || '（无详细描述）'}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>处置结果</Text>
            <Text className={styles.infoValue} style={{ color: incident.resultNote ? '#16A34A' : '#8E8E8E' }}>
              {incident.resultNote || incident.result || '（待填写）'}
            </Text>
          </View>
          {incident.handler && (
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>处置人</Text>
              <Text className={styles.infoValue}>{incident.handler}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.memberSection}>
        <View className={styles.memberCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>
              通知成员
            </Text>
            <View className={styles.sectionCount}>
              已通知 {notifiedMembers.length} 人
            </View>
          </View>
          {notifiedMembers.map(m => (
            <View key={m.id} className={styles.memberRow}>
              <View className={styles.memberInfo}>
                <View className={styles.memberAvatar}>{m.name.charAt(0)}</View>
                <View>
                  <Text className={styles.memberName}>{m.name}</Text>
                  <Text className={styles.memberRole}>{m.role} · {m.phone}</Text>
                </View>
              </View>
              <View className={styles.memberStatus}>已通知</View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.photoSection}>
        <View className={styles.photoCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📷</Text>
              现场照片
            </Text>
            <View className={styles.sectionCount}>
              共 {(incident.photos || []).length} 张
            </View>
          </View>
          {(incident.photos || []).length > 0 ? (
            <View className={styles.photoGrid}>
              {(incident.photos || []).map((p, i) => (
                <View key={i} className={styles.photoItem}>🏙️</View>
              ))}
            </View>
          ) : (
            <View className={styles.photoEmpty}>暂无现场照片</View>
          )}
        </View>
      </View>

      <View className={styles.voiceSection}>
        <View className={styles.voiceCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🎙️</Text>
              语音备注
            </Text>
          </View>
          {voice ? (
            <View className={styles.voiceRow} onClick={() => Taro.showToast({ title: '播放语音中...', icon: 'none' })}>
              <View className={styles.voicePlayIcon}>▶</View>
              <View className={styles.voiceInfo}>
                <View className={styles.voiceProgress}>
                  <View className={styles.voiceFill} />
                </View>
                <View className={styles.voiceMeta}>
                  <Text>语音备注 · {formatVoice(voice.duration)}</Text>
                  <Text>{voice.size}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className={styles.voiceEmpty}>暂无语音备注</View>
          )}
        </View>
      </View>

      {showResultModal && (
        <View className={styles.modalMask} onClick={() => setShowResultModal(false)}>
          <View className={styles.modalSheet} onClick={(e: any) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>处置结果</Text>
              <View className={styles.modalClose} onClick={() => setShowResultModal(false)}>×</View>
            </View>
            <Textarea
              className={styles.modalTextarea}
              placeholder="请填写处置结果，如火势控制情况、人员伤亡、财产损失、是否报119等..."
              placeholderStyle="color: #8E8E8E"
              value={resultText}
              onInput={(e) => setResultText(e.detail.value)}
              maxlength={500}
            />
            <View className={styles.modalActions}>
              <Button className={styles.modalCancel} onClick={() => setShowResultModal(false)}>
                取消
              </Button>
              <Button className={styles.modalConfirm} onClick={handleSubmitResult}>
                保存结果
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.secBtn} onClick={() => Taro.navigateBack()}>
          返回列表
        </Button>
        <Button
          className={styles.primaryBtn}
          onClick={() => {
            if (incident.status === 'reporting') {
              timeline[1]?.action?.handler();
            } else if (incident.status === 'dispatched') {
              timeline[2]?.action?.handler();
            } else if (incident.status === 'handling') {
              timeline[3]?.action?.handler();
            } else {
              Taro.navigateBack();
            }
          }}
        >
          {incident.status === 'reporting' && '🚒 立即出动'}
          {incident.status === 'dispatched' && '✅ 确认到场'}
          {incident.status === 'handling' && '📝 填写处置结果'}
          {incident.status === 'resolved' && '✅ 事件已归档'}
        </Button>
      </View>
    </View>
  );
};

export default IncidentDetailPage;
