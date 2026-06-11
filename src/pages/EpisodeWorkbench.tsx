import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Tabs, Card, Tag, Space, Typography, Button, Avatar, Descriptions,
  Row, Col, List, Input, Form, Modal, Select, DatePicker, Radio,
  Table, Progress, Badge, Empty, Timeline, message, Divider, Checkbox
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  SoundOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  PictureOutlined,
  ScissorOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  SendOutlined,
  FolderOutlined,
  PushpinOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'
import type { EpisodeStatus, Topic, Guest, EditTodo, ReviewComment, TimelineNote, Material, MistakeRecord, ClipMarker, CopyrightMusic } from '@/types'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const statusConfig: Record<EpisodeStatus, { label: string; color: string }> = {
  idea: { label: '选题中', color: 'default' },
  planning: { label: '策划中', color: 'blue' },
  guest_confirmed: { label: '嘉宾确认', color: 'cyan' },
  recording: { label: '录制中', color: 'processing' },
  recorded: { label: '已录制', color: 'geekblue' },
  editing: { label: '剪辑中', color: 'purple' },
  reviewing: { label: '审核中', color: 'gold' },
  ready: { label: '待发布', color: 'green' },
  published: { label: '已发布', color: 'success' },
  archived: { label: '已归档', color: 'default' }
}

export default function EpisodeWorkbench() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    episodes, seasons, guests, topics, editTodos, reviewComments,
    timelineNotes, materials, mistakeRecords, clipMarkers, copyrightMusic,
    coverDrafts, copywritings, publishChecklists, teamMembers, sponsorSlots,
    updateEpisode, addEditTodo, updateEditTodo, addReviewComment, resolveReviewComment,
    togglePublishChecklistItem
  } = useAppStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [editTodoModal, setEditTodoModal] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [form] = Form.useForm()

  const episode = episodes.find(e => e.id === id)
  const season = seasons.find(s => s.id === episode?.seasonId)
  const guest = guests.find(g => g.id === episode?.guestId)

  if (!episode) {
    return <Empty description="单集不存在" />
  }

  const episodeTopics = topics.filter(t => t.episodeId === id)
  const episodeEditTodos = editTodos.filter(t => t.episodeId === id)
  const episodeComments = reviewComments.filter(c => c.episodeId === id)
  const episodeTimeline = timelineNotes.filter(n => n.episodeId === id).sort((a, b) => a.timePoint - b.timePoint)
  const episodeMaterials = materials.filter(m => m.episodeId === id)
  const episodeMistakes = mistakeRecords.filter(m => m.episodeId === id)
  const episodeClips = clipMarkers.filter(c => c.episodeId === id)
  const episodeMusic = copyrightMusic.filter(m => m.episodeId === id)
  const episodeCovers = coverDrafts.filter(c => c.episodeId === id)
  const episodeCopywritings = copywritings.filter(c => c.episodeId === id)
  const episodeChecklist = publishChecklists.find(c => c.episodeId === id)
  const episodeSponsors = sponsorSlots.filter(s => s.episodeId === id)

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAddTodo = () => {
    form.validateFields().then(values => {
      addEditTodo({
        episodeId: id!,
        title: values.title,
        description: values.description || '',
        assignee: values.assignee,
        status: 'pending',
        priority: values.priority,
        dueDate: values.dueDate?.format('YYYY-MM-DD')
      })
      setEditTodoModal(false)
      form.resetFields()
      message.success('任务已添加')
    })
  }

  const handleAddComment = () => {
    if (!commentInput.trim()) return
    addReviewComment({
      episodeId: id!,
      reviewer: 'm1',
      content: commentInput,
      status: 'open'
    })
    setCommentInput('')
    message.success('评论已发送')
  }

  const todoProgress = episodeEditTodos.length > 0
    ? Math.round((episodeEditTodos.filter(t => t.status === 'done').length / episodeEditTodos.length) * 100)
    : 0

  const tabItems = [
    {
      key: 'overview',
      label: '总览',
      children: (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small">
                <StatItem label="状态" value={<Tag color={statusConfig[episode.status].color}>{statusConfig[episode.status].label}</Tag>} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <StatItem label="时长" value={formatDuration(episode.duration)} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <StatItem label="截止日期" value={episode.deadline} />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <StatItem label="剪辑进度" value={`${todoProgress}%`} />
              </Card>
            </Col>
          </Row>

          <Card title="基本信息" extra={<Button size="small" icon={<EditOutlined />}>编辑</Button>}>
            <Descriptions column={2}>
              <Descriptions.Item label="节目季">{season?.name}</Descriptions.Item>
              <Descriptions.Item label="集数">第 {episode.episodeNumber} 集</Descriptions.Item>
              <Descriptions.Item label="标题">{episode.title}</Descriptions.Item>
              <Descriptions.Item label="副标题">{episode.subtitle || '-'}</Descriptions.Item>
              <Descriptions.Item label="主题">{episode.topic}</Descriptions.Item>
              <Descriptions.Item label="发布日期">{episode.publishDate || '待定'}</Descriptions.Item>
              <Descriptions.Item label="负责人">
                <Space wrap>
                  {episode.assignees.map(aid => {
                    const m = teamMembers.find(m => m.id === aid)
                    return m ? (
                      <Tag key={aid}>
                        <Avatar size={16} style={{ marginRight: 4 }} icon={<UserOutlined />} />
                        {m.name}
                      </Tag>
                    ) : null
                  })}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="嘉宾">
                {guest ? (
                  <Tag color="blue">
                    <UserOutlined style={{ marginRight: 4 }} />
                    {guest.name} - {guest.title}
                  </Tag>
                ) : '待定'}
              </Descriptions.Item>
              <Descriptions.Item label="简介" span={2}>
                <Paragraph style={{ marginBottom: 0 }}>{episode.description}</Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="剪辑待办"
                extra={
                  <Button size="small" type="primary" onClick={() => setEditTodoModal(true)}>
                    添加任务
                  </Button>
                }
              >
                {episodeEditTodos.length === 0 ? (
                  <Empty description="暂无剪辑任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <List
                    size="small"
                    dataSource={episodeEditTodos}
                    renderItem={todo => {
                      const assignee = teamMembers.find(m => m.id === todo.assignee)
                      return (
                        <List.Item
                          actions={[
                            <a key="edit" onClick={() => updateEditTodo(todo.id, { status: todo.status === 'done' ? 'pending' : 'done' })}>
                              {todo.status === 'done' ? '撤销' : '完成'}
                            </a>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Badge
                                status={
                                  todo.status === 'done' ? 'success' :
                                  todo.status === 'in_progress' ? 'processing' : 'default'
                                }
                              />
                            }
                            title={
                              <Text delete={todo.status === 'done'}>{todo.title}</Text>
                            }
                            description={
                              <Space>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  优先级：{todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                                </Text>
                                {assignee && (
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    负责人：{assignee.name}
                                  </Text>
                                )}
                                {todo.dueDate && (
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    截止：{todo.dueDate}
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </List.Item>
                      )
                    }}
                  />
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="时间轴备注"
                extra={<Button size="small">添加备注</Button>}
              >
                {episodeTimeline.length === 0 ? (
                  <Empty description="暂无时间轴备注" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Timeline
                    items={episodeTimeline.map(note => ({
                      color: note.type === 'chapter' ? 'blue' : note.type === 'ad_break' ? 'red' : note.type === 'music' ? 'green' : 'gray',
                      children: (
                        <div>
                          <Space>
                            <Text strong>{formatTime(note.timePoint)}</Text>
                            <Tag color={note.type === 'chapter' ? 'blue' : note.type === 'ad_break' ? 'red' : 'green'} style={{ fontSize: 11 }}>
                              {note.type === 'chapter' ? '章节' : note.type === 'ad_break' ? '广告位' : note.type === 'music' ? '音乐' : '备注'}
                            </Tag>
                          </Space>
                          <div style={{ marginTop: 4 }}>{note.content}</div>
                        </div>
                      )
                    }))}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Space>
      )
    },
    {
      key: 'topic',
      label: '选题池',
      children: (
        <Card
          title="相关选题"
          extra={<Button type="primary" size="small">关联选题</Button>}
        >
          {episodeTopics.length === 0 ? (
            <Empty description="暂无关联选题" />
          ) : (
            <List
              dataSource={episodeTopics}
              renderItem={topic => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag color={topic.priority === 'high' ? 'red' : topic.priority === 'medium' ? 'orange' : 'default'}>
                          {topic.priority === 'high' ? '高优' : topic.priority === 'medium' ? '中优' : '低优'}
                        </Tag>
                        {topic.title}
                      </Space>
                    }
                    description={topic.description}
                  />
                  <Tag color="green">已采用</Tag>
                </List.Item>
              )}
            />
          )}
        </Card>
      )
    },
    {
      key: 'guest',
      label: '嘉宾资料',
      children: (
        <Card title="嘉宾信息" extra={<Button size="small" icon={<EditOutlined />}>更换嘉宾</Button>}>
          {guest ? (
            <Row gutter={24}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={120} icon={<UserOutlined />} />
                  <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{guest.name}</Title>
                  <Text type="secondary">{guest.title}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{guest.company}</Tag>
                  </div>
                </div>
              </Col>
              <Col span={18}>
                <Descriptions column={2} style={{ marginBottom: 16 }}>
                  <Descriptions.Item label="邮箱">{guest.email}</Descriptions.Item>
                  <Descriptions.Item label="电话">{guest.phone || '-'}</Descriptions.Item>
                  <Descriptions.Item label="网站">{guest.website || '-'}</Descriptions.Item>
                  <Descriptions.Item label="往期节目">{guest.episodeCount} 期</Descriptions.Item>
                  <Descriptions.Item label="最近出场">{guest.lastAppearance || '-'}</Descriptions.Item>
                  <Descriptions.Item label="标签">
                    <Space wrap>
                      {guest.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="简介" span={2}>
                    {guest.bio}
                  </Descriptions.Item>
                  <Descriptions.Item label="备注" span={2}>
                    {guest.notes}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          ) : (
            <Empty description="暂无嘉宾，请先添加" />
          )}
        </Card>
      )
    },
    {
      key: 'outline',
      label: '采访提纲',
      children: (
        <Card
          title="采访提纲"
          extra={
            <Space>
              <Button size="small">导出</Button>
              <Button size="small" type="primary" icon={<EditOutlined />}>编辑</Button>
            </Space>
          }
        >
          {episodeTopics.length === 0 ? (
            <Empty description="暂无采访提纲" />
          ) : (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Text strong>1. 开场介绍（5分钟）</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>嘉宾自我介绍</li>
                  <li>最近在做什么</li>
                  <li>本期话题引入</li>
                </ul>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>2. 主题讨论（40分钟）</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>当前行业最大的变化是什么？</li>
                  <li>创业者应该如何把握机会？</li>
                  <li>技术演进的方向是什么？</li>
                  <li>有哪些常见的误区？</li>
                </ul>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>3. 快问快答（10分钟）</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>最近在读的一本书？</li>
                  <li>最推荐的工具？</li>
                  <li>给创业者的建议？</li>
                </ul>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>4. 结尾（5分钟）</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>总结核心观点</li>
                  <li>嘉宾联系方式介绍</li>
                  <li>下期预告</li>
                </ul>
              </div>
            </Space>
          )}
        </Card>
      )
    },
    {
      key: 'recording',
      label: '录音清单',
      children: (
        <Card
          title="录音文件"
          extra={
            <Space>
              <Button size="small">导入录音</Button>
              <Button size="small" type="primary">开始录制</Button>
            </Space>
          }
        >
          <List
            dataSource={episodeMaterials.filter(m => m.type === 'audio')}
            renderItem={item => (
              <List.Item
                actions={[
                  <a key="play">播放</a>,
                  <a key="download">下载</a>,
                  <a key="delete">删除</a>
                ]}
              >
                <List.Item.Meta
                  avatar={<SoundOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                  title={item.name}
                  description={
                    <Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        时长：{formatDuration(item.duration)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        大小：{(item.fileSize / 1024 / 1024).toFixed(1)} MB
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )
    },
    {
      key: 'materials',
      label: '素材管理',
      children: (
        <Card
          title="素材文件"
          extra={
            <Space>
              <Button size="small">导入素材</Button>
              <Select size="small" placeholder="类型筛选" style={{ width: 120 }}>
                <Option value="all">全部</Option>
                <Option value="audio">音频</Option>
                <Option value="image">图片</Option>
                <Option value="document">文档</Option>
              </Select>
            </Space>
          }
        >
          <Row gutter={[16, 16]}>
            {episodeMaterials.map(mat => (
              <Col span={6} key={mat.id}>
                <Card size="small" hoverable>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    {mat.type === 'audio' && <SoundOutlined style={{ fontSize: 40, color: '#1677ff' }} />}
                    {mat.type === 'image' && <PictureOutlined style={{ fontSize: 40, color: '#52c41a' }} />}
                    {mat.type === 'document' && <FileTextOutlined style={{ fontSize: 40, color: '#faad14' }} />}
                    {(mat.type === 'video' || mat.type === 'other') && <FolderOutlined style={{ fontSize: 40, color: '#722ed1' }} />}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 12 }}>{mat.name}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color="blue" style={{ fontSize: 11 }}>
                        {mat.type === 'audio' ? '音频' : mat.type === 'image' ? '图片' : mat.type === 'document' ? '文档' : '其他'}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )
    },
    {
      key: 'clips',
      label: '片段标记',
      children: (
        <Card
          title="精彩片段标记"
          extra={<Button size="small" type="primary">添加标记</Button>}
        >
          {episodeClips.length === 0 ? (
            <Empty description="暂无片段标记" />
          ) : (
            <List
              dataSource={episodeClips}
              renderItem={clip => (
                <List.Item
                  actions={[
                    <a key="edit">编辑</a>,
                    <a key="delete">删除</a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: clip.color,
                          marginTop: 6
                        }}
                      />
                    }
                    title={clip.label}
                    description={
                      <Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                        </Text>
                        {clip.notes && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {clip.notes}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                  <Button size="small" icon={<PlayCircleOutlined />}>播放</Button>
                </List.Item>
              )}
            />
          )}
        </Card>
      )
    },
    {
      key: 'mistakes',
      label: '口误记录',
      children: (
        <Card
          title="口误记录"
          extra={
            <Space>
              <Button size="small">标记口误</Button>
              <Tag color="red">{episodeMistakes.filter(m => !m.resolved).length} 个待处理</Tag>
            </Space>
          }
        >
          {episodeMistakes.length === 0 ? (
            <Empty description="暂无口误记录" />
          ) : (
            <List
              dataSource={episodeMistakes}
              renderItem={mistake => (
                <List.Item
                  actions={[
                    mistake.resolved
                      ? <Tag color="success" key="resolved">已修复</Tag>
                      : <a key="resolve" onClick={() => {}}>标记修复</a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={
                          mistake.severity === 'major' ? 'error' :
                          mistake.severity === 'medium' ? 'warning' : 'default'
                        }
                      />
                    }
                    title={mistake.description}
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(mistake.timePoint)}
                        </Text>
                        <Tag color={mistake.severity === 'major' ? 'red' : mistake.severity === 'medium' ? 'orange' : 'default'} style={{ fontSize: 11 }}>
                          {mistake.severity === 'major' ? '严重' : mistake.severity === 'medium' ? '中等' : '轻微'}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      )
    },
    {
      key: 'editTodos',
      label: '剪辑待办',
      children: (
        <Card
          title="剪辑待办列表"
          extra={<Button type="primary" size="small" onClick={() => setEditTodoModal(true)}>添加任务</Button>}
        >
          {episodeEditTodos.length === 0 ? (
            <Empty description="暂无剪辑任务" />
          ) : (
            <Table
              size="small"
              dataSource={episodeEditTodos}
              pagination={false}
              columns={[
                { title: '任务', dataIndex: 'title', key: 'title' },
                {
                  title: '优先级',
                  dataIndex: 'priority',
                  key: 'priority',
                  width: 80,
                  render: (p: string) => (
                    <Tag color={p === 'high' ? 'red' : p === 'medium' ? 'orange' : 'default'}>
                      {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                    </Tag>
                  )
                },
                {
                  title: '负责人',
                  dataIndex: 'assignee',
                  key: 'assignee',
                  width: 100,
                  render: (a: string) => teamMembers.find(m => m.id === a)?.name || '-'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                  render: (s: string) => (
                    <Tag color={s === 'done' ? 'green' : s === 'in_progress' ? 'blue' : 'default'}>
                      {s === 'done' ? '已完成' : s === 'in_progress' ? '进行中' : '待开始'}
                    </Tag>
                  )
                },
                { title: '截止日期', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
                {
                  title: '操作',
                  key: 'action',
                  width: 100,
                  render: (_, record) => (
                    <Space>
                      <a onClick={() => updateEditTodo(record.id, { status: record.status === 'done' ? 'pending' : 'done' })}>
                        {record.status === 'done' ? '撤销' : '完成'}
                      </a>
                      <a>编辑</a>
                    </Space>
                  )
                }
              ]}
            />
          )}
        </Card>
      )
    },
    {
      key: 'music',
      label: '版权音乐',
      children: (
        <Card
          title="版权音乐登记"
          extra={<Button type="primary" size="small">添加音乐</Button>}
        >
          {episodeMusic.length === 0 ? (
            <Empty description="暂无版权音乐" />
          ) : (
            <List
              dataSource={episodeMusic}
              renderItem={music => (
                <List.Item
                  actions={[<a key="edit">编辑</a>, <a key="delete">删除</a>]}
                >
                  <List.Item.Meta
                    avatar={<SoundOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
                    title={
                      <Space>
                        {music.title}
                        <Tag color="purple">{music.artist}</Tag>
                      </Space>
                    }
                    description={
                      <Space>
                        <Tag color="blue" style={{ fontSize: 11 }}>
                          {music.usage === 'intro' ? '片头' : music.usage === 'outro' ? '片尾' : music.usage === 'background' ? '背景' : '转场'}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          时长：{formatDuration(music.duration)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          授权：{music.licenseType}
                        </Text>
                        {music.cost !== undefined && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            费用：¥{music.cost}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      )
    },
    {
      key: 'cover',
      label: '封面草稿',
      children: (
        <Card
          title="封面设计"
          extra={<Button type="primary" size="small">上传新版本</Button>}
        >
          {episodeCovers.length === 0 ? (
            <Empty description="暂无封面草稿" />
          ) : (
            <Row gutter={[16, 16]}>
              {episodeCovers.map(cover => (
                <Col span={6} key={cover.id}>
                  <Card
                    size="small"
                    hoverable
                    cover={
                      <div style={{
                        height: 160,
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14
                      }}>
                        封面预览 v{cover.version}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={`第 ${cover.version} 版`}
                      description={
                        <Tag color={
                          cover.status === 'approved' ? 'green' :
                          cover.status === 'rejected' ? 'red' :
                          cover.status === 'reviewing' ? 'blue' : 'default'
                        }>
                          {cover.status === 'approved' ? '已通过' :
                           cover.status === 'rejected' ? '已驳回' :
                           cover.status === 'reviewing' ? '审核中' : '草稿'}
                        </Tag>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      )
    },
    {
      key: 'copywriting',
      label: '文案编辑',
      children: (
        <Card
          title="文案内容"
          extra={
            <Select size="small" defaultValue="show_notes" style={{ width: 140 }}>
              <Option value="show_notes">节目简介</Option>
              <Option value="description">详细描述</Option>
              <Option value="social_media">社交媒体</Option>
              <Option value="newsletter">通讯稿</Option>
            </Select>
          }
        >
          {episodeCopywritings.length === 0 ? (
            <Empty description="暂无文案内容" />
          ) : (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {episodeCopywritings.map(cw => (
                <Card key={cw.id} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Space>
                      <Tag color="blue">
                        {cw.type === 'show_notes' ? '节目简介' :
                         cw.type === 'description' ? '详细描述' :
                         cw.type === 'social_media' ? '社交媒体' : '通讯稿'}
                      </Tag>
                      <Tag color="default">v{cw.version}</Tag>
                      <Tag color={cw.status === 'approved' ? 'green' : cw.status === 'reviewing' ? 'blue' : 'default'}>
                        {cw.status === 'approved' ? '已通过' : cw.status === 'reviewing' ? '审核中' : '草稿'}
                      </Tag>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      更新于 {dayjs(cw.updatedAt).format('MM-DD HH:mm')}
                    </Text>
                  </div>
                  <Paragraph style={{ marginBottom: 0 }}>{cw.content}</Paragraph>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      )
    },
    {
      key: 'review',
      label: '审核意见',
      children: (
        <Card
          title="审核意见"
          extra={
            <Space>
              <Tag color="red">{episodeComments.filter(c => c.status === 'open').length} 条待处理</Tag>
            </Space>
          }
        >
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Avatar icon={<UserOutlined />} />
              <div style={{ flex: 1 }}>
                <TextArea
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder="输入评论..."
                  rows={3}
                />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Button type="primary" icon={<SendOutlined />} onClick={handleAddComment}>
                    发送
                  </Button>
                </div>
              </div>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            {episodeComments.length === 0 ? (
              <Empty description="暂无评论" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={episodeComments}
                renderItem={comment => {
                  const reviewer = teamMembers.find(m => m.id === comment.reviewer)
                  return (
                    <List.Item style={{ padding: '12px 0' }}>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <Space>
                            <Text strong>{reviewer?.name || '未知用户'}</Text>
                            <Tag color={comment.status === 'resolved' ? 'green' : 'red'} style={{ fontSize: 11 }}>
                              {comment.status === 'resolved' ? '已解决' : '待处理'}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(comment.createdAt).format('MM-DD HH:mm')}
                            </Text>
                          </Space>
                        }
                        description={comment.content}
                      />
                      {comment.status === 'open' && (
                        <Button size="small" onClick={() => resolveReviewComment(comment.id)}>
                          标记解决
                        </Button>
                      )}
                    </List.Item>
                  )
                }}
              />
            )}
          </Space>
        </Card>
      )
    },
    {
      key: 'publish',
      label: '发布检查',
      children: (
        <Card title="发布检查清单">
          {episodeChecklist ? (
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                  <Text strong>完成进度</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {episodeChecklist.items.filter(i => i.checked).length} / {episodeChecklist.items.length}
                  </Text>
                </Row>
                <Progress
                  percent={Math.round((episodeChecklist.items.filter(i => i.checked).length / episodeChecklist.items.length) * 100)}
                  size="small"
                  status={
                    episodeChecklist.items.every(i => i.checked) ? 'success' : 'active'
                  }
                />
              </div>
              {['内容', '文案', '版权', '发布'].map(category => {
                const items = episodeChecklist.items.filter(i => i.category === category)
                if (items.length === 0) return null
                const categoryDone = items.filter(i => i.checked).length
                return (
                  <div key={category}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                      <Text strong>{category}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {categoryDone} / {items.length} 完成
                      </Text>
                    </Row>
                    <Checkbox.Group style={{ width: '100%' }}>
                      {items.map(item => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: item.checked ? '#f6ffed' : '#fafafa',
                            borderRadius: 4,
                            marginBottom: 6,
                            cursor: 'pointer',
                            border: item.checked ? '1px solid #b7eb8f' : '1px solid transparent',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => togglePublishChecklistItem(episodeChecklist.id, item.id, 'm1')}
                        >
                          <Checkbox
                            checked={item.checked}
                            onChange={() => togglePublishChecklistItem(episodeChecklist.id, item.id, 'm1')}
                            onClick={e => e.stopPropagation()}
                          >
                            <span style={{
                              color: item.checked ? '#52c41a' : '#262626',
                              textDecoration: item.checked ? 'line-through' : 'none'
                            }}>
                              {item.label}
                            </span>
                          </Checkbox>
                          {item.checked && item.checkedAt && (
                            <Text type="secondary" style={{ fontSize: 11, marginLeft: 'auto' }}>
                              {dayjs(item.checkedAt).format('MM-DD HH:mm')}
                            </Text>
                          )}
                        </div>
                      ))}
                    </Checkbox.Group>
                  </div>
                )
              })}
            </Space>
          ) : (
            <Empty description="暂无检查清单" />
          )}
        </Card>
      )
    },
    {
      key: 'sponsor',
      label: '赞助排期',
      children: (
        <Card
          title="赞助口播排期"
          extra={<Button type="primary" size="small">添加赞助</Button>}
        >
          {episodeSponsors.length === 0 ? (
            <Empty description="暂无赞助" />
          ) : (
            <List
              dataSource={episodeSponsors}
              renderItem={sponsor => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Tag color="gold">{sponsor.sponsorName}</Tag>
                        <Tag color="blue">
                          {sponsor.slotType === 'pre_roll' ? '片头' : sponsor.slotType === 'mid_roll' ? '片中' : '片尾'}
                        </Tag>
                        <Text strong>{sponsor.duration}秒</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          口播文案：{sponsor.copy}
                        </Text>
                        {sponsor.cost !== undefined && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            费用：¥{sponsor.cost}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                  <Tag color={sponsor.status === 'published' ? 'green' : 'orange'}>
                    {sponsor.status === 'published' ? '已发布' : '已排期'}
                  </Tag>
                </List.Item>
              )}
            />
          )}
        </Card>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard')}>
            返回看板
          </Button>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              {episode.title}
            </Title>
            <Space>
              <Tag color={statusConfig[episode.status].color}>
                {statusConfig[episode.status].label}
              </Tag>
              <Text type="secondary">
                {season?.name} · 第 {episode.episodeNumber} 集
              </Text>
            </Space>
          </div>
        </Space>
        <Space>
          <Select
            value={episode.status}
            size="middle"
            style={{ width: 140 }}
            onChange={val => updateEpisode(episode.id, { status: val })}
          >
            {Object.entries(statusConfig).map(([key, val]) => (
              <Option key={key} value={key}>{val.label}</Option>
            ))}
          </Select>
          <Button type="primary" icon={<EditOutlined />}>编辑信息</Button>
        </Space>
      </div>

      <Card bodyStyle={{ padding: '16px 0 0 0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
          size="small"
        />
      </Card>

      <Modal
        title="添加剪辑任务"
        open={editTodoModal}
        onOk={handleAddTodo}
        onCancel={() => setEditTodoModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true }]}>
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
          <Form.Item name="assignee" label="负责人" rules={[{ required: true }]}>
            <Select placeholder="请选择负责人">
              {teamMembers.map(m => (
                <Option key={m.id} value={m.id}>{m.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Radio.Group defaultValue="medium">
              <Radio value="high">高</Radio>
              <Radio value="medium">中</Radio>
              <Radio value="low">低</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="dueDate" label="截止日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#262626', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#999' }}>{label}</div>
    </div>
  )
}
