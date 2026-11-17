import React, { useState, useEffect } from 'react';
import { Course } from './types/academy';
import { WordCourse, VisitorUser } from './types/wordCourses';
import { TrackLesson, ProfessionalTrack } from './types/professionalTracks';
import { INITIAL_COURSES } from './data/coursesData';
import { FIFTEEN_WORD_COURSES } from './data/wordCoursesData';
import { PROFESSIONAL_TRACKS } from './data/professionalTracksData';
import { Header } from './components/Header';
import { HeroAcademy } from './components/academy/HeroAcademy';
import { ProfessionalTracksSection } from './components/academy/ProfessionalTracksSection';
import { LessonViewerModal } from './components/academy/LessonViewerModal';
import { WordCoursesGrid } from './components/courses/WordCoursesGrid';
import { WordDocumentViewerModal } from './components/courses/WordDocumentViewerModal';
import { PaymentNoticeModal } from './components/courses/PaymentNoticeModal';
import { VisitorAuthModal } from './components/auth/VisitorAuthModal';
import { CourseCatalog } from './components/academy/CourseCatalog';
import { InteractiveLabsSection } from './components/academy/InteractiveLabsSection';
import { FinalProjectsCenter } from './components/projects/FinalProjectsCenter';
import { DocumentsLibrary } from './components/library/DocumentsLibrary';
import { SkillsCredentialsCenter } from './components/credentials/SkillsCredentialsCenter';
import { SecuritySuiteSection } from './components/SecuritySuiteSection';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CertificateModal } from './components/CertificateModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { StudentDashboardModal } from './components/dashboard/StudentDashboardModal';
import { FounderSection } from './components/academy/FounderSection';
import { CyberMentorDrawer } from './components/ai/CyberMentorDrawer';
import { Footer } from './components/Footer';
import { auth, syncUserProfileToFirestore } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tracks');

  // Word Courses state (15 Word Courses with 3 levels)
  const [wordCourses] = useState<WordCourse[]>(FIFTEEN_WORD_COURSES);
  const [selectedWordCourse, setSelectedWordCourse] = useState<WordCourse | null>(null);
  const [paymentNoticeCourse, setPaymentNoticeCourse] = useState<WordCourse | null>(null);

  // Lesson Viewer Modal State
  const [selectedLessonTrack, setSelectedLessonTrack] = useState<ProfessionalTrack | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<TrackLesson | null>(null);

  // AI Educational Assistant (KAyA Cyber Mentor)
  const [isAiMentorOpen, setIsAiMentorOpen] = useState(false);
  const [aiMentorContext, setAiMentorContext] = useState<{ title: string; topic: string } | null>(null);

  // Visitor / Student Auth State
  const [visitorUser, setVisitorUser] = useState<VisitorUser | null>(() => {
    const saved = localStorage.getItem('kaya_visitor_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as VisitorUser;
        return parsed.id?.startsWith('guest-') ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isVisitorAuthOpen, setIsVisitorAuthOpen] = useState(false);
  const [isStudentDashboardModalOpen, setIsStudentDashboardModalOpen] = useState(false);

  // Academy Courses State (10 comprehensive applied tracks)
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('kaya_academy_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COURSES;
      }
    }
    return INITIAL_COURSES;
  });

  // Admin status is derived from Firebase Authentication, never from editable browser storage.
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // Student progress & Gamification
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('kaya_completed_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['found-01', 'soc-01', 'web-01'];
      }
    }
    return ['found-01', 'soc-01', 'web-01'];
  });

  const [xpPoints, setXpPoints] = useState<number>(() => {
    const saved = localStorage.getItem('kaya_student_xp');
    return saved ? Number(saved) : 450;
  });

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseForCert, setCourseForCert] = useState<Course | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const email = user?.email?.toLowerCase() || '';
      const allowedAdmins = ['hasan.xlo101@gmail.com'];
      const authorized = Boolean(user && user.emailVerified && allowedAdmins.includes(email));
      setIsAdmin(authorized);
      setAdminEmail(authorized ? email : '');
      if (!authorized) setIsAdminDashboardOpen(false);
    });
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      const email = user?.email?.toLowerCase() || '';
      const adminEmails = ['hasan.xlo101@gmail.com'];
      // An administrator session must not also become a student session.
      if (user && user.emailVerified && email && !adminEmails.includes(email)) {
        setVisitorUser({
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email,
          joinedDate: new Date(user.metadata.creationTime || Date.now()).toISOString().slice(0, 10),
          enrolledCourseIds: ['word-beg-01', 'word-beg-02'],
        });
      } else {
        setVisitorUser((current) => current?.id.startsWith('guest-') ? current : null);
      }
    });
  }, []);


  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('kaya_academy_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    if (visitorUser) {
      localStorage.setItem('kaya_visitor_user', JSON.stringify(visitorUser));
    } else {
      localStorage.removeItem('kaya_visitor_user');
    }
  }, [visitorUser]);

  useEffect(() => {
    localStorage.setItem('kaya_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('kaya_student_xp', String(xpPoints));
  }, [xpPoints]);

  const handleVisitorLoginSuccess = (user: VisitorUser) => {
    setVisitorUser(user);
    // Welcome bonus is granted once per browser, not on every login.
    const bonusKey = 'kaya_welcome_bonus_granted';
    const firstLogin = localStorage.getItem(bonusKey) !== '1';
    const updatedXp = firstLogin ? xpPoints + 50 : xpPoints;
    if (firstLogin) {
      localStorage.setItem(bonusKey, '1');
      setXpPoints(updatedXp);
    }
    if (!user.id.startsWith('guest-')) syncUserProfileToFirestore(user, updatedXp, completedLessons).catch((err) =>
      console.warn('Firebase profile sync:', err)
    );
    setActiveTab('student-dashboard');
  };

  const handleVisitorLogout = () => {
    setVisitorUser(null);
    if (visitorUser && !visitorUser.id.startsWith('guest-')) void signOut(auth).catch((err) => console.error('Student sign-out failed:', err));
    if (activeTab === 'student-dashboard') {
      setActiveTab('tracks');
    }
  };

  const handleAdminLoginSuccess = (email: string) => {
    // The modal has already authenticated with Firebase; the auth observer is authoritative.
    setAdminEmail(email);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminDashboardOpen(false);
    void signOut(auth).catch((error) => console.error('Admin sign-out failed:', error));
    setIsAdmin(false);
    setAdminEmail('');
  };

  const handleToggleLessonComplete = (lessonKey: string) => {
    if (completedLessons.includes(lessonKey)) {
      setCompletedLessons(completedLessons.filter((k) => k !== lessonKey));
      setXpPoints(Math.max(0, xpPoints - 25));
    } else {
      const updated = [...completedLessons, lessonKey];
      setCompletedLessons(updated);
      const updatedXp = xpPoints + 25;
      setXpPoints(updatedXp);
      if (visitorUser && !visitorUser.id.startsWith('guest-')) {
        syncUserProfileToFirestore(visitorUser, updatedXp, updated).catch((err) =>
          console.warn('Firebase sync:', err)
        );
      }
    }
  };

  const handleAwardLabXp = (xp: number) => {
    const updatedXp = xpPoints + xp;
    setXpPoints(updatedXp);
    if (visitorUser && !visitorUser.id.startsWith('guest-')) {
      syncUserProfileToFirestore(visitorUser, updatedXp, completedLessons).catch((err) =>
        console.warn('Firebase sync:', err)
      );
    }
  };

  const handleOpenAiMentor = (context?: { title: string; topic: string }) => {
    setAiMentorContext(context || null);
    setIsAiMentorOpen(true);
  };

  const handleSelectTrackLesson = (track: ProfessionalTrack, lesson: TrackLesson) => {
    setSelectedLessonTrack(track);
    setSelectedLesson(lesson);
  };

  // Switch tab, then scroll once the new tab's content has rendered.
  const goToTab = (tab: string) => {
    setActiveTab(tab);
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById('tab-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    );
  };

  const closeLessonViewer = () => {
    setSelectedLesson(null);
    setSelectedLessonTrack(null);
  };

  const handleLaunchCapstone = () => goToTab('projects');

  const handleLaunchLabFromLesson = () => {
    closeLessonViewer();
    goToTab('labs');
  };

  const scrollToTracks = () => goToTab('tracks');
  const scrollToWordCourses = () => goToTab('word-courses');
  const scrollToLabs = () => goToTab('labs');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        visitorUser={visitorUser}
        onOpenVisitorLogin={() => setIsVisitorAuthOpen(true)}
        onVisitorLogout={handleVisitorLogout}
        xpPoints={xpPoints}
        onOpenStudentDashboard={() => setActiveTab('student-dashboard')}
        onOpenAiMentor={() => handleOpenAiMentor()}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroAcademy
          onExploreCourses={scrollToWordCourses}
          onExploreLabs={scrollToLabs}
          onExploreTracks={scrollToTracks}
          xpPoints={xpPoints}
          visitorUser={visitorUser}
          onOpenDashboard={() => setActiveTab('student-dashboard')}
          onOpenAiMentor={() => handleOpenAiMentor()}
        />

        {/* Viewport Content */}
        <div id="tab-content" className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 space-y-12 scroll-mt-20">
          {/* Active Tab: Student Dashboard */}
          {activeTab === 'student-dashboard' && (
            <StudentDashboard
              user={visitorUser}
              xpPoints={xpPoints}
              wordCourses={wordCourses}
              academyCourses={courses}
              completedLessons={completedLessons}
              onOpenWordCourse={(course) => setSelectedWordCourse(course)}
              onOpenAcademyCourse={(course) => setSelectedCourse(course)}
              onGenerateCertificate={(course) => setCourseForCert(course)}
              onOpenVisitorLogin={() => setIsVisitorAuthOpen(true)}
              onLogout={handleVisitorLogout}
              onToggleLessonComplete={handleToggleLessonComplete}
              onExploreCourses={scrollToTracks}
              onExploreLabs={scrollToLabs}
            />
          )}

          {/* Active Tab: The 6 Flagship Professional Tracks */}
          {activeTab === 'tracks' && (
            <ProfessionalTracksSection
              onSelectLesson={handleSelectTrackLesson}
              onLaunchCapstone={handleLaunchCapstone}
              completedLessons={completedLessons}
            />
          )}

          {/* Active Tab: 15 Word Courses Library */}
          {activeTab === 'word-courses' && (
            <WordCoursesGrid
              courses={wordCourses}
              onOpenViewer={(course) => setSelectedWordCourse(course)}
              onOpenPaymentNotice={(course) => setPaymentNoticeCourse(course)}
            />
          )}

          {/* Active Tab: 10 Comprehensive Applied Tracks (Catalog) */}
          {activeTab === 'courses' && (
            <CourseCatalog
              courses={courses}
              onSelectCourse={(course) => setSelectedCourse(course)}
              onLaunchLab={() => scrollToLabs()}
            />
          )}

          {/* Active Tab: Unified Interactive Virtual Labs Center */}
          {activeTab === 'labs' && (
            <InteractiveLabsSection
              onCompleteLab={handleAwardLabXp}
              onOpenWorkerShield={() => setActiveTab('security-suite')}
              onOpenAiMentor={handleOpenAiMentor}
            />
          )}

          {/* Active Tab: Capstone Projects & Guided Reporting Hub */}
          {activeTab === 'projects' && (
            <div id="projects-section">
              <FinalProjectsCenter
                user={visitorUser}
                onOpenVisitorLogin={() => setIsVisitorAuthOpen(true)}
                onAwardXp={handleAwardLabXp}
                onOpenAiMentor={handleOpenAiMentor}
              />
            </div>
          )}

          {/* Active Tab: Downloadable Documents, Cheatsheets & Playbooks */}
          {activeTab === 'library' && (
            <DocumentsLibrary
              wordCourses={wordCourses}
              onOpenWordViewer={(c) => setSelectedWordCourse(c)}
              onOpenPaymentNotice={(c) => setPaymentNoticeCourse(c)}
            />
          )}

          {/* Active Tab: Skills & Credential Verification Center */}
          {activeTab === 'skills' && (
            <SkillsCredentialsCenter
              user={visitorUser}
              xpPoints={xpPoints}
              completedLessonsCount={completedLessons.length}
              onOpenCertificateModal={() => setCourseForCert(courses[0])}
              onOpenVisitorLogin={() => setIsVisitorAuthOpen(true)}
            />
          )}

          {/* Active Tab: Security Suite & Threat Intel Tools */}
          {activeTab === 'security-suite' && (
            <SecuritySuiteSection />
          )}

          {/* Active Tab: Founder & Credential Wall */}
          {activeTab === 'founder' && (
            <FounderSection
              onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </main>

      {/* Interactive Lesson Viewer Modal */}
      <LessonViewerModal
        track={selectedLessonTrack}
        lesson={selectedLesson}
        isOpen={Boolean(selectedLesson)}
        onClose={() => {
          setSelectedLesson(null);
          setSelectedLessonTrack(null);
        }}
        onSelectLesson={(lesson) => setSelectedLesson(lesson)}
        onLaunchLab={handleLaunchLabFromLesson}
        isCompleted={Boolean(selectedLesson && completedLessons.includes(selectedLesson.id))}
        onToggleComplete={handleToggleLessonComplete}
        onOpenAiMentor={handleOpenAiMentor}
      />

      {/* Educational AI Assistant (KAyA Cyber Mentor Drawer) */}
      <CyberMentorDrawer
        isOpen={isAiMentorOpen}
        onClose={() => setIsAiMentorOpen(false)}
        initialContext={aiMentorContext}
      />

      {/* Word Document Interactive Viewer Modal */}
      <WordDocumentViewerModal
        course={selectedWordCourse}
        isOpen={Boolean(selectedWordCourse)}
        onClose={() => setSelectedWordCourse(null)}
      />

      {/* Payment Security Notice Modal */}
      <PaymentNoticeModal
        course={paymentNoticeCourse}
        isOpen={Boolean(paymentNoticeCourse)}
        onClose={() => setPaymentNoticeCourse(null)}
        onOpenPreview={(c) => setSelectedWordCourse(c)}
      />

      {/* Visitor / Student Authentication Modal */}
      <VisitorAuthModal
        isOpen={isVisitorAuthOpen}
        onClose={() => setIsVisitorAuthOpen(false)}
        onLoginSuccess={handleVisitorLoginSuccess}
      />

      {/* Student Dashboard Modal (Alternative modal view if opened) */}
      {visitorUser && (
        <StudentDashboardModal
          isOpen={isStudentDashboardModalOpen}
          onClose={() => setIsStudentDashboardModalOpen(false)}
          user={visitorUser}
          xpPoints={xpPoints}
          wordCourses={wordCourses}
          academyCourses={courses}
          completedLessons={completedLessons}
          onOpenWordCourse={(c) => setSelectedWordCourse(c)}
          onOpenAcademyCourse={(c) => setSelectedCourse(c)}
          onGenerateCertificate={(c) => setCourseForCert(c)}
          onLogout={handleVisitorLogout}
        />
      )}

      {/* Course Detail Modal (Legacy tracks) */}
      <CourseDetailModal
        course={selectedCourse}
        isOpen={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        onLaunchLab={() => { setSelectedCourse(null); scrollToLabs(); }}
        onGenerateCertificate={(c) => setCourseForCert(c)}
        completedLessons={completedLessons}
        onToggleLessonComplete={handleToggleLessonComplete}
      />

      {/* Signed Certificate Modal */}
      <CertificateModal
        course={courseForCert}
        isOpen={Boolean(courseForCert)}
        onClose={() => setCourseForCert(null)}
      />

      {/* Admin Login Modal (Restricted to hasan.xlo101@gmail.com) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard Modal (For Sole Owner & Admin) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        courses={courses}
        onUpdateCourses={setCourses}
        onLogout={handleAdminLogout}
        adminEmail={adminEmail}
      />

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
