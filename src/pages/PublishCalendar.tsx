import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card, Calendar, Badge, Modal, List, Tag, Space, Button,
  Avatar, Typography, Empty, Select, Row, Col
} from 'antd'
import {
  PlayCircleOutlined,
  CalendarOutlined,
  SendOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SoundOutlined
} from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'
import type { Episode } from '@/types'

const { Title, Text } = Typography
const { Option } = Select

export default function PublishCalendar() {
  const navigate = useNavigate()
  const { episodes, seasons, sponsorSlots, teamMembers } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  const publishedEpisodes = episodes.filter(e => e.status === 'published')
  const readyEpisodes = episodes.filter(e => e.status === 'ready')
  const scheduledEpisodes = episodes.filter(e => e.publishDate && e.status !== 'published')

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD')
    const listData: { type: string; content: string; color: string; episode?: Episode }[] = []

    episodes.forEach(ep => {
      if (ep.publishDate === dateStr) {
        const color = ep.status === 'published' ? 'success' : 'processing'
        listData.push({
          type: ep.status === 'published' ? 'success' : 'warning',
          content: ep.title,
          color,
          episode: ep
        })
      }
      if (ep.deadline === dateStr && ep.status !== 'published') {
        listData.push({
          type: 'error',
          content: `截止: ${ep.title}`,
          color: 'error',
          episode: ep
        })
      }
    })

    sponsorSlots.forEach(slot => {
      if (slot.scheduledDate === dateStr) {
        listData.push({
          type: 'default',
          content: `赞助: ${slot.sponsorName}`,
          color: 'gold'
        })
      }
    })

    return listData
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.slice(0, 3).map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={<span style={{ fontSize: 11 }}>{item.content}</span>} />
          </li>
        ))}
        {listData.length > 3 && (
          <li>
            <Text type="secondary" style={{ fontSize: 11 }}>+{listData.length - 3} 更多</Text>
          </li>
        )}
      </ul>
    )
  }

  const onSelect = (value: Dayjs) => {
    setSelectedDate(value)
    setModalVisible(true)
  }

  const selectedDateData = selectedDate ? getListData(selectedDate) : []

  const upcomingPublish = [...scheduledEpisodes, ...readyEpisodes]
    .filter(ep => ep.publishDate)
    .sort((a, b) => dayjs(a.publishDate).valueOf() - dayjs(b.publishDate).valueOf())
    .slice(0, 8)

  return (
    <div>
      <Row gutter={16}>
        <Col span={18}>
          <Card
            title="发布日历"
            extra={
              <Space>
                <Button.Group>
                  <Button
                    type={viewMode === 'calendar' ? 'primary' : 'default'}
                    onClick={() => setViewMode('calendar')}
                    icon={<CalendarOutlined />}
                  >
                    日历视图
                  </Button>
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                    icon={<List />}
                  >
                    列表视图
                  </Button>
                </Button.Group>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部节目季</Option>
                  {seasons.map(s => (
                    <Option key={s.id} value={s.id}>{s.name}</Option>
                  ))}
                </Select>
              </Space>
            }
          >
            {viewMode === 'calendar' ? (
              <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
            ) : (
              <List
                dataSource={upcomingPublish}
                renderItem={episode => (
                  <List.Item
                    actions={[
                      <Button key="view" size="small" onClick={() => navigate(`/episode/${episode.id}`)}>
                        查看详情
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        episode.status === 'published'
                          ? <Avatar icon={<SendOutlined />} style={{ backgroundColor: '#52c41a' }} />
                          : <Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#faad14' }} />
                      }
                      title={
                        <Space>
                          <Tag color={episode.status === 'published' ? 'green' : 'blue'}>
                            {episode.status === 'published' ? '已发布' : '待发布'}
                          </Tag>
                          {episode.title}
                        </Space>
                      }
                      description={
                        <Space>
                          <CalendarOutlined />
                          <Text type="secondary">{episode.publishDate}</Text>
                          <Text type="secondary">·</Text>
                          <Text type="secondary">第{episode.episodeNumber}集</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col span={6}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="即将发布" size="small">
              {readyEpisodes.length === 0 ? (
                <Empty description="暂无待发布" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <List
                  size="small"
                  dataSource={readyEpisodes}
                  renderItem={episode => (
                    <List.Item onClick={() => navigate(`/episode/${episode.id}`)} style={{ cursor: 'pointer' }}>
                      <List.Item.Meta
                        avatar={<SoundOutlined style={{ color: '#52c41a' }} />}
                        title={<Text style={{ fontSize: 13 }}>{episode.title}</Text>}
                        description={<Text type="secondary" style={{ fontSize: 12 }}>{episode.publishDate}</Text>}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>

            <Card title="本月发布" size="small">
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: '#1677ff' }}>
                  {publishedEpisodes.filter(ep =>
                    dayjs(ep.publishDate).month() === dayjs().month()
                  ).length}
                </div>
                <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>期节目</div>
              </div>
            </Card>

            <Card title="本月赞助" size="small">
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: '#faad14' }}>
                  ¥{sponsorSlots
                    .filter(s => s.scheduledDate && dayjs(s.scheduledDate).month() === dayjs().month())
                    .reduce((sum, s) => sum + (s.cost || 0), 0)
                    .toLocaleString()}
                </div>
                <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>赞助收入</div>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>

      <Modal
        title={selectedDate?.format('YYYY年MM月DD日') || '日期详情'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={520}
      >
        {selectedDateData.length === 0 ? (
          <Empty description="当天无安排" />
        ) : (
          <List
            dataSource={selectedDateData}
            renderItem={item => (
              <List.Item
                actions={
                  item.episode
                    ? [<Button key="view" size="small" onClick={() => navigate(`/episode/${item.episode!.id}`)}>查看</Button>]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={<Badge status={item.type as any} />}
                  title={item.content}
                  description={
                    <Tag color={item.color as any}>
                      {item.type === 'success' ? '已发布' :
                       item.type === 'warning' ? '计划发布' :
                       item.type === 'error' ? '截止日期' : '赞助'}
                    </Tag>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  )
}
