import {
  LogOut,
  Mail,
} from "lucide-react";
import type { Account } from "@/types/account.types";

export interface UserPageProps {
  currentUser: Account;
  onLogout?: () => void;
}

function UserPage({ currentUser, onLogout }: UserPageProps) {

  return (
    <div className="flex items-center justify-center rounded-3xl custom-bg">
      <div className="w-[340px] rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-muted/60 flex flex-col items-center justify-center pt-8 pb-10 px-6 relative mt-3 mb-6">
          <button
            onClick={onLogout}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl text-white hover:bg-black/10 transition-colors"
            aria-label="Выйти"
          >
            <LogOut size={26} />
          </button>
        </div>
        <div className="bg-background rounded-3xl flex flex-col gap-4 px-6 pt-6 pb-8 -mt-6 relative z-10">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{currentUser.name} {currentUser.surname}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                <Mail size={14} />
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserPage;
