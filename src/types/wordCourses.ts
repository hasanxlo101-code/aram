export type CourseLevel = 'beginner' | 'intermediate' | 'expert';

export interface DocSection {
  subtitle: string;
  content: string;
  codeOrBox?: string;
  tip?: string;
}

export interface DocChapter {
  number: string;
  title: string;
  sections: DocSection[];
}

export interface WordCourse {
  id: string;
  title: string;
  subtitle: string;
  level: CourseLevel;
  levelLabelAr: string;
  isFree: boolean;
  priceUsd: number;
  hours: number;
  badge: string;
  docMeta: {
    fileName: string;
    fileSize: string;
    pages: number;
    wordsCount: number;
    lastUpdated: string;
    author: string;
  };
  chapters: DocChapter[];
  prerequisites: string[];
  learningOutcomes: string[];
}

export interface XpBadge {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  xpRequirement: number;
  category: 'fundamentals' | 'web' | 'forensics' | 'defense' | 'master';
}

export interface EnrolledCourseProgress {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  enrolledAt: string;
  lastAccessedAt: string;
  isCompleted: boolean;
  type: 'word' | 'academy';
  category: string;
}

export interface VisitorUser {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  enrolledCourseIds: string[];
  solvedLabIds?: string[];
  customProgress?: Record<string, number>; // courseId -> completed lessons count
}
