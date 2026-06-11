export interface Season {
  id: string
  name: string
  description: string
  status: 'planning' | 'recording' | 'editing' | 'publishing' | 'completed'
  startDate: string
  endDate: string
  episodeCount: number
  cover?: string
  tags: string[]
}

export type EpisodeStatus = 'idea' | 'planning' | 'guest_confirmed' | 'recording' | 'recorded' | 'editing' | 'reviewing' | 'ready' | 'published' | 'archived'

export interface Episode {
  id: string
  seasonId: string
  episodeNumber: number
  title: string
  subtitle?: string
  status: EpisodeStatus
  deadline: string
  publishDate?: string
  assignees: string[]
  guestId?: string
  topic: string
  description: string
  duration?: number
  createdAt: string
  updatedAt: string
}

export interface Topic {
  id: string
  title: string
  description: string
  source: string
  author: string
  status: 'pending' | 'approved' | 'rejected' | 'scheduled'
  priority: 'high' | 'medium' | 'low'
  tags: string[]
  createdAt: string
  episodeId?: string
}

export interface Guest {
  id: string
  name: string
  avatar?: string
  title: string
  company: string
  bio: string
  email: string
  phone?: string
  website?: string
  socialLinks: { platform: string; url: string }[]
  tags: string[]
  episodeCount: number
  lastAppearance?: string
  notes: string
  createdAt: string
}

export interface InterviewOutline {
  id: string
  episodeId: string
  sections: {
    id: string
    title: string
    duration: number
    questions: string[]
    notes?: string
  }[]
  totalDuration: number
  updatedAt: string
}

export interface RecordingItem {
  id: string
  episodeId: string
  name: string
  type: 'main' | 'guest' | 'ambient' | 'other'
  duration: number
  filePath: string
  recordedAt: string
  quality: 'good' | 'medium' | 'poor'
  notes?: string
}

export interface Material {
  id: string
  episodeId?: string
  name: string
  type: 'audio' | 'video' | 'image' | 'document' | 'other'
  filePath: string
  fileSize: number
  duration?: number
  tags: string[]
  importedAt: string
  importedBy: string
  description?: string
}

export interface ClipMarker {
  id: string
  episodeId: string
  materialId: string
  startTime: number
  endTime: number
  label: string
  color: string
  notes?: string
  createdAt: string
}

export interface MistakeRecord {
  id: string
  episodeId: string
  timePoint: number
  description: string
  severity: 'minor' | 'medium' | 'major'
  resolved: boolean
  createdAt: string
}

export interface EditTodo {
  id: string
  episodeId: string
  title: string
  description: string
  assignee: string
  status: 'pending' | 'in_progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
}

export interface CopyrightMusic {
  id: string
  episodeId?: string
  title: string
  artist: string
  album?: string
  usage: 'intro' | 'outro' | 'background' | 'transition'
  duration: number
  licenseType: string
  licenseUrl?: string
  cost?: number
  startPoint?: number
  createdAt: string
}

export interface CoverDraft {
  id: string
  episodeId: string
  version: number
  imageUrl: string
  status: 'draft' | 'reviewing' | 'approved' | 'rejected'
  feedback?: string
  designer: string
  createdAt: string
}

export interface Copywriting {
  id: string
  episodeId: string
  type: 'show_notes' | 'description' | 'social_media' | 'newsletter'
  content: string
  version: number
  status: 'draft' | 'reviewing' | 'approved'
  author: string
  updatedAt: string
}

export interface TimelineNote {
  id: string
  episodeId: string
  timePoint: number
  content: string
  type: 'note' | 'chapter' | 'ad_break' | 'music'
  createdAt: string
}

export interface ReviewComment {
  id: string
  episodeId: string
  reviewer: string
  content: string
  status: 'open' | 'resolved'
  createdAt: string
  resolvedAt?: string
  replyTo?: string
}

export interface PublishChecklist {
  id: string
  episodeId: string
  items: {
    id: string
    label: string
    category: string
    checked: boolean
    checkedBy?: string
    checkedAt?: string
  }[]
}

export interface ListenData {
  id: string
  episodeId: string
  platform: string
  listens: number
  uniqueListeners: number
  avgListenDuration: number
  completionRate: number
  date: string
  updatedAt: string
}

export interface SponsorSlot {
  id: string
  episodeId?: string
  sponsorName: string
  slotType: 'pre_roll' | 'mid_roll' | 'post_roll'
  duration: number
  copy: string
  position?: number
  status: 'scheduled' | 'recorded' | 'published'
  scheduledDate?: string
  cost?: number
  notes?: string
}

export interface TeamMember {
  id: string
  name: string
  avatar?: string
  role: string
  email: string
  status: 'active' | 'away' | 'offline'
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  episodeId?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  dueDate?: string
  createdAt: string
}
