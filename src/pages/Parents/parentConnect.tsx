import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import * as ApiService from "../../services/auth";

// Types
interface Message {
  id?: string;
  sender: string;
  senderModel: string;
  receiver: string;
  receiverModel: string;
  message: string;
  createdAt: Date;
  isEdited?: boolean;
}

interface ChatHead {
  id: { chatPartnerId: string; chatPartnerModel: string };
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  avatar?: string;
  name?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

interface FormData {
  content: string;
}

// Socket Setup
const auth = JSON.parse(localStorage.getItem("@AuthData") || "{}");
const user: User = {
  id: auth.user?._id || "",
  name:
    `${auth.user?.first_name || ""} ${auth.user?.last_name || ""}`.trim() ||
    "User",
  avatar:
    auth.user?.avatar ||
    "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png",
  status: "online",
};

const socket: Socket = io(new URL(import.meta.env.VITE_API_ENDPOINT).origin, {
  transports: ["websocket"],
  auth: { token: `Bearer ${auth.user?.token}` },
});

// MessageBubble Component
const MessageBubble: React.FC<{
  message: Message;
  isOwnMessage: boolean;
  onClick?: (message: Message) => void;
}> = React.memo(({ message, isOwnMessage, onClick }) => {
  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(message.createdAt)),
    [message.createdAt]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-2 sm:mb-4 touch-action-pan-y`}
      onClick={() => onClick?.(message)}
    >
      {!isOwnMessage && (
        <img
          className="w-6 h-6 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 mt-1 flex-shrink-0 object-cover"
          src={user?.avatar}
          alt="avatar"
          loading="lazy"
        />
      )}
      <div
        className={`max-w-[75%] xs:max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-2xl shadow-sm transition-all duration-200 ${
          isOwnMessage
            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
        }`}
      >
        <p className="text-xs sm:text-sm break-words">{message.message}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          {message.isEdited && (
            <span className="text-[10px] sm:text-xs text-gray-300">Edited</span>
          )}
          <span className="text-[10px] sm:text-xs text-gray-400">
            {formattedTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// ConversationItem Component
const ConversationItem: React.FC<{
  chat: ChatHead;
  isSelected: boolean;
  onClick: () => void;
}> = React.memo(({ chat, isSelected, onClick }) => {
  const formattedTime = useMemo(() => {
    const date = new Date(chat.lastMessageAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString();
  }, [chat.lastMessageAt]);

  const baseClasses =
    "flex items-center p-2 xs:p-3 my-1 rounded-xl transition-all duration-200 cursor-pointer touch-action-manipulation";
  const activeClasses = isSelected
    ? "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 shadow-md"
    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img
          className="w-10 h-10 xs:w-12 xs:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          src={chat.avatar || user.avatar}
          alt={`${chat.name || chat.id.chatPartnerModel}'s avatar`}
          loading="lazy"
        />
        {chat.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center rounded-full">
            {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 px-2 xs:px-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm xs:text-base font-semibold text-gray-900 dark:text-white truncate">
            {chat.name || chat.id.chatPartnerModel}
          </h3>
          <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
            {formattedTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[180px]">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && !isSelected && (
            <span className="bg-purple-500 text-white text-[10px] xs:text-xs font-medium px-1 xs:px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Main Component
const MessagingPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHeads, setChatHeads] = useState<ChatHead[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  const fetchChatHeads = useCallback(async () => {
    try {
      const response = await ApiService.getChatheads();
      setChatHeads(
        response.chatHeads.map((ch: any) => ({
          id: ch._id,
          lastMessage: ch.lastMessage,
          lastMessageAt: new Date(ch.lastMessageAt),
          unreadCount: ch.unreadCount,
          avatar: ch.avatar,
          name: ch.name,
        }))
      );
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedChatId) return;
    setIsLoading(true);
    try {
      const response = await ApiService.getMessageParent({
        parent: selectedChatId,
      });
      setMessages(
        response.data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt || msg.createdAt),
        }))
      );
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, scrollToBottom]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedChatId) return;
    const newMessage: Message = {
      sender: user.id,
      senderModel: "Parent",
      receiver: selectedChatId,
      receiverModel: "Parent",
      message: data.content,
      createdAt: new Date(),
    };
    try {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
      reset();
      await ApiService.sendMessageParent(newMessage);
      setChatHeads((prev) =>
        prev.map((ch) =>
          ch.id.chatPartnerId === selectedChatId
            ? {
                ...ch,
                lastMessage: newMessage.message,
                lastMessageAt: newMessage.createdAt,
              }
            : ch
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg !== newMessage));
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    socket.emit("register", { userId: user.id, userType: "parent" });
    socket.on("receiveMessage", (newMessage: Message) => {
      if (
        newMessage.receiver === selectedChatId ||
        newMessage.sender === selectedChatId
      ) {
        setMessages((prev) => [
          ...prev,
          { ...newMessage, createdAt: new Date(newMessage.createdAt) },
        ]);
        scrollToBottom();
        setChatHeads((prev) =>
          prev.map((ch) =>
            ch.id.chatPartnerId === newMessage.sender
              ? {
                  ...ch,
                  lastMessage: newMessage.message,
                  lastMessageAt: newMessage.createdAt,
                  unreadCount:
                    selectedChatId === newMessage.sender
                      ? ch.unreadCount
                      : ch.unreadCount + 1,
                }
              : ch
          )
        );
        if (!audioRef.current) {
          audioRef.current = new Audio("/audio/notification.mp3");
        }
        audioRef.current.play();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedChatId, scrollToBottom]);

  useEffect(() => {
    fetchChatHeads();
  }, [fetchChatHeads]);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages();
    }
  }, [selectedChatId, fetchMessages]);
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 0);
  }, [selectedChatId, messages]);

  const filteredChatHeads = chatHeads.filter((chat) =>
    (chat.name || chat.id.chatPartnerModel)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden touch-action-manipulation">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 overflow-hidden relative"
      >
        {/* Sidebar (Chat Heads) - Visible by default on mobile */}
        <div
          ref={sidebarRef}
          className={`fixed inset-0 w-full md:w-72 xs:md:w-80 bg-white dark:bg-gray-800 shadow-lg transform ${
            selectedChatId
              ? "translate-x-full md:translate-x-0"
              : "translate-x-0"
          } md:relative transition-transform duration-300 z-50 flex flex-col`}
        >
          <div className="p-3 xs:p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white">
              Chikaa
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto p-2 xs:p-3 touch-action-pan-y">
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  className="flex justify-center items-center h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </motion.div>
              ) : filteredChatHeads.length > 0 ? (
                filteredChatHeads.map((chat) => (
                  <motion.div
                    key={chat.id.chatPartnerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ConversationItem
                      chat={chat}
                      isSelected={selectedChatId === chat.id.chatPartnerId}
                      onClick={() => {
                        console.log("Chat selected:", chat.id.chatPartnerId); // Debug
                        setSelectedChatId(chat.id.chatPartnerId);
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 dark:text-gray-400 text-center py-8"
                >
                  No conversations yet - Debug: chatHeads length:{" "}
                  {chatHeads.length}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages Area - Hidden by default on mobile */}
        <div
          className={`fixed inset-0 flex flex-col md:flex-1 md:static transform ${
            selectedChatId
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 z-40`}
        >
          {selectedChatId && (
            <>
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0 ">
                {/* Header with Back Button */}
                <div className="bg-gradient-to-r mt-[60px] md:mt-0 from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-3 xs:p-4 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <button
                      className="text-white p-1"
                      onClick={() => {
                        console.log("Back to chat list"); // Debug
                        setSelectedChatId("");
                      }}
                    >
                      <Lucide icon="ArrowLeft" className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img
                        className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 border-white object-cover"
                        src={
                          chatHeads.find(
                            (ch) => ch.id.chatPartnerId === selectedChatId
                          )?.avatar || user.avatar
                        }
                        alt="avatar"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full border-2 border-white bg-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-base xs:text-lg font-semibold truncate">
                        {chatHeads.find(
                          (ch) => ch.id.chatPartnerId === selectedChatId
                        )?.name || "User"}
                      </h2>
                      <p className="text-gray-200 text-xs xs:text-sm">Online</p>
                    </div>
                  </div>
                </div>
                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 xs:p-4 touch-action-pan-y"
                >
                  <AnimatePresence>
                    {isLoading ? (
                      <motion.div>{/* Loading spinner unchanged */}</motion.div>
                    ) : messages.length === 0 ? (
                      <motion.p>{/* No messages text unchanged */}</motion.p>
                    ) : (
                      messages.map((message) => (
                        <MessageBubble
                          key={message.id || message.createdAt.toString()}
                          message={message}
                          isOwnMessage={message.sender === user.id}
                          onClick={(msg) =>
                            console.log("Message clicked:", msg)
                          }
                        />
                      ))
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} className="p-1 xs:p-1" />
                </div>
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 xs:p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <textarea
                    {...register("content", { required: true })}
                    placeholder="Type your message..."
                    className="flex-1 p-2 xs:p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[40px] xs:min-h-[48px] max-h-[120px] xs:max-h-[150px] resize-y overflow-y-auto text-sm xs:text-base"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="p-2 xs:p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    <Lucide icon="Send" className="w-4 h-4 xs:w-5 xs:h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessagingPage;
