import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Statistic, Progress, Tag, List, Avatar, Empty, Space, Typography, Badge } from 'antd'
import {
  PlayCircleOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  FolderOutlined,
  SoundOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'
import type { EpisodeStatus } from '@/types'

const { Title, Text } = Typography

const statusConfig: Record<EpisodeStatus, { label: string; color: string; icon: React.ReactNode }> = {
  idea: { label: '选题中', color: 'default', icon: <SoundOutlined /> },
  planning: { label: '策划中', color: 'blue', icon: <EditOutlined /> },
  guest_confirmed: { label: '嘉宾确认', color: 'cyan', icon: <TeamOutlined /> },
  recording: { label: '录制中', color: 'processing', icon: <PlayCircleOutlined /> },
  recorded: { label: '已录制', color: 'geekblue', icon: <FolderOutlined /> },
  editing: { label: '剪辑中', color: 'purple', icon: <EditOutlined /> },
  reviewing: { label: '审核中', color: 'gold', icon: <ClockCircleOutlined /> },
  ready: { label: '待发布', color: 'green', icon: <CheckCircleOutlined /> },
  published: { label: '已发布', color: 'success', icon: <CheckCircleOutlined /> },
  archived: { label: '已归档', color: 'default', icon: <FolderOutlined /> }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { seasons, episodes, tasks, teamMembers, topics } = useAppStore()

  const statusStats = {
    idea: episodes.filter(e => e.status === 'idea').length,
    planning: episodes.filter(e => e.status === 'planning').length,
    recording: episodes.filter(e => e.status === 'recording' || e.status === 'recorded').length,
    editing: episodes.filter(e => e.status === 'editing' || e.status === 'reviewing').length,
    ready: episodes.filter(e => e.status === 'ready').length,
    published: episodes.filter(e => e.status === 'published').length
  }

  const upcomingEpisodes = [...episodes]
    .filter(e => e.status !== 'published' && e.status !== 'archived' && e.deadline)
    .sort((a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf())
    .slice(0, 5)

  const myTasks = tasks.filter(t => t.status !== 'done').slice(0, 6)

  const activeSeasons = seasons.filter(s => s.status !== 'completed')

  return (
    <div>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: 16 }}>数据概览</Title>
          <Row gutter={16}>
            <Col span={4}>
              <Card>
                <Statistic
                  title="节目季"
                  value={seasons.length}
                  prefix={<FolderOutlined style={{ color: '#1677ff' }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="单集总数"
                  value={episodes.length}
                  prefix={<SoundOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="选题池"
                  value={topics.filter(t => t.status === 'pending').length}
                  prefix={<EditOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="进行中"
                  value={statusStats.recording + statusStats.editing}
                  prefix={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="待发布"
                  value={statusStats.ready}
                  prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="已发布"
                  value={statusStats.published}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Row gutter={16}>
          <Col span={16}>
            <Card title="节目季进度" extra={<a onClick={() => {}}>查看全部</a>}>
              {activeSeasons.length === 0 ? (
                <Empty description="暂无进行中的节目季" />
              ) : (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {activeSeasons.map(season => {
                    const seasonEpisodes = episodes.filter(e => e.seasonId === season.id)
                    const publishedCount = seasonEpisodes.filter(e => e.status === 'published').length
                    const progress = season.episodeCount > 0
                      ? Math.round((publishedCount / season.episodeCount) * 100)
                      : 0
                    return (
                      <Card key={season.id} size="small" style={{ cursor: 'pointer' }} onClick={() => {}}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Space>
                            <Tag color={season.status === 'recording' ? 'processing' : 'blue'}>
                              {season.status === 'recording' ? '录制中' : '策划中'}
                            </Tag>
                            <Text strong>{season.name}</Text>
                          </Space>
                          <Text type="secondary">{season.episodeCount} 集</Text>
                        </div>
                        <Progress percent={progress} size="small" />
                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            已发布 {publishedCount} 集
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {season.startDate} ~ {season.endDate}
                          </Text>
                        </div>
                      </Card>
                    )
                  })}
                </Space>
              )}
            </Card>
          </Col>

          <Col span={8}>
            <Card title="成员任务概览" extra={<a>查看全部</a>}>
              {teamMembers.map(member => {
                const memberTasks = tasks.filter(t => t.assignee === member.id)
                const doneTasks = memberTasks.filter(t => t.status === 'done').length
                const progress = memberTasks.length > 0
                  ? Math.round((doneTasks / memberTasks.length) * 100)
                  : 0
                return (
                  <div key={member.id} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Avatar size={32} style={{ marginRight: 12 }} icon={<TeamOutlined />} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{member.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{member.role}</Text>
                        </div>
                      </div>
                    </div>
                    <Progress percent={progress} size="small" />
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {doneTasks}/{memberTasks.length} 个任务完成
                    </div>
                  </div>
                )
              })}
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Card title="近期单集" extra={<a>查看全部</a>}>
              {upcomingEpisodes.length === 0 ? (
                <Empty description="暂无待处理单集" />
              ) : (
                <List
                  dataSource={upcomingEpisodes}
                  renderItem={episode => {
                    const config = statusConfig[episode.status]
                    const isOverdue = dayjs(episode.deadline).isBefore(dayjs())
                    return (
                      <List.Item
                        className="episode-card"
                        onClick={() => navigate(`/episode/${episode.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={config.icon} style={{ backgroundColor: config.color }} />}
                          title={
                            <Space>
                              <Tag color={config.color}>{config.label}</Tag>
                              {episode.title}
                            </Space>
                          }
                          description={
                            <Space>
                              <Text type="secondary">
                                {seasons.find(s => s.id === episode.seasonId)?.name} · 第{episode.episodeNumber}集
                              </Text>
                            </Space>
                          }
                        />
                        <Space direction="vertical" align="end" size={4}>
                          <Space>
                            <CalendarOutlined />
                            <Text type={isOverdue ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                              截止：{episode.deadline}
                              {isOverdue && ' (已逾期)'}
                            </Text>
                          </Space>
                          <Avatar.Group max={{ count: 3 }}>
                            {episode.assignees.map(assigneeId => {
                              const member = teamMembers.find(m => m.id === assigneeId)
                              return member ? (
                                <Avatar key={assigneeId} size={20}>
                                  {member.name.charAt(0)}
                                </Avatar>
                              ) : null
                            })}
                          </Avatar.Group>
                        </Space>
                      </List.Item>
                    )
                  }}
                />
              )}
            </Card>
          </Col>

          <Col span={8}>
            <Card title="我的待办" extra={<a>全部任务</a>}>
              {myTasks.length === 0 ? (
                <Empty description="暂无待办任务" />
              ) : (
                <List
                  size="small"
                  dataSource={myTasks}
                  renderItem={task => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <Badge
                              status={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                            />
                            <Text delete={task.status === 'done'}>{task.title}</Text>
                          </Space>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {task.dueDate && `截止: ${task.dueDate}`}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  )
}
