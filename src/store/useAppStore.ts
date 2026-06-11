import { create } from 'zustand'
import type {
  Season, Episode, Topic, Guest, InterviewOutline, RecordingItem,
  Material, ClipMarker, MistakeRecord, EditTodo, CopyrightMusic,
  CoverDraft, Copywriting, TimelineNote, ReviewComment,
  PublishChecklist, ListenData, SponsorSlot, TeamMember, Task
} from '@/types'
import { mockData } from '@/data/mockData'

interface AppState {
  seasons: Season[]
  episodes: Episode[]
  topics: Topic[]
  guests: Guest[]
  interviewOutlines: InterviewOutline[]
  recordings: RecordingItem[]
  materials: Material[]
  clipMarkers: ClipMarker[]
  mistakeRecords: MistakeRecord[]
  editTodos: EditTodo[]
  copyrightMusic: CopyrightMusic[]
  coverDrafts: CoverDraft[]
  copywritings: Copywriting[]
  timelineNotes: TimelineNote[]
  reviewComments: ReviewComment[]
  publishChecklists: PublishChecklist[]
  listenData: ListenData[]
  sponsorSlots: SponsorSlot[]
  teamMembers: TeamMember[]
  tasks: Task[]
  
  currentEpisodeId: string | null
  setCurrentEpisodeId: (id: string | null) => void
  
  addEpisode: (episode: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEpisode: (id: string, updates: Partial<Episode>) => void
  deleteEpisode: (id: string) => void
  
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt'>) => void
  updateTopic: (id: string, updates: Partial<Topic>) => void
  
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => void
  updateGuest: (id: string, updates: Partial<Guest>) => void
  
  addMaterial: (material: Omit<Material, 'id' | 'importedAt'>) => void
  addEditTodo: (todo: Omit<EditTodo, 'id' | 'createdAt'>) => void
  updateEditTodo: (id: string, updates: Partial<EditTodo>) => void
  
  addReviewComment: (comment: Omit<ReviewComment, 'id' | 'createdAt'>) => void
  resolveReviewComment: (id: string) => void
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  
  getEpisodesBySeason: (seasonId: string) => Episode[]
  getEpisodesByStatus: (status: Episode['status']) => Episode[]
  getGuests: () => Guest[]
  getTasksByAssignee: (assigneeId: string) => Task[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useAppStore = create<AppState>((set, get) => ({
  ...mockData,
  currentEpisodeId: null,
  
  setCurrentEpisodeId: (id) => set({ currentEpisodeId: id }),
  
  addEpisode: (episode) => set((state) => ({
    episodes: [...state.episodes, {
      ...episode,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }]
  })),
  
  updateEpisode: (id, updates) => set((state) => ({
    episodes: state.episodes.map(ep =>
      ep.id === id ? { ...ep, ...updates, updatedAt: new Date().toISOString() } : ep
    )
  })),
  
  deleteEpisode: (id) => set((state) => ({
    episodes: state.episodes.filter(ep => ep.id !== id)
  })),
  
  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, { ...topic, id: generateId(), createdAt: new Date().toISOString() }]
  })),
  
  updateTopic: (id, updates) => set((state) => ({
    topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, { ...guest, id: generateId(), createdAt: new Date().toISOString() }]
  })),
  
  updateGuest: (id, updates) => set((state) => ({
    guests: state.guests.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  
  addMaterial: (material) => set((state) => ({
    materials: [...state.materials, { ...material, id: generateId(), importedAt: new Date().toISOString() }]
  })),
  
  addEditTodo: (todo) => set((state) => ({
    editTodos: [...state.editTodos, { ...todo, id: generateId(), createdAt: new Date().toISOString() }]
  })),
  
  updateEditTodo: (id, updates) => set((state) => ({
    editTodos: state.editTodos.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  addReviewComment: (comment) => set((state) => ({
    reviewComments: [...state.reviewComments, { ...comment, id: generateId(), createdAt: new Date().toISOString() }]
  })),
  
  resolveReviewComment: (id) => set((state) => ({
    reviewComments: state.reviewComments.map(c =>
      c.id === id ? { ...c, status: 'resolved', resolvedAt: new Date().toISOString() } : c
    )
  })),
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: generateId(), createdAt: new Date().toISOString() }]
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  getEpisodesBySeason: (seasonId) => get().episodes.filter(ep => ep.seasonId === seasonId),
  getEpisodesByStatus: (status) => get().episodes.filter(ep => ep.status === status),
  getGuests: () => get().guests,
  getTasksByAssignee: (assigneeId) => get().tasks.filter(t => t.assignee === assigneeId)
}))
