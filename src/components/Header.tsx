import React, { useState } from 'react';
import { Shield, Lock, Award, UserCheck, User, LogIn, LayoutDashboard, LogOut, Sparkles, Share2, Check, Copy, ExternalLink } from 'lucide-react';
import { VisitorUser } from '../types/wordCourses';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  visitorUser: VisitorUser | null;
  onOpenVisitorLogin: () => void;
  onVisitorLogout: () => void;
  xpPoints: number;
  onOpenStudentDashboard?: () => void;
  onOpenAiMentor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  visitorUser,
  onOpenVisitorLogin,
  onVisitorLogout,
  xpPoints,
  onOpenStudentDashboard,
  onOpenAiMentor,
}) => {
  const baseNavItems = [
    { id: 'tracks', label: 'المسارات الاحترافية (6)' },
    { id: 'word-courses', label: 'كورسات Word (15)' },
    { id: 'labs', label: 'المختبرات العملية' },
    { id: 'projects', label: 'المشاريع والتقارير' },
    { id: 'library', label: 'مكتبة الوثائق' },
    { id: 'skills', label: 'المهارات والشهادات' },
    { id: 'security-suite', label: 'درع وفاحص التهديدات' },
    { id: 'founder', label: 'عن المؤسس' },
  ];

  const navItems = visitorUser
    ? [{ id: 'student-dashboard', label: 'لوحة المتدرب (Dashboard)' }, ...baseNavItems]
    : baseNavItems;

  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopyLink = (url: string, type: string) => {
    try {
      navigator.clipboard.writeText(url);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDashboardClick = () => {
    setActiveTab('student-dashboard');
    if (onOpenStudentDashboard) {
      onOpenStudentDashboard();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('tracks')}
          className="flex cursor-pointer items-center gap-2.5 whitespace-nowrap text-lg font-bold tracking-tight text-white shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold tracking-wider text-white">KAyA</span>
            <span className="text-xs font-mono font-medium text-cyan-400">Safe&Sec</span>
            <span className="hidden xl:inline text-[11px] text-slate-400 font-normal">| أكاديمية الأمن السيبراني</span>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isDashboard = item.id === 'student-dashboard';
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : isDashboard
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Official Platform Links Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLinksDropdownOpen(!linksDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/30 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 text-xs transition-all cursor-pointer shadow-sm shadow-cyan-950/40"
              title="روابط المنصة الرسمية المعتمدة"
            >
              <Share2 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px] text-cyan-300 hidden sm:inline">الرابط الرسمي</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </button>

            {linksDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    الروابط الرسمية المعتمدة
                  </span>
                  <button 
                    onClick={() => setLinksDropdownOpen(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Primary Link */}
                  <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300 uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        الرابط الأساسي (Primary)
                      </div>
                      <div className="font-mono text-slate-200 text-[11px] truncate" dir="ltr">
                        tinyurl.com/kaya-safesec
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyLink('https://tinyurl.com/kaya-safesec', 'primary')}
                      className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedType === 'primary' ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-950" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Academic Link */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 uppercase">
                        <Award className="h-2.5 w-2.5" />
                        الرابط الأكاديمي (Academy)
                      </div>
                      <div className="font-mono text-slate-300 text-[11px] truncate" dir="ltr">
                        tinyurl.com/kaya-academy
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyLink('https://tinyurl.com/kaya-academy', 'academy')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[10px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedType === 'academy' ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-400" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* GitHub Official Account */}
                  <a
                    href="https://github.com/aramkaya295-cyber/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    title="زيارة حساب GitHub الرسمي"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                        مستودع الكود (GitHub)
                      </div>
                      <div className="font-mono text-slate-300 text-[11px] truncate" dir="ltr">
                        github.com/aramkaya295-cyber
                      </div>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </a>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-900 text-[10px] text-slate-400 text-center">
                  روابط مباشرة ومعتمدة لمنظومة KAyA Safe&Sec
                </div>
              </div>
            )}
          </div>

          {/* AI Mentor Trigger */}
          {onOpenAiMentor && (
            <button
              onClick={onOpenAiMentor}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
              title="فتح المساعد التعليمي الذكي"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>المساعد الذكي</span>
            </button>
          )}

          {/* Visitor / Student Account Info */}
          {visitorUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDashboardClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-cyan-400" />
                <span className="max-w-[100px] truncate">{visitorUser.name}</span>
              </button>

              <button
                onClick={onVisitorLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenVisitorLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-500/10"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* XP Pill */}
          <div 
            onClick={visitorUser ? handleDashboardClick : onOpenVisitorLogin}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 rounded-lg bg-emerald-950/50 border border-emerald-500/30 tabular-nums cursor-pointer hover:bg-emerald-900/40 transition-colors"
            title="نقاط الخبرة XP - اضغط لعرض الشارات"
          >
            <Award className="h-3.5 w-3.5" />
            <span>{xpPoints} XP</span>
          </div>

          {/* Admin Portal Button (hasanxlo101@gmail.com) */}
          {isAdmin ? (
            <button
              onClick={onOpenAdminDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-cyan-500/10"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>لوحة المالك</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
              title="دخول مالك الأكاديمية (hasanxlo101@gmail.com)"
            >
              <Lock className="h-3 w-3 text-cyan-400" />
              <span className="hidden sm:inline">المالك</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-start gap-2 overflow-x-auto px-4 py-2 border-t border-slate-900/80 bg-slate-950/80 text-xs">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 font-medium border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
