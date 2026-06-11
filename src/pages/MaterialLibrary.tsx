import { useState } from 'react'
import {
  Card, Input, Button, Row, Col, Tag, Space, Modal, Form,
  Select, Upload, Empty, message, Drawer, Typography, Divider
} from 'antd'
import {
  UploadOutlined,
  SearchOutlined,
  SoundOutlined,
  PictureOutlined,
  FileTextOutlined,
  FolderOutlined,
  FilterOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useAppStore } from '@/store/useAppStore'
import type { Material } from '@/types'

const { Search } = Input
const { Option } = Select
const { Title, Text, Paragraph } = Typography

export default function MaterialLibrary() {
  const { materials, addMaterial, episodes } = useAppStore()
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [episodeFilter, setEpisodeFilter] = useState<string>('all')
  const [uploadModal, setUploadModal] = useState(false)
  const [detailDrawer, setDetailDrawer] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [form] = Form.useForm()
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const detectType = (mimeType: string, fileName: string): 'audio' | 'image' | 'document' | 'video' | 'other' => {
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      mimeType.includes('text/') ||
      /\.(docx?|xlsx?|pptx?|pdf|txt|md|csv)$/i.test(fileName)
    ) return 'document'
    if (/\.(mp3|wav|flac|aac|ogg|m4a)$/i.test(fileName)) return 'audio'
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(fileName)) return 'image'
    if (/\.(mp4|mov|avi|mkv|webm)$/i.test(fileName)) return 'video'
    if (/\.(pdf|docx?|xlsx?|pptx?|txt|md)$/i.test(fileName)) return 'document'
    return 'other'
  }

  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.includes(searchText) || m.tags.some(t => t.includes(searchText))
    const matchType = typeFilter === 'all' || m.type === typeFilter
    const matchEpisode = episodeFilter === 'all' || m.episodeId === episodeFilter
    return matchSearch && matchType && matchEpisode
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <SoundOutlined style={{ fontSize: 36, color: '#1677ff' }} />
      case 'image': return <PictureOutlined style={{ fontSize: 36, color: '#52c41a' }} />
      case 'document': return <FileTextOutlined style={{ fontSize: 36, color: '#faad14' }} />
      case 'video': return <FolderOutlined style={{ fontSize: 36, color: '#722ed1' }} />
      default: return <FolderOutlined style={{ fontSize: 36, color: '#8c8c8c' }} />
    }
  }

  const getTypeName = (type: string) => {
    const map: Record<string, string> = {
      audio: '音频',
      image: '图片',
      document: '文档',
      video: '视频',
      other: '其他'
    }
    return map[type] || type
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleView = (material: Material) => {
    setSelectedMaterial(material)
    setDetailDrawer(true)
  }

  const handleUpload = async () => {
    try {
      setSubmitting(true)
      const values = await form.validateFields()
      if (selectedFiles.length === 0) {
        message.error('请先选择或拖入文件')
        return
      }
      selectedFiles.forEach(file => {
        const fileType = detectType(file.type || '', file.name)
        addMaterial({
          name: file.name,
          type: values.type || fileType,
          filePath: file.path || URL.createObjectURL(file) || '/materials/' + file.name,
          fileSize: file.size,
          duration: fileType === 'audio' ? undefined : undefined,
          tags: values.tags || [],
          episodeId: values.episodeId,
          importedBy: 'm1',
          description: values.description || ''
        })
      })
      setUploadModal(false)
      setSelectedFiles([])
      form.resetFields()
      message.success(`成功导入 ${selectedFiles.length} 个素材`)
    } catch (err) {
      if (selectedFiles.length === 0) {
        message.error('请先选择或拖入文件')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleFilesSelected = (fileList: any[]) => {
    setSelectedFiles(fileList)
    if (fileList.length > 0) {
      const firstFile = fileList[0]
      const detectedType = detectType(firstFile.type || '', firstFile.name)
      form.setFieldsValue({
        type: detectedType
      })
    }
  }

  const typeStats = {
    all: materials.length,
    audio: materials.filter(m => m.type === 'audio').length,
    image: materials.filter(m => m.type === 'image').length,
    document: materials.filter(m => m.type === 'document').length,
    video: materials.filter(m => m.type === 'video').length,
    other: materials.filter(m => m.type === 'other').length
  }

  return (
    <div>
      <Card
        title="素材库"
        extra={
          <Space>
            <Search
              placeholder="搜索素材名称/标签"
              style={{ width: 240 }}
              allowClear
              onSearch={value => setSearchText(value)}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 120 }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">全部 ({typeStats.all})</Option>
              <Option value="audio">音频 ({typeStats.audio})</Option>
              <Option value="image">图片 ({typeStats.image})</Option>
              <Option value="document">文档 ({typeStats.document})</Option>
              <Option value="video">视频 ({typeStats.video})</Option>
              <Option value="other">其他</Option>
            </Select>
            <Select
              value={episodeFilter}
              onChange={setEpisodeFilter}
              style={{ width: 160 }}
              placeholder="按单集筛选"
              allowClear
            >
              <Option value="all">全部单集</Option>
              {episodes.map(ep => (
                <Option key={ep.id} value={ep.id}>第{ep.episodeNumber}集 · {ep.title}</Option>
              ))}
            </Select>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModal(true)}>
              导入素材
            </Button>
          </Space>
        }
      >
        {filteredMaterials.length === 0 ? (
          <Empty description="暂无素材" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredMaterials.map(material => (
              <Col span={4} key={material.id}>
                <Card
                  hoverable
                  size="small"
                  onClick={() => handleView(material)}
                  className="episode-card"
                  cover={
                    <div
                      style={{
                        height: 100,
                        background: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getTypeIcon(material.type)}
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <Text
                        ellipsis={{ tooltip: material.name }}
                        style={{ fontSize: 13, fontWeight: 500 }}
                      >
                        {material.name}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Tag color="blue" style={{ fontSize: 11 }}>{getTypeName(material.type)}</Tag>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {formatFileSize(material.fileSize)}
                          </Text>
                        </div>
                        {material.duration && (
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            时长：{formatDuration(material.duration)}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <Modal
        title="导入素材"
        open={uploadModal}
        onOk={handleUpload}
        onCancel={() => { setUploadModal(false); setSelectedFiles([]); form.resetFields() }}
        width={560}
        okText="确认导入"
        cancelText="取消"
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="选择文件" required>
            <Upload.Dragger
              multiple
              fileList={selectedFiles.map((f, i) => ({
                uid: String(i),
                name: f.name,
                size: f.size,
                type: f.type,
                originFileObj: f,
                status: 'done'
              }))}
              onChange={(info) => {
                const files = info.fileList.map((f: any) => f.originFileObj || f)
                handleFilesSelected(files.filter(Boolean))
              }}
              beforeUpload={() => {
                return false
              }}
              showUploadList={{
                showSize: true,
                showType: true
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处</p>
              <p className="ant-upload-hint">支持音频、图片、文档、视频等多种格式，名称和类型将自动识别</p>
            </Upload.Dragger>
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4, fontSize: 12 }}>
                <div>
                  已选择 <strong style={{ color: '#1677ff' }}>{selectedFiles.length}</strong> 个文件，
                  共 <strong>{formatFileSize(selectedFiles.reduce((s, f) => s + f.size, 0))}</strong>
                </div>
                {selectedFiles.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ color: '#666', fontSize: 11 }}>
                    · {f.name} ({formatFileSize(f.size)})
                  </div>
                ))}
                {selectedFiles.length > 3 && (
                  <div style={{ color: '#999', fontSize: 11 }}>
                    ... 还有 {selectedFiles.length - 3} 个文件
                  </div>
                )}
              </div>
            )}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="素材类型"
                rules={[{ required: true, message: '请选择素材类型' }]}
              >
                <Select placeholder="请选择类型">
                  <Option value="audio">音频</Option>
                  <Option value="image">图片</Option>
                  <Option value="document">文档</Option>
                  <Option value="video">视频</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="episodeId" label="关联单集">
                <Select placeholder="选择关联的单集（可选）" allowClear>
                  {episodes.map(ep => (
                    <Option key={ep.id} value={ep.id}>第{ep.episodeNumber}集 · {ep.title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后按回车添加（可选）" />
          </Form.Item>
          <Form.Item name="description" label="备注说明">
            <Input.TextArea rows={2} placeholder="请输入备注（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="素材详情"
        width={480}
        open={detailDrawer}
        onClose={() => setDetailDrawer(false)}
      >
        {selectedMaterial && (
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div
              style={{
                height: 180,
                background: '#f5f5f5',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                {getTypeIcon(selectedMaterial.type)}
                <div style={{ marginTop: 12, fontWeight: 500 }}>{selectedMaterial.name}</div>
              </div>
            </div>

            <Divider style={{ margin: 0 }} />

            <div>
              <Title level={5} style={{ marginBottom: 12 }}>基本信息</Title>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">类型</Text>
                  <Tag color="blue">{getTypeName(selectedMaterial.type)}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">文件大小</Text>
                  <Text>{formatFileSize(selectedMaterial.fileSize)}</Text>
                </div>
                {selectedMaterial.duration && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">时长</Text>
                    <Text>{formatDuration(selectedMaterial.duration)}</Text>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">导入时间</Text>
                  <Text>{selectedMaterial.importedAt}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">导入人</Text>
                  <Text>-</Text>
                </div>
              </Space>
            </div>

            <div>
              <Title level={5} style={{ marginBottom: 12 }}>标签</Title>
              <Space wrap>
                {selectedMaterial.tags.length > 0
                  ? selectedMaterial.tags.map(tag => <Tag key={tag}>{tag}</Tag>)
                  : <Text type="secondary">暂无标签</Text>
                }
              </Space>
            </div>

            {selectedMaterial.description && (
              <div>
                <Title level={5} style={{ marginBottom: 12 }}>描述</Title>
                <Paragraph style={{ color: '#666' }}>{selectedMaterial.description}</Paragraph>
              </div>
            )}

            <Space>
              <Button icon={<EyeOutlined />}>预览</Button>
              <Button icon={<DownloadOutlined />}>下载</Button>
              <Button danger icon={<DeleteOutlined />}>删除</Button>
            </Space>
          </Space>
        )}
      </Drawer>
    </div>
  )
}
