import { useState } from 'react'
import {
  Card, Tabs, Table, Input, Select, Button, Space, Statistic,
  Row, Col, Tag, Progress, Empty, Modal, Form, DatePicker,
  Typography, Divider, message
} from 'antd'
import {
  SearchOutlined,
  BarChartOutlined,
  RiseOutlined,
  SoundOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExportOutlined,
  PlusOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAppStore } from '@/store/useAppStore'
import type { ListenData, Episode } from '@/types'

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

export default function StatisticsArchive() {
  const { episodes, listenData, sponsorSlots, seasons, topics, guests } = useAppStore()
  const [activeTab, setActiveTab] = useState('statistics')
  const [searchText, setSearchText] = useState('')
  const [dataModal, setDataModal] = useState(false)
  const [form] = Form.useForm()

  const publishedEpisodes = episodes.filter(e => e.status === 'published' || e.status === 'archived')

  const filteredEpisodes = publishedEpisodes.filter(e =>
    e.title.includes(searchText) ||
    e.topic.includes(searchText) ||
    e.description.includes(searchText)
  )

  const totalListens = listenData.reduce((sum, d) => sum + d.listens, 0)
  const totalListeners = listenData.reduce((sum, d) => sum + d.uniqueListeners, 0)
  const avgCompletion = listenData.length > 0
    ? (listenData.reduce((sum, d) => sum + d.completionRate, 0) / listenData.length * 100).toFixed(1)
    : '0'
  const totalSponsor = sponsorSlots.reduce((sum, s) => sum + (s.cost || 0), 0)

  const getEpisodeListenData = (episodeId: string) => {
    return listenData.filter(d => d.episodeId === episodeId)
  }

  const getTotalListensForEpisode = (episodeId: string) => {
    return listenData
      .filter(d => d.episodeId === episodeId)
      .reduce((sum, d) => sum + d.listens, 0)
  }

  const sortedByListens = [...publishedEpisodes]
    .map(ep => ({ ...ep, totalListens: getTotalListensForEpisode(ep.id) }))
    .sort((a, b) => b.totalListens - a.totalListens)

  const archiveColumns = [
    {
      title: '单集',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Episode) => (
        <Space>
          <SoundOutlined style={{ color: '#1677ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>第{record.episodeNumber}集 · {record.topic}</div>
          </div>
        </Space>
      )
    },
    {
      title: '节目季',
      dataIndex: 'seasonId',
      key: 'seasonId',
      width: 140,
      render: (seasonId: string) => {
        const season = seasons.find(s => s.id === seasonId)
        return <Tag color="blue">{season?.name || '-'}</Tag>
      }
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120
    },
    {
      title: '收听量',
      dataIndex: 'listens',
      key: 'listens',
      width: 120,
      render: (_: any, record: Episode) => (
        <Text strong>{getTotalListensForEpisode(record.id).toLocaleString()}</Text>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'default'}>
          {status === 'published' ? '已发布' : '已归档'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑数据</Button>
        </Space>
      )
    }
  ]

  const tabItems = [
    {
      key: 'statistics',
      label: '数据统计',
      children: (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总收听量"
                  value={totalListens}
                  valueStyle={{ color: '#1677ff' }}
                  prefix={<BarChartOutlined />}
                />
                <div style={{ marginTop: 8, color: '#52c41a', fontSize: 12 }}>
                  <RiseOutlined /> 本月增长 12.5%
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="独立听众"
                  value={totalListeners}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均完播率"
                  value={avgCompletion}
                  suffix="%"
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已发布节目"
                  value={publishedEpisodes.length}
                  valueStyle={{ color: '#fa8c16' }}
                  prefix={<SoundOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Card
                title="节目排名（按收听量）"
                extra={<Button size="small">查看全部</Button>}
              >
                {sortedByListens.length === 0 ? (
                  <Empty description="暂无数据" />
                ) : (
                  <ListLikeRanking data={sortedByListens.slice(0, 5)} />
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="赞助收入统计">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 36, fontWeight: 600, color: '#faad14' }}>
                    ¥{totalSponsor.toLocaleString()}
                  </div>
                  <div style={{ color: '#999', marginTop: 4 }}>累计赞助收入</div>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div>
                  <Text type="secondary">本月赞助</Text>
                  <div style={{ marginTop: 4 }}>
                    <Progress
                      percent={65}
                      status="active"
                      strokeColor="#faad14"
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
                    <span>¥{Math.round(totalSponsor * 0.65).toLocaleString()}</span>
                    <span>目标 ¥{Math.round(totalSponsor * 1.5).toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Card
            title="平台数据分布"
            extra={
              <Space>
                <RangePicker />
                <Button icon={<ExportOutlined />}>导出报表</Button>
              </Space>
            }
          >
            <PlatformDataTable data={listenData} />
          </Card>
        </Space>
      )
    },
    {
      key: 'archive',
      label: '归档搜索',
      children: (
        <Card
          title="节目归档"
          extra={
            <Space>
              <Search
                placeholder="搜索节目名称/主题"
                style={{ width: 280 }}
                allowClear
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
              <Select placeholder="节目季" style={{ width: 160 }} allowClear>
                {seasons.map(s => (
                  <Option key={s.id} value={s.id}>{s.name}</Option>
                ))}
              </Select>
              <Select placeholder="年份" style={{ width: 120 }} allowClear>
                <Option value="2024">2024年</Option>
                <Option value="2023">2023年</Option>
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setDataModal(true)}>
                录入数据
              </Button>
            </Space>
          }
        >
          {filteredEpisodes.length === 0 ? (
            <Empty description="未找到匹配的节目" />
          ) : (
            <Table
              columns={archiveColumns}
              dataSource={filteredEpisodes}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      )
    },
    {
      key: 'listenData',
      label: '收听数据录入',
      children: (
        <Card
          title="收听数据管理"
          extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setDataModal(true)}>新增数据</Button>}
        >
          <ListenDataTable data={listenData} episodes={episodes} />
        </Card>
      )
    }
  ]

  return (
    <div>
      <Card bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
        />
      </Card>

      <Modal
        title="录入收听数据"
        open={dataModal}
        onCancel={() => setDataModal(false)}
        onOk={() => { setDataModal(false); message.success('数据已录入') }}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="episodeId" label="选择单集" rules={[{ required: true }]}>
            <Select placeholder="请选择单集">
              {publishedEpisodes.map(ep => (
                <Option key={ep.id} value={ep.id}>{ep.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select placeholder="请选择平台">
              <Option value="小宇宙">小宇宙</Option>
              <Option value="喜马拉雅">喜马拉雅</Option>
              <Option value="Apple Podcasts">Apple Podcasts</Option>
              <Option value="网易云音乐">网易云音乐</Option>
              <Option value="QQ音乐">QQ音乐</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="listens" label="收听量" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入收听量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uniqueListeners" label="独立听众" rules={[{ required: true }]}>
                <Input type="number" placeholder="请输入独立听众数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="avgListenDuration" label="平均收听时长(秒)">
                <Input type="number" placeholder="秒" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="completionRate" label="完播率(%)">
                <Input type="number" placeholder="0-100" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="date" label="数据日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

function ListLikeRanking({ data }: { data: (Episode & { totalListens: number })[] }) {
  const maxListens = Math.max(...data.map(d => d.totalListens), 1)

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      {data.map((item, index) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: index < 3 ? ['#f5222d', '#fa8c16', '#faad14'][index] : '#d9d9d9',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {index + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text ellipsis style={{ maxWidth: 300 }}>{item.title}</Text>
              <Text strong>{item.totalListens.toLocaleString()}</Text>
            </div>
            <Progress
              percent={Math.round((item.totalListens / maxListens) * 100)}
              size="small"
              showInfo={false}
              strokeColor={index < 3 ? '#1677ff' : '#d9d9d9'}
            />
          </div>
        </div>
      ))}
    </Space>
  )
}

function PlatformDataTable({ data }: { data: ListenData[] }) {
  const platformMap: Record<string, { listens: number; unique: number; completion: number; count: number }> = {}

  data.forEach(d => {
    if (!platformMap[d.platform]) {
      platformMap[d.platform] = { listens: 0, unique: 0, completion: 0, count: 0 }
    }
    platformMap[d.platform].listens += d.listens
    platformMap[d.platform].unique += d.uniqueListeners
    platformMap[d.platform].completion += d.completionRate
    platformMap[d.platform].count += 1
  })

  const platforms = Object.entries(platformMap).map(([name, stats]) => ({
    name,
    ...stats,
    avgCompletion: stats.count > 0 ? (stats.completion / stats.count * 100).toFixed(1) + '%' : '0%'
  }))

  return (
    <Table
      size="small"
      dataSource={platforms}
      rowKey="name"
      pagination={false}
      columns={[
        { title: '平台', dataIndex: 'name', key: 'name', width: 140 },
        {
          title: '收听量',
          dataIndex: 'listens',
          key: 'listens',
          render: (v: number) => <Text strong>{v.toLocaleString()}</Text>
        },
        { title: '独立听众', dataIndex: 'unique', key: 'unique', render: (v: number) => v.toLocaleString() },
        { title: '平均完播率', dataIndex: 'avgCompletion', key: 'avgCompletion' },
        {
          title: '占比',
          key: 'percent',
          render: (_: any, record: any) => {
            const total = platforms.reduce((sum, p) => sum + p.listens, 0)
            const percent = total > 0 ? Math.round((record.listens / total) * 100) : 0
            return (
              <Progress percent={percent} size="small" showInfo={false} />
            )
          }
        }
      ]}
    />
  )
}

function ListenDataTable({ data, episodes }: { data: ListenData[]; episodes: Episode[] }) {
  return (
    <Table
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      columns={[
        {
          title: '单集',
          dataIndex: 'episodeId',
          key: 'episodeId',
          render: (id: string) => episodes.find(e => e.id === id)?.title || '-'
        },
        { title: '平台', dataIndex: 'platform', key: 'platform', width: 120 },
        {
          title: '收听量',
          dataIndex: 'listens',
          key: 'listens',
          width: 100,
          render: (v: number) => v.toLocaleString()
        },
        {
          title: '独立听众',
          dataIndex: 'uniqueListeners',
          key: 'uniqueListeners',
          width: 100,
          render: (v: number) => v.toLocaleString()
        },
        {
          title: '平均时长',
          dataIndex: 'avgListenDuration',
          key: 'avgListenDuration',
          width: 100,
          render: (v: number) => {
            const mins = Math.floor(v / 60)
            const secs = v % 60
            return `${mins}:${secs.toString().padStart(2, '0')}`
          }
        },
        {
          title: '完播率',
          dataIndex: 'completionRate',
          key: 'completionRate',
          width: 100,
          render: (v: number) => `${(v * 100).toFixed(0)}%`
        },
        { title: '数据日期', dataIndex: 'date', key: 'date', width: 120 },
        {
          title: '操作',
          key: 'action',
          width: 120,
          render: () => (
            <Space>
              <Button type="link" size="small">编辑</Button>
              <Button type="link" size="small" danger>删除</Button>
            </Space>
          )
        }
      ]}
    />
  )
}
