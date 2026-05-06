import {
  LogOut,
  Mail,
  Settings,
  User,
  FileText,
} from "lucide-react";
import type { Account } from "@/types/account.types";

export interface UserPageProps {
  currentUser: Account;
  onLogout?: () => void;
  onSettings?: () => void;
}

function UserAvatar({ avatar, name, size = "lg" }: { avatar?: string; name: string; size?: "sm" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-16 h-16" : "w-9 h-9";
  const iconSize = size === "lg" ? 32 : 18;
  return (
    <div className={`${sizeClasses} rounded-xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0`}>
      {avatar
        ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
        : <User size={iconSize} className="text-white/70" />
      }
    </div>
  );
}

function ResumeBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-foreground/60 bg-background border border-border rounded px-1.5 py-0.5 shrink-0">
      <FileText size={11} />
      <span>{count}</span>
    </div>
  );
}

function UserPage({ currentUser, onLogout, onSettings }: UserPageProps) {

  return (
    <div className="flex items-center justify-center rounded-3xl custom-bg">
      <div className="w-[340px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-muted/60 flex flex-col items-center justify-center pt-8 pb-10 px-6 relative">
          <button
            onClick={onLogout}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-black hover:bg-black/10 transition-colors"
            aria-label="Выйти"
          >
            <LogOut size={26} />
          </button>
          <UserAvatar avatar={currentUser.avatar} name={currentUser.name} size="lg" />
        </div>
        <div className="bg-card rounded-3xl flex flex-col gap-4 px-6 pt-6 pb-8 -mt-6 relative z-10">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                <Mail size={14} />
                <span>{currentUser.email}</span>
              </div>
            </div>
            <ResumeBadge count={currentUser.resumeCount} />
          </div>

          <div className="h-px bg-border" />

          <button
            onClick={onSettings}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={16} />
            <span className="italic">Настройки</span>
          </button>

        </div>
      </div>
    </div>
  );
}

export default UserPage;
export { UserAvatar, ResumeBadge };
