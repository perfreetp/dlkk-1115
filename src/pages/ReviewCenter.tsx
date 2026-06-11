import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card, Tabs, List, Avatar, Tag, Space, Button, Input,
  Empty, message, Badge, Select, Row, Col, Statistic, Typography
} from 'antd'
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  FilterOutlined,
  EyeOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'

const { Option } = Select
const { Text } = Typography

export default function ReviewCenter() {
  const navigate = useNavigate()
  const { reviewComments, episodes, teamMembers, updateEpisode, resolveReviewComment } = useAppStore()
  const [activeTab, setActiveTab] = useState('pending')
  const [episodeFilter, setEpisodeFilter] = useState('all')

  const reviewingEpisodes = episodes.filter(e => e.status === 'reviewing')
  const pendingComments = reviewComments.filter(c => c.status === 'open')
  const resolvedComments = reviewComments.filter(c => c.status === 'resolved')

  const filteredPendingComments = pendingComments.filter(c =>
    episodeFilter === 'all' || c.episodeId === episodeFilter
  )

  const handlePass = (episodeId: string) => {
    updateEpisode(episodeId, { status: 'ready' })
    message.success('审核通过，已移入待发布')
  }

  const handleReject = (episodeId: string) => {
    updateEpisode(episodeId, { status: 'editing' })
    message.success('已退回剪辑')
  }

  const reviewStat = {
    reviewing: reviewingEpisodes.length,
    pendingComments: pendingComments.length,
    resolvedComments: resolvedComments.length
  }

  const tabItems = [
    {
      key: 'pending',
      label: `待审核 (${reviewingEpisodes.length})`,
      children: (
        <Card>
          {reviewingEpisodes.length === 0 ? (
            <Empty description="暂无待审核单集" />
          ) : (
            <List
              dataSource={reviewingEpisodes}
              renderItem={episode => {
                const episodeComments = reviewComments.filter(
                  c => c.episodeId === episode.id && c.status === 'open'
                )
                const season = episodes.find(e => e.id === episode.id)
                return (
                  <List.Item
                    actions={[
                      <Button key="view" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/episode/${episode.id}`)}>
                        查看
                      </Button>,
                      <Button key="reject" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(episode.id)}>
                        退回
                      </Button>,
                      <Button key="pass" size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handlePass(episode.id)}>
                        通过
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Badge count={episodeComments.length} offset={[6, -2]}><Avatar icon={<MessageOutlined />} /></Badge>}
                      title={
                        <Space>
                          <Tag color="gold">审核中</Tag>
                          {episode.title}
                        </Space>
                      }
                      description={
                        <Space>
                          <span>第{episode.episodeNumber}集</span>
                          <span>·</span>
                          <span>{episode.topic}</span>
                          <span>·</span>
                          <span style={{ color: '#999' }}>
                            提交于 {dayjs(episode.updatedAt).format('MM-DD HH:mm')}
                          </span>
                        </Space>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          )}
        </Card>
      )
    },
    {
      key: 'comments',
      label: `评论意见 (${pendingComments.length})`,
      children: (
        <Card
          extra={
            <Select
              value={episodeFilter}
              onChange={setEpisodeFilter}
              style={{ width: 200 }}
              prefix={<FilterOutlined />}
              allowClear
            >
              <Option value="all">全部单集</Option>
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>第{ep.episodeNumber}集 · {ep.title}</Option>
              ))}
            </Select>
          }
        >
          {filteredPendingComments.length === 0 ? (
            <Empty description="暂无待处理评论" />
          ) : (
            <List
              dataSource={filteredPendingComments}
              renderItem={comment => {
                const reviewer = teamMembers.find(m => m.id === comment.reviewer)
                const episode = episodes.find(e => e.id === comment.episodeId)
                return (
                  <List.Item
                    actions={[
                      <Button key="resolve" size="small" type="primary" onClick={() => resolveReviewComment(comment.id)}>
                        标记解决
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{reviewer?.name || '未知'}</Text>
                          <Tag color="red">待处理</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(comment.createdAt).format('MM-DD HH:mm')}
                          </Text>
                        </Space>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: 4 }}>
                            <Tag color="blue">{episode?.title || '未知单集'}</Tag>
                          </div>
                          {comment.content}
                        </div>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          )}
        </Card>
      )
    },
    {
      key: 'resolved',
      label: `已解决 (${resolvedComments.length})`,
      children: (
        <Card>
          {resolvedComments.length === 0 ? (
            <Empty description="暂无已解决评论" />
          ) : (
            <List
              dataSource={resolvedComments}
              renderItem={comment => {
                const reviewer = teamMembers.find(m => m.id === comment.reviewer)
                const episode = episodes.find(e => e.id === comment.episodeId)
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} style={{ opacity: 0.5 }} />}
                      title={
                        <Space>
                          <Text style={{ color: '#999' }}>{reviewer?.name || '未知'}</Text>
                          <Tag color="green">已解决</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(comment.createdAt).format('MM-DD HH:mm')}
                          </Text>
                        </Space>
                      }
                      description={
                        <div style={{ color: '#999' }}>
                          <div style={{ marginBottom: 4 }}>
                            <Tag color="default">{episode?.title || '未知单集'}</Tag>
                          </div>
                          {comment.content}
                        </div>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          )}
        </Card>
      )
    }
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="待审核单集"
              value={reviewStat.reviewing}
              valueStyle={{ color: '#faad14' }}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="待处理意见"
              value={reviewStat.pendingComments}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="已解决"
              value={reviewStat.resolvedComments}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
        />
      </Card>
    </div>
  )
}
