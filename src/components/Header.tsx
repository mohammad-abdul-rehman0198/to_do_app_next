import Logo from "@/components/icons/Logo";

const Header = () => {
  return (
    <header className="w-[70%] max-[510px]:w-[90%] flex justify-start p-[42px] text-white">
      <div className="flex items-center gap-2">
        <Logo />
        <h1 className="text-[2rem] font-bold">TODO</h1>
      </div>
    </header>
  );
};

export default Header;
