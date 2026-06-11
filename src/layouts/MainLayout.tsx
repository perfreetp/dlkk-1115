import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  FolderOutlined,
  SoundOutlined,
  AuditOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '节目看板' },
  { key: '/guests', icon: <UserOutlined />, label: '嘉宾库' },
  { key: '/materials', icon: <FolderOutlined />, label: '素材库' },
  { key: '/review', icon: <AuditOutlined />, label: '审核中心' },
  { key: '/publish', icon: <CalendarOutlined />, label: '发布日历' },
  { key: '/statistics', icon: <BarChartOutlined />, label: '统计归档' }
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { teamMembers } = useAppStore()

  const selectedKey = location.pathname.startsWith('/episode')
    ? '/dashboard'
    : location.pathname

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人资料' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }
  ]

  const currentUser = teamMembers[0]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="dark">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 1
        }}>
          <SoundOutlined style={{ marginRight: 8, fontSize: 22 }} />
          播客工作室
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)'
        }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#262626' }}>
            {menuItems.find(item => item.key === selectedKey)?.label || '节目看板'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#666', cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}>
                <Avatar size={32} icon={<UserOutlined />} />
                <span style={{ color: '#262626' }}>{currentUser?.name}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{
          margin: 16,
          padding: 24,
          background: '#fff',
          borderRadius: 8,
          minHeight: 'calc(100vh - 112px)',
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
