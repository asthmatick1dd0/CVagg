import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Mail,
  PlusCircle,
  Settings,
  User,
  FileText,
  ChevronRight,
} from "lucide-react";

export interface Account {
  id: string | number;
  name: string;
  email: string;
  resumeCount: number;
  avatarUrl?: string;
}

export interface UserPageProps {
  currentUser: Account;
  accounts?: Account[];
  onLogout?: () => void;
  onSwitchAccount?: (account: Account) => void;
  onSettings?: () => void;
}

function UserAvatar({ avatarUrl, name, size = "lg" }: { avatarUrl?: string; name: string; size?: "sm" | "lg" }) {
  const sizeClasses = size === "lg" ? "w-16 h-16" : "w-9 h-9";
  const iconSize = size === "lg" ? 32 : 18;
  return (
    <div className={`${sizeClasses} rounded-xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0`}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
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

function AccountRow({ account, isActive, onClick }: { account: Account; isActive?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left
        ${isActive ? "border-foreground/30 bg-transparent" : "border-border bg-muted/30 hover:bg-muted/60 cursor-pointer"}`}
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <User size={18} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{account.name}</p>
        <p className="text-xs text-muted-foreground truncate">{account.email}</p>
      </div>
      <ResumeBadge count={account.resumeCount} />
    </button>
  );
}

function AddInfoForm({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="mt-2 flex flex-col gap-2">
      <Input placeholder="Введите информацию..." value={value} onChange={(e) => setValue(e.target.value)} className="h-8 text-sm" autoFocus />
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 h-7 text-xs" onClick={onClose}>Сохранить</Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={onClose}>Отмена</Button>
      </div>
    </div>
  );
}

function UserPage({ currentUser, accounts = [], onLogout, onSwitchAccount, onSettings }: UserPageProps) {
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const otherAccounts = accounts.filter((a) => a.id !== currentUser.id);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center custom-bg">
      <div className="w-[340px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-muted/60 flex flex-col items-center justify-center pt-8 pb-10 px-6 relative">
          <button
            onClick={onLogout}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-black hover:bg-black/10 transition-colors"
            aria-label="Выйти"
          >
            <LogOut size={26} />
          </button>
          <UserAvatar avatarUrl={currentUser.avatarUrl} name={currentUser.name} size="lg" />
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

          <div>
            <button
              onClick={() => setShowAddInfo((v) => !v)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <PlusCircle size={16} />
              <span className="italic">Добавить информацию</span>
            </button>
            {showAddInfo && <AddInfoForm onClose={() => setShowAddInfo(false)} />}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowAccounts((v) => !v)}
              className="flex items-center justify-end text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Сменить аккаунт?</span>
              <ChevronRight size={13} className={`ml-1 transition-transform ${showAccounts ? "rotate-90" : ""}`} />
            </button>

            {showAccounts && (
              <div className="flex flex-col gap-1.5">
                {otherAccounts.map((acc) => (
                  <AccountRow key={acc.id} account={acc} onClick={() => onSwitchAccount?.(acc)} />
                ))}
              </div>
            )}

            <AccountRow account={currentUser} isActive />
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
export { UserAvatar, AccountRow, ResumeBadge };
