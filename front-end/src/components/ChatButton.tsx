import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MessageCircle } from "lucide-react";
import { ChatSystem } from "./ChatSystem";

interface ChatButtonProps {
  currentUser: {
    id: string;
    name: string;
    role: 'startup' | 'investor' | 'admin';
  };
  unreadCount?: number;
}

export function ChatButton({ currentUser, unreadCount = 0 }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat System Modal */}
      <ChatSystem
        currentUser={currentUser}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}