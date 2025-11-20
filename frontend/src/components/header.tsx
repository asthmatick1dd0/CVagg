import { Button } from "./ui/button";
import LogOutIcon from "@/assets/icons/logout.svg";

const Header = () => {
  return (
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
          <Button variant="link" className="flex items-center justify-center h-16 w-16">
            <img src={LogOutIcon} alt="Log out" className="scale-110" />
          </Button>
        </div>
      </div>
    </section>

  );
};

export default Header;