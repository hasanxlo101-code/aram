export type TrackCategory = 
  | 'foundations'
  | 'soc'
  | 'web'
  | 'dfir'
  | 'osint'
  | 'ai';

export interface LessonQuiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TrackLesson {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  codeExamples?: { language: string; title: string; code: string }[];
  keyTakeaways: string[];
  quiz?: LessonQuiz;
}

export interface CapstoneProject {
  id: string;
  title: string;
  trackId: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم' | 'احترافي';
  estimatedHours: number;
  scenario: string;
  objectives: string[];
  deliverables: string[];
  evaluationRubric: { criterion: string; weight: number; description: string }[];
}

export interface ProfessionalTrack {
  id: string;
  category: TrackCategory;
  title: string;
  titleEn: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';
  badge?: string;
  hours?: number;
  xpReward?: number;
  durationWeeks: number;
  icon: string;
  iconName?: string;
  summary?: string;
  description: string;
  objectives: string[];
  learningOutcomes?: string[];
  prerequisites: string[];
  targetRoles: string[];
  skillsGained: string[];
  lessons: TrackLesson[];
  capstoneProject: CapstoneProject;
  capstone?: CapstoneProject;
}

export interface UnifiedLab {
  id: string;
  trackId: string;
  title: string;
  category: string;
  badge?: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  xpReward: number;
  xp?: number;
  estimatedMinutes: number;
  missionBrief: string;
  learningGoal: string;
  targetEnvironment: string;
  instructions: string[];
  hints: string[];
  flagFormat: string;
  validFlag: string;
  simulatedScenario: {
    terminalPrompt?: string;
    targetService?: string;
    sampleLogsOrData?: string[];
    vulnerableInputHint?: string;
  };
}

export interface DownloadableDoc {
  id: string;
  title: string;
  category: 'دليل عملي' | 'قائمة تحقق' | 'ملخص أوامر' | 'إطار عمل' | 'تقرير نموذج';
  format: 'PDF' | 'DOCX' | 'MD' | 'JSON';
  size: string;
  downloadsCount: number;
  description: string;
  tags: string[];
  fileUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: 'نجاح' | 'تنبيه' | 'محظور';
  details: string;
}

export interface StudentSkillNode {
  name: string;
  category: string;
  proficiencyPercent: number;
  level: string;
}
