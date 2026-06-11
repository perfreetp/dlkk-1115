import { useState } from 'react'
import {
  Card, Input, Button, Table, Tag, Avatar, Space, Modal, Form,
  Select, Row, Col, Descriptions, Empty, message, Drawer
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import { useAppStore } from '@/store/useAppStore'
import type { Guest } from '@/types'

const { Search } = Input
const { TextArea } = Input
const { Option } = Select

export default function GuestLibrary() {
  const { guests, addGuest, updateGuest, episodes } = useAppStore()
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState<string | null>(null)

  const filteredGuests = guests.filter(g =>
    g.name.includes(searchText) ||
    g.company.includes(searchText) ||
    g.tags.some(tag => tag.includes(searchText))
  )

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id)
    form.setFieldsValue(guest)
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingId) {
        updateGuest(editingId, values)
        message.success('嘉宾信息已更新')
      } else {
        addGuest({
          ...values,
          episodeCount: 0,
          socialLinks: [],
          tags: values.tags || []
        })
        message.success('嘉宾已添加')
      }
      setModalVisible(false)
      form.resetFields()
    })
  }

  const handleView = (guest: Guest) => {
    setSelectedGuest(guest)
    setDrawerVisible(true)
  }

  const guestEpisodes = selectedGuest
    ? episodes.filter(e => e.guestId === selectedGuest.id)
    : []

  const columns = [
    {
      title: '嘉宾',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Guest) => (
        <Space onClick={() => handleView(record)} style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.title}</div>
          </div>
        </Space>
      )
    },
    { title: '公司', dataIndex: 'company', key: 'company' },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.slice(0, 3).map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
          {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
        </Space>
      )
    },
    {
      title: '往期节目',
      dataIndex: 'episodeCount',
      key: 'episodeCount',
      width: 100,
      render: (count: number) => <Tag color="green">{count} 期</Tag>
    },
    {
      title: '最近出场',
      dataIndex: 'lastAppearance',
      key: 'lastAppearance',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Guest) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card
        title="嘉宾库"
        extra={
          <Space>
            <Search
              placeholder="搜索嘉宾姓名/公司/标签"
              style={{ width: 280 }}
              allowClear
              onSearch={value => setSearchText(value)}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加嘉宾
            </Button>
          </Space>
        }
      >
        {filteredGuests.length === 0 ? (
          <Empty description="暂无嘉宾" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredGuests}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title={editingId ? '编辑嘉宾' : '添加嘉宾'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="职位" rules={[{ required: true }]}>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="company" label="公司" rules={[{ required: true }]}>
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱">
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="电话">
                <Input prefix={<PhoneOutlined />} placeholder="请输入电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="website" label="个人网站">
            <Input prefix={<GlobalOutlined />} placeholder="请输入网站地址" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后按回车添加" />
          </Form.Item>
          <Form.Item name="bio" label="简介">
            <TextArea rows={3} placeholder="请输入嘉宾简介" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="嘉宾详情"
        width={560}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedGuest && (
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 4 }}>{selectedGuest.name}</h3>
              <p style={{ color: '#666', margin: 0 }}>
                {selectedGuest.title} @ {selectedGuest.company}
              </p>
              <Space wrap style={{ marginTop: 8, justifyContent: 'center' }}>
                {selectedGuest.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="邮箱">{selectedGuest.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="电话">{selectedGuest.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="网站">{selectedGuest.website || '-'}</Descriptions.Item>
              <Descriptions.Item label="往期节目">{selectedGuest.episodeCount} 期</Descriptions.Item>
              <Descriptions.Item label="最近出场">{selectedGuest.lastAppearance || '-'}</Descriptions.Item>
            </Descriptions>

            <div>
              <h4 style={{ marginBottom: 8 }}>简介</h4>
              <p style={{ color: '#666' }}>{selectedGuest.bio || '暂无'}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: 8 }}>备注</h4>
              <p style={{ color: '#666' }}>{selectedGuest.notes || '暂无'}</p>
            </div>

            <div>
              <h4 style={{ marginBottom: 8 }}>往期节目 ({guestEpisodes.length})</h4>
              {guestEpisodes.length === 0 ? (
                <Empty description="暂无节目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  {guestEpisodes.map(ep => (
                    <Card key={ep.id} size="small" hoverable>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{ep.title}</span>
                        <Tag color="blue">第{ep.episodeNumber}集</Tag>
                      </div>
                    </Card>
                  ))}
                </Space>
              )}
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  )
}
