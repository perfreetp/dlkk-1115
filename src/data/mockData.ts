import type {
  Season, Episode, Topic, Guest, InterviewOutline, RecordingItem,
  Material, ClipMarker, MistakeRecord, EditTodo, CopyrightMusic,
  CoverDraft, Copywriting, TimelineNote, ReviewComment,
  PublishChecklist, ListenData, SponsorSlot, TeamMember, Task
} from '@/types'

export const mockData = {
  seasons: [
    {
      id: 's1',
      name: '创业访谈录 第三季',
      description: '深度对话创业者，分享创业路上的酸甜苦辣',
      status: 'recording',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      episodeCount: 12,
      tags: ['创业', '商业', '科技']
    },
    {
      id: 's2',
      name: '科技前沿 第二季',
      description: '探索最新科技趋势，解读行业动态',
      status: 'planning',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
      episodeCount: 24,
      tags: ['科技', 'AI', '互联网']
    },
    {
      id: 's3',
      name: '生活美学 第一季',
      description: '发现生活中的美好，提升生活品质',
      status: 'completed',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      episodeCount: 10,
      tags: ['生活', '文化', '艺术']
    }
  ] as Season[],

  episodes: [
    {
      id: 'ep1',
      seasonId: 's1',
      episodeNumber: 1,
      title: 'AI时代的创业机会',
      subtitle: '大模型浪潮下的新机遇与挑战',
      status: 'editing',
      deadline: '2024-06-15',
      publishDate: '2024-06-20',
      assignees: ['m1', 'm2'],
      guestId: 'g1',
      topic: 'AI创业',
      description: '探讨AI技术如何改变创业格局',
      duration: 3600,
      createdAt: '2024-05-01T00:00:00Z',
      updatedAt: '2024-06-10T00:00:00Z'
    },
    {
      id: 'ep2',
      seasonId: 's1',
      episodeNumber: 2,
      title: '从0到1打造产品',
      subtitle: '产品经理的成长之路',
      status: 'recording',
      deadline: '2024-06-25',
      assignees: ['m1', 'm3'],
      guestId: 'g2',
      topic: '产品思维',
      description: '分享产品开发的方法论',
      createdAt: '2024-05-10T00:00:00Z',
      updatedAt: '2024-06-08T00:00:00Z'
    },
    {
      id: 'ep3',
      seasonId: 's1',
      episodeNumber: 3,
      title: 'B2B SaaS的增长密码',
      status: 'planning',
      deadline: '2024-07-10',
      assignees: ['m2'],
      topic: 'SaaS增长',
      description: '拆解B2B SaaS公司的增长策略',
      createdAt: '2024-05-20T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 'ep4',
      seasonId: 's1',
      episodeNumber: 4,
      title: '远程团队管理',
      status: 'idea',
      deadline: '2024-07-20',
      assignees: ['m3'],
      topic: '远程办公',
      description: '如何高效管理远程团队',
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z'
    },
    {
      id: 'ep5',
      seasonId: 's1',
      episodeNumber: 5,
      title: '品牌建设之道',
      status: 'reviewing',
      deadline: '2024-06-18',
      publishDate: '2024-06-22',
      assignees: ['m1', 'm2', 'm3'],
      guestId: 'g3',
      topic: '品牌营销',
      description: '初创公司如何打造强品牌',
      duration: 4200,
      createdAt: '2024-04-15T00:00:00Z',
      updatedAt: '2024-06-11T00:00:00Z'
    },
    {
      id: 'ep6',
      seasonId: 's1',
      episodeNumber: 6,
      title: '融资攻略',
      status: 'published',
      deadline: '2024-05-20',
      publishDate: '2024-05-25',
      assignees: ['m1'],
      guestId: 'g4',
      topic: '融资',
      description: '创业者的融资必修课',
      duration: 3900,
      createdAt: '2024-04-01T00:00:00Z',
      updatedAt: '2024-05-25T00:00:00Z'
    },
    {
      id: 'ep7',
      seasonId: 's2',
      episodeNumber: 1,
      title: '大模型技术解析',
      status: 'ready',
      deadline: '2024-06-20',
      publishDate: '2024-06-25',
      assignees: ['m2', 'm3'],
      guestId: 'g5',
      topic: 'AI技术',
      description: '深入了解大模型的技术原理',
      duration: 4500,
      createdAt: '2024-05-01T00:00:00Z',
      updatedAt: '2024-06-10T00:00:00Z'
    },
    {
      id: 'ep8',
      seasonId: 's3',
      episodeNumber: 1,
      title: '咖啡文化之旅',
      status: 'published',
      deadline: '2023-12-01',
      publishDate: '2023-12-05',
      assignees: ['m3'],
      topic: '咖啡',
      description: '探索世界各地的咖啡文化',
      duration: 3200,
      createdAt: '2023-11-01T00:00:00Z',
      updatedAt: '2023-12-05T00:00:00Z'
    }
  ] as Episode[],

  topics: [
    { id: 't1', title: 'AI创业的下一个风口', description: '探讨AI技术在各行业的应用机会', source: '团队讨论', author: 'm1', status: 'approved', priority: 'high', tags: ['AI', '创业'], createdAt: '2024-06-01T00:00:00Z', episodeId: 'ep1' },
    { id: 't2', title: '产品经理的核心能力模型', description: '优秀产品经理需要具备哪些能力', source: '听众建议', author: 'm2', status: 'approved', priority: 'medium', tags: ['产品', '职业发展'], createdAt: '2024-06-02T00:00:00Z', episodeId: 'ep2' },
    { id: 't3', title: 'SaaS公司的增长策略', description: 'B2B SaaS如何实现持续增长', source: '嘉宾推荐', author: 'm1', status: 'pending', priority: 'high', tags: ['SaaS', '增长'], createdAt: '2024-06-03T00:00:00Z' },
    { id: 't4', title: '远程办公的效率提升', description: '如何在远程模式下保持高效', source: '内部讨论', author: 'm3', status: 'pending', priority: 'medium', tags: ['远程办公', '效率'], createdAt: '2024-06-04T00:00:00Z' },
    { id: 't5', title: '用户增长的底层逻辑', description: '用户增长的核心方法论', source: '书籍启发', author: 'm2', status: 'rejected', priority: 'low', tags: ['增长', '用户运营'], createdAt: '2024-06-05T00:00:00Z' },
    { id: 't6', title: 'Web3的未来展望', description: 'Web3技术的发展趋势和应用', source: '行业观察', author: 'm1', status: 'pending', priority: 'medium', tags: ['Web3', '区块链'], createdAt: '2024-06-06T00:00:00Z' },
    { id: 't7', title: '设计思维在产品中的应用', description: '如何用设计思维打造好产品', source: '课程学习', author: 'm3', status: 'approved', priority: 'medium', tags: ['设计', '产品'], createdAt: '2024-06-07T00:00:00Z' }
  ] as Topic[],

  guests: [
    {
      id: 'g1',
      name: '张明',
      title: '创始人&CEO',
      company: '智云科技',
      bio: '连续创业者，曾创立两家成功退出，专注AI领域10年',
      email: 'zhangming@zhiyun.ai',
      phone: '13800138001',
      website: 'https://zhiyun.ai',
      socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/zhangming' }],
      tags: ['AI', '创业', '技术'],
      episodeCount: 3,
      lastAppearance: '2024-03-15',
      notes: '表达能力强，观点独到，适合深度对话',
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 'g2',
      name: '李华',
      title: '产品副总裁',
      company: '星辰产品学院',
      bio: '前腾讯高级产品总监，15年产品经验',
      email: 'lihua@star.edu',
      socialLinks: [{ platform: '知乎', url: 'https://zhihu.com/people/lihua' }],
      tags: ['产品', '互联网', '方法论'],
      episodeCount: 2,
      lastAppearance: '2024-04-20',
      notes: '擅长产品方法论分享，案例丰富',
      createdAt: '2024-02-15T00:00:00Z'
    },
    {
      id: 'g3',
      name: '王芳',
      title: '品牌总监',
      company: '造点品牌咨询',
      bio: '品牌营销专家，服务过多家知名品牌',
      email: 'wangfang@zaodian.com',
      socialLinks: [{ platform: '微博', url: 'https://weibo.com/wangfang' }],
      tags: ['品牌', '营销'],
      episodeCount: 1,
      notes: '沟通顺畅，故事性强',
      createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 'g4',
      name: '陈强',
      title: '合伙人',
      company: '红杉资本',
      bio: '资深投资人，专注早期科技项目',
      email: 'chenqiang@sequoia.com',
      socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/chenqiang' }],
      tags: ['投资', '融资', '创业'],
      episodeCount: 4,
      lastAppearance: '2024-05-10',
      notes: '投资视角独特，干货很多',
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      id: 'g5',
      name: '刘洋',
      title: '首席科学家',
      company: '深度智能',
      bio: 'AI研究员，发表多篇顶会论文',
      email: 'liuyang@deep.ai',
      socialLinks: [{ platform: 'GitHub', url: 'https://github.com/liuyang' }],
      tags: ['AI', '技术', '研究'],
      episodeCount: 2,
      lastAppearance: '2024-05-25',
      notes: '技术深度够，需要引导通俗化',
      createdAt: '2024-02-28T00:00:00Z'
    },
    {
      id: 'g6',
      name: '赵雪',
      title: '设计总监',
      company: '美学设计',
      bio: '独立设计师，跨界艺术家',
      email: 'zhaoxue@meixue.com',
      socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com/zhaoxue' }],
      tags: ['设计', '艺术', '生活'],
      episodeCount: 1,
      lastAppearance: '2023-11-15',
      notes: '审美独特，适合生活类节目',
      createdAt: '2023-10-10T00:00:00Z'
    }
  ] as Guest[],

  interviewOutlines: [
    {
      id: 'io1',
      episodeId: 'ep1',
      sections: [
        { id: 'sec1', title: '开场介绍', duration: 300, questions: ['嘉宾自我介绍', '最近在做什么'], notes: '轻松开场，拉近距离' },
        { id: 'sec2', title: 'AI创业的机会', duration: 1200, questions: ['AI创业的最佳切入点', '大模型带来的变化', '创业公司如何差异化'] },
        { id: 'sec3', title: '技术与产品', duration: 900, questions: ['技术团队搭建', '产品迭代节奏'] },
        { id: 'sec4', title: '商业化探索', duration: 600, questions: ['商业模式', '客户获取'] },
        { id: 'sec5', title: '总结与展望', duration: 300, questions: ['给创业者的建议', '未来展望'] }
      ],
      totalDuration: 3300,
      updatedAt: '2024-06-10T00:00:00Z'
    }
  ] as InterviewOutline[],

  recordings: [
    { id: 'r1', episodeId: 'ep1', name: '主声道-主播', type: 'main', duration: 3720, filePath: '/recordings/ep1/main_host.wav', recordedAt: '2024-06-08T14:00:00Z', quality: 'good', notes: '音质清晰' },
    { id: 'r2', episodeId: 'ep1', name: '嘉宾声道-张明', type: 'guest', duration: 3680, filePath: '/recordings/ep1/guest_zhangming.wav', recordedAt: '2024-06-08T14:00:00Z', quality: 'good' },
    { id: 'r3', episodeId: 'ep2', name: '主声道-主播', type: 'main', duration: 0, filePath: '/recordings/ep2/main_host.wav', recordedAt: '2024-06-10T10:00:00Z', quality: 'good', notes: '正在录制' },
    { id: 'r4', episodeId: 'ep2', name: '嘉宾声道-李华', type: 'guest', duration: 0, filePath: '/recordings/ep2/guest_lihua.wav', recordedAt: '2024-06-10T10:00:00Z', quality: 'medium', notes: '网络有点卡' }
  ] as RecordingItem[],

  materials: [
    { id: 'mat1', episodeId: 'ep1', name: '片头音乐.mp3', type: 'audio', filePath: '/materials/music/intro.mp3', fileSize: 5242880, duration: 30, tags: ['音乐', '片头'], importedAt: '2024-06-01T00:00:00Z', importedBy: 'm1', description: '第三季统一片头' },
    { id: 'mat2', episodeId: 'ep1', name: '片尾音乐.mp3', type: 'audio', filePath: '/materials/music/outro.mp3', fileSize: 4194304, duration: 25, tags: ['音乐', '片尾'], importedAt: '2024-06-01T00:00:00Z', importedBy: 'm1' },
    { id: 'mat3', episodeId: 'ep1', name: '转场音效.mp3', type: 'audio', filePath: '/materials/sfx/transition.wav', fileSize: 524288, duration: 3, tags: ['音效', '转场'], importedAt: '2024-06-02T00:00:00Z', importedBy: 'm2' },
    { id: 'mat4', episodeId: 'ep1', name: '封面图.png', type: 'image', filePath: '/materials/images/cover_ep1.png', fileSize: 2097152, tags: ['封面'], importedAt: '2024-06-05T00:00:00Z', importedBy: 'm3' },
    { id: 'mat5', name: '通用背景音乐集', type: 'audio', filePath: '/materials/music/bgm_pack.zip', fileSize: 52428800, tags: ['音乐', 'BGM'], importedAt: '2024-05-15T00:00:00Z', importedBy: 'm1', description: '精选背景配乐合集' },
    { id: 'mat6', episodeId: 'ep2', name: '嘉宾头像.jpg', type: 'image', filePath: '/materials/images/guest_lihua.jpg', fileSize: 1048576, tags: ['头像', '嘉宾'], importedAt: '2024-06-08T00:00:00Z', importedBy: 'm2' }
  ] as Material[],

  clipMarkers: [
    { id: 'cm1', episodeId: 'ep1', materialId: 'r1', startTime: 300, endTime: 600, label: '开场介绍', color: 'blue', notes: '精彩开场部分', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'cm2', episodeId: 'ep1', materialId: 'r1', startTime: 1200, endTime: 1800, label: '核心观点', color: 'green', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'cm3', episodeId: 'ep1', materialId: 'r1', startTime: 2400, endTime: 2700, label: '金句片段', color: 'yellow', notes: '可用于短视频剪辑', createdAt: '2024-06-09T00:00:00Z' }
  ] as ClipMarker[],

  mistakeRecords: [
    { id: 'mr1', episodeId: 'ep1', timePoint: 450, description: '口误：把"三秒"说成"三秒"', severity: 'minor', resolved: true, createdAt: '2024-06-09T00:00:00Z' },
    { id: 'mr2', episodeId: 'ep1', timePoint: 1500, description: '嘉宾说错公司名', severity: 'medium', resolved: false, createdAt: '2024-06-09T00:00:00Z' },
    { id: 'mr3', episodeId: 'ep1', timePoint: 2800, description: '咳嗽声需要剪掉', severity: 'minor', resolved: false, createdAt: '2024-06-09T00:00:00Z' }
  ] as MistakeRecord[],

  editTodos: [
    { id: 'et1', episodeId: 'ep1', title: '粗剪完成', description: '完成初剪，控制在60分钟以内', assignee: 'm2', status: 'done', priority: 'high', dueDate: '2024-06-12', createdAt: '2024-06-08T00:00:00Z' },
    { id: 'et2', episodeId: 'ep1', title: '精修音频', description: '降噪、均衡、压缩处理', assignee: 'm2', status: 'in_progress', priority: 'high', dueDate: '2024-06-13', createdAt: '2024-06-08T00:00:00Z' },
    { id: 'et3', episodeId: 'ep1', title: '添加音乐和音效', description: '添加片头片尾音乐和转场音效', assignee: 'm3', status: 'pending', priority: 'medium', dueDate: '2024-06-14', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'et4', episodeId: 'ep1', title: '剪辑口误', description: '剪掉所有标记的口误', assignee: 'm2', status: 'pending', priority: 'medium', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'et5', episodeId: 'ep2', title: '准备剪辑', description: '开始剪辑第二期', assignee: 'm3', status: 'pending', priority: 'high', dueDate: '2024-06-20', createdAt: '2024-06-10T00:00:00Z' }
  ] as EditTodo[],

  copyrightMusic: [
    { id: 'cm1', episodeId: 'ep1', title: '晨曦之光', artist: '李明', album: '创业之声', usage: 'intro', duration: 30, licenseType: '商用授权', licenseUrl: 'https://music.example.com/license/123', cost: 200, createdAt: '2024-06-01T00:00:00Z' },
    { id: 'cm2', episodeId: 'ep1', title: '日落时分', artist: '王磊', usage: 'outro', duration: 25, licenseType: '免费商用', cost: 0, createdAt: '2024-06-01T00:00:00Z' },
    { id: 'cm3', title: '轻快背景', artist: '轻音乐集', usage: 'background', duration: 180, licenseType: '订阅制', cost: 99, createdAt: '2024-05-20T00:00:00Z' }
  ] as CopyrightMusic[],

  coverDrafts: [
    { id: 'cd1', episodeId: 'ep1', version: 1, imageUrl: '/covers/ep1_v1.png', status: 'rejected', feedback: '配色太暗，不够醒目', designer: 'm3', createdAt: '2024-06-03T00:00:00Z' },
    { id: 'cd2', episodeId: 'ep1', version: 2, imageUrl: '/covers/ep1_v2.png', status: 'reviewing', designer: 'm3', createdAt: '2024-06-08T00:00:00Z' },
    { id: 'cd3', episodeId: 'ep5', version: 1, imageUrl: '/covers/ep5_v1.png', status: 'approved', designer: 'm3', createdAt: '2024-05-20T00:00:00Z' }
  ] as CoverDraft[],

  copywritings: [
    { id: 'cw1', episodeId: 'ep1', type: 'show_notes', content: '本期我们邀请到了智云科技创始人张明，一起探讨AI时代的创业机会...', version: 2, status: 'reviewing', author: 'm1', updatedAt: '2024-06-10T00:00:00Z' },
    { id: 'cw2', episodeId: 'ep1', type: 'description', content: 'AI浪潮下，创业者该如何把握机会？', version: 1, status: 'draft', author: 'm1', updatedAt: '2024-06-09T00:00:00Z' },
    { id: 'cw3', episodeId: 'ep1', type: 'social_media', content: '新一期节目上线！和张明聊AI创业～', version: 1, status: 'draft', author: 'm2', updatedAt: '2024-06-10T00:00:00Z' }
  ] as Copywriting[],

  timelineNotes: [
    { id: 'tn1', episodeId: 'ep1', timePoint: 0, content: '开场音乐起', type: 'music', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'tn2', episodeId: 'ep1', timePoint: 30, content: '第一章：开场介绍', type: 'chapter', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'tn3', episodeId: 'ep1', timePoint: 600, content: '第二章：AI创业机会', type: 'chapter', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'tn4', episodeId: 'ep1', timePoint: 1800, content: '中场广告位', type: 'ad_break', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'tn5', episodeId: 'ep1', timePoint: 3300, content: '结尾音乐起', type: 'music', createdAt: '2024-06-09T00:00:00Z' }
  ] as TimelineNote[],

  reviewComments: [
    { id: 'rc1', episodeId: 'ep5', reviewer: 'm1', content: '开头节奏可以再紧凑一些', status: 'resolved', createdAt: '2024-06-08T10:00:00Z', resolvedAt: '2024-06-09T14:00:00Z' },
    { id: 'rc2', episodeId: 'ep5', reviewer: 'm3', content: '中间有个地方音频有点小，需要调大', status: 'open', createdAt: '2024-06-09T09:00:00Z' },
    { id: 'rc3', episodeId: 'ep5', reviewer: 'm2', content: '整体很好，可以过', status: 'resolved', createdAt: '2024-06-10T11:00:00Z', resolvedAt: '2024-06-10T15:00:00Z' },
    { id: 'rc4', episodeId: 'ep1', reviewer: 'm3', content: '剪辑节奏不错', status: 'open', createdAt: '2024-06-11T09:00:00Z' }
  ] as ReviewComment[],

  publishChecklists: [
    {
      id: 'pc1',
      episodeId: 'ep1',
      items: [
        { id: 'pci1', label: '音频剪辑完成', category: '内容', checked: true, checkedBy: 'm2', checkedAt: '2024-06-12T00:00:00Z' },
        { id: 'pci2', label: '封面设计完成', category: '内容', checked: false },
        { id: 'pci3', label: '节目简介文案', category: '文案', checked: false },
        { id: 'pci4', label: '社交媒体文案', category: '文案', checked: false },
        { id: 'pci5', label: '版权音乐确认', category: '版权', checked: true, checkedBy: 'm1', checkedAt: '2024-06-10T00:00:00Z' },
        { id: 'pci6', label: '嘉宾授权确认', category: '版权', checked: false },
        { id: 'pci7', label: '上传到各平台', category: '发布', checked: false },
        { id: 'pci8', label: '发布时间确认', category: '发布', checked: false }
      ]
    }
  ] as PublishChecklist[],

  listenData: [
    { id: 'ld1', episodeId: 'ep6', platform: '小宇宙', listens: 12500, uniqueListeners: 8900, avgListenDuration: 2100, completionRate: 0.68, date: '2024-05-30', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'ld2', episodeId: 'ep6', platform: '喜马拉雅', listens: 8300, uniqueListeners: 6200, avgListenDuration: 1950, completionRate: 0.62, date: '2024-05-30', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'ld3', episodeId: 'ep6', platform: 'Apple Podcasts', listens: 5600, uniqueListeners: 4800, avgListenDuration: 2400, completionRate: 0.75, date: '2024-05-30', updatedAt: '2024-06-01T00:00:00Z' },
    { id: 'ld4', episodeId: 'ep8', platform: '小宇宙', listens: 9800, uniqueListeners: 7200, avgListenDuration: 1800, completionRate: 0.7, date: '2023-12-10', updatedAt: '2023-12-15T00:00:00Z' }
  ] as ListenData[],

  sponsorSlots: [
    { id: 'ss1', episodeId: 'ep1', sponsorName: '某某咖啡', slotType: 'pre_roll', duration: 30, copy: '感谢某某咖啡，好喝不贵', position: 1, status: 'scheduled', scheduledDate: '2024-06-20', cost: 5000, notes: '第三季冠名赞助' },
    { id: 'ss2', episodeId: 'ep1', sponsorName: '某某SaaS工具', slotType: 'mid_roll', duration: 60, copy: '使用某某工具，提升工作效率翻倍', position: 2, status: 'scheduled', scheduledDate: '2024-06-20', cost: 8000 },
    { id: 'ss3', episodeId: 'ep5', sponsorName: '某某咖啡', slotType: 'pre_roll', duration: 30, copy: '感谢某某咖啡', position: 1, status: 'published', scheduledDate: '2024-06-22', cost: 5000 }
  ] as SponsorSlot[],

  teamMembers: [
    { id: 'm1', name: '主编', role: '主持人/制作人', email: 'zhubian@podcast.com', status: 'active' },
    { id: 'm2', name: '剪辑师小王', role: '音频剪辑师', email: 'xiaowang@podcast.com', status: 'active' },
    { id: 'm3', name: '运营小美', role: '运营/设计', email: 'xiaomei@podcast.com', status: 'away' }
  ] as TeamMember[],

  tasks: [
    { id: 'task1', title: '联系张明采访', description: '和张明确认采访时间和提纲', assignee: 'm1', episodeId: 'ep1', status: 'done', priority: 'high', dueDate: '2024-06-05', createdAt: '2024-05-28T00:00:00Z' },
    { id: 'task2', title: '准备采访提纲', description: '撰写第一期采访提纲', assignee: 'm1', episodeId: 'ep1', status: 'done', priority: 'high', dueDate: '2024-06-06', createdAt: '2024-05-29T00:00:00Z' },
    { id: 'task3', title: '预约录音室', description: '预约周六的录音室', assignee: 'm2', episodeId: 'ep2', status: 'in_progress', priority: 'medium', dueDate: '2024-06-14', createdAt: '2024-06-08T00:00:00Z' },
    { id: 'task4', title: '设计封面', description: '设计第一期封面', assignee: 'm3', episodeId: 'ep1', status: 'in_progress', priority: 'high', dueDate: '2024-06-13', createdAt: '2024-06-03T00:00:00Z' },
    { id: 'task5', title: '写节目简介', description: '撰写第一期节目简介', assignee: 'm1', episodeId: 'ep1', status: 'todo', priority: 'medium', dueDate: '2024-06-15', createdAt: '2024-06-10T00:00:00Z' },
    { id: 'task6', title: '联系李华', description: '和李华确认采访', assignee: 'm1', episodeId: 'ep2', status: 'todo', priority: 'high', dueDate: '2024-06-12', createdAt: '2024-06-09T00:00:00Z' },
    { id: 'task7', title: '整理选题评审', description: '本周选题评审会', assignee: 'm1', status: 'todo', priority: 'medium', dueDate: '2024-06-14', createdAt: '2024-06-10T00:00:00Z' },
    { id: 'task8', title: '更新网站', description: '更新节目官网内容', assignee: 'm3', status: 'in_progress', priority: 'low', dueDate: '2024-06-20', createdAt: '2024-06-05T00:00:00Z' }
  ] as Task[]
}
