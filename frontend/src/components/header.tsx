import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserPage from "@/pages/UserPage/UserPage";
import { User } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const [isUserPageOpen, setIsUserPageOpen] = useState(false);

  const handleUser = () => {
    setIsUserPageOpen(!isUserPageOpen);
  };
  
  return (
    <>
      <section className="bg-background flex w-full h-16 items-center justify-center p-12">
        <div className="flex flex-row items-center justify-between w-full gap-7">
          <a href="/dashboard">
              <img
                  src="/cvagg_logo_small.svg"
                  alt="CVaggregator logo"
                  className="w-10 h-10 rounded-md"
              />
          </a>
          <div className="flex flex-row items-center gap-2">
            <Button variant="link" className="flex items-center justify-center h-10 w-10 hover:cursor-pointer  hover:bg-primary hover:text-foreground" onClick={handleUser}>
              <User className="scale-200"/> 
            </Button>
          </div>
        </div>
      </section>
      
      {isUserPageOpen && (
        <div className="fixed top-20 right-15" onClick={handleUser}>
          <UserPage
            currentUser={{
              id: user?.id ?? "1",
              name: (user as any)?.name ?? (user as any)?.username ?? user?.email ?? "Name Surname",
              email: user?.email ?? "example@your.mail",
              resumeCount: 0,
            }}
            onLogout={logout}
            onSettings={() => {}}
          />
        </div>
      )}
    </>
  );
};

export default Header;