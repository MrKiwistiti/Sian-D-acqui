import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, Send, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface QuickMessage {
  id: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  projectName?: string;
}

interface ChatWidgetProps {
  currentUser: {
    id: string;
    name: string;
    role: 'startup' | 'investor' | 'admin';
  };
  onOpenFullChat: () => void;
  isOpen?: boolean;
}

// Empty messages - ready for real backend integration
// const mockRecentMessages: QuickMessage[] = [];

export function ChatWidget({ onOpenFullChat }: ChatWidgetProps) { //export function ChatWidget({ currentUser, onOpenFullChat }: ChatWidgetProps) {
  const [messages] = useState<QuickMessage[]>([]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <Card className="h-96">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Messages récents</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onOpenFullChat}>
              <MessageCircle className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onOpenFullChat}>
                  Ouvrir le chat complet
                </DropdownMenuItem>
                <DropdownMenuItem>Marquer tout comme lu</DropdownMenuItem>
                <DropdownMenuItem>Paramètres de notification</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {messages.length > 0 ? (
          <ScrollArea className="h-64">
            <div className="space-y-1 px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    !message.isRead ? 'bg-primary/5 border-l-2 border-primary' : ''
                  }`}
                  onClick={onOpenFullChat}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm truncate ${!message.isRead ? 'font-medium' : ''}`}>
                          {message.senderName}
                        </p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                      {message.projectName && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {message.projectName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Aucun message récent</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={onOpenFullChat}>
              <Send className="h-4 w-4 mr-2" />
              Démarrer une conversation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}