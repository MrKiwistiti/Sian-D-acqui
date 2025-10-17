import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, X, MessageCircle, Plus, ArrowLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  type: 'startup-investor' | 'startup-admin' | 'group';
  projectId?: string;
  projectName?: string;
}

interface Contact {
  id: string;
  name: string;
  role: 'startup' | 'investor' | 'admin';
  avatar?: string;
  company?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatSystemProps {
  currentUser: {
    id: string;
    name: string;
    role: 'startup' | 'investor' | 'admin';
  };
  isOpen: boolean;
  onClose: () => void;
}

// Sample data with contacts available to start conversations
const mockContacts: Contact[] = [
  {
    id: "investor-1",
    name: "Emma Rodriguez",
    role: "investor",
    company: "Green Venture Partners",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b600?w=400",
    isOnline: true,
  },
  {
    id: "investor-2", 
    name: "Lucas Dubois",
    role: "investor",
    company: "Innovation Capital",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "startup-ecotrack",
    name: "EcoTrack Team",
    role: "startup",
    company: "EcoTrack",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
    isOnline: true,
  },
  {
    id: "admin-javier",
    name: "Javier Admin",
    role: "admin",
    company: "JEB Incubator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    isOnline: true,
  }
];

export function ChatSystem({ currentUser, isOpen, onClose }: ChatSystemProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    searchQuery === "" || 
    conv.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: currentUser.id,
      timestamp: new Date(),
      type: 'text',
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
    }));

    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation
        ? { ...conv, lastMessage: newMessage }
        : conv
    ));
    
    setMessageText("");
  };

  const startNewConversation = (contact: Contact) => {
    const conversationId = `conv-${currentUser.id}-${contact.id}-${Date.now()}`;
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `Conversation démarrée avec ${contact.name}`,
      sender: 'system',
      timestamp: new Date(),
      type: 'system',
      isRead: true
    };

    const newConversation: Conversation = {
      id: conversationId,
      participants: [currentUser.id, contact.id],
      lastMessage: systemMessage,
      unreadCount: 0,
      type: 'startup-investor'
    };

    setConversations(prev => [newConversation, ...prev]);
    setMessages(prev => ({
      ...prev,
      [conversationId]: [systemMessage]
    }));

    setSelectedConversation(conversationId);
    setShowNewChat(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  const getContactById = (id: string) => {
    return mockContacts.find(c => c.id === id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[80vh] flex overflow-hidden">
        {/* Sidebar - Conversations */}
        <div className="w-80 border-r flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>{showNewChat ? 'Nouveau Chat' : 'Messages'}</CardTitle>
              <div className="flex items-center gap-2">
                {showNewChat ? (
                  <Button variant="ghost" size="sm" onClick={() => setShowNewChat(false)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setShowNewChat(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            <div className="px-4 space-y-2">
              {showNewChat ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Démarrer une conversation avec :</p>
                  {mockContacts
                    .filter(contact => contact.id !== currentUser.id)
                    .map((contact) => (
                      <div
                        key={contact.id}
                        className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                        onClick={() => startNewConversation(contact)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{contact.name}</p>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${contact.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <Badge variant="outline" className="text-xs">
                                  {contact.role}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <>
                  {filteredConversations.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">Aucune conversation</p>
                      <Button variant="outline" size="sm" onClick={() => setShowNewChat(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle conversation
                      </Button>
                    </div>
                  )}
                  {filteredConversations.map((conv) => {
                    const contact = getContactById(conv.participants.find(p => p !== currentUser.id) || "");
                    return (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conv.id ? 'bg-primary/10' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact?.avatar} />
                            <AvatarFallback>{contact?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{contact?.name || 'Unknown'}</p>
                              <div className="flex items-center gap-1">
                                {conv.unreadCount > 0 && (
                                  <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                                    {conv.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conv.lastMessage.timestamp)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage.text}
                            </p>
                            {conv.projectName && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {conv.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const contact = getContactById(selectedConv?.participants.find(p => p !== currentUser.id) || "");
                    return (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact?.avatar} />
                          <AvatarFallback>{contact?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{contact?.name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${contact?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                            {contact?.isOnline ? 'En ligne' : `Vu ${contact?.lastSeen ? formatLastSeen(contact.lastSeen) : ''}`}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                      <DropdownMenuItem>Archiver la conversation</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Bloquer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((message) => {
                    const isCurrentUser = message.sender === currentUser.id;
                    const contact = getContactById(message.sender);
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact?.avatar} />
                            <AvatarFallback>{contact?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : ''}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.type === 'system' 
                                ? 'bg-muted text-muted-foreground text-center'
                                : isCurrentUser 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Tapez votre message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Sélectionnez une conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez une conversation pour commencer à échanger
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowNewChat(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle conversation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}