export interface SyllabusItem {
  number: string;
  title: string;
  subtitle: string;
  description?: string;
  duration?: string;
  hasLab?: boolean;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: 'network' | 'offensive' | 'forensics' | 'cert' | 'advanced' | 'ai' | 'lab';
  hours: number;
  lessonsCount: number;
  badge: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم' | 'احترافي';
  outcomesIntro: string;
  outcomes: string[];
  syllabusIntro: string;
  syllabus: SyllabusItem[];
  prerequisites: string[];
  xpReward: number;
  enrolledStudents: number;
  iconName: string;
  isPopular?: boolean;
}

export interface LabChallenge {
  id: string;
  title: string;
  category: string;
  badgeIcon: string;
  difficulty: 'متوسط' | 'متقدم' | 'خبير';
  description: string;
  tags: string[];
  xp: number;
}

export interface CertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  grade: string;
  instructor: string;
}
