import { MessageCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import { ButtonType } from "@/utils/enum/ButtonType";

interface FloatingButtonProps {
  onClick: () => void;
}

export const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  return (
    <div>
      <Button
        type={ButtonType.BUTTON}
        onClick={onClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition z-50"
        logo={<MessageCircle size={18} />}
      />
    </div>
  );
};
