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

// Types (unchanged)
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

// Socket Setup (unchanged)
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

// MessageBubble Component (unchanged)
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
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
      onClick={() => onClick?.(message)}
    >
      {!isOwnMessage && (
        <img
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 mt-1 flex-shrink-0 object-cover"
          src={user?.avatar}
          alt="avatar"
          loading="lazy"
        />
      )}
      <div
        className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
          isOwnMessage
            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
        }`}
      >
        <p className="text-xs sm:text-sm break-words">{message.message}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          {message.isEdited && (
            <span className="text-xs text-gray-300">Edited</span>
          )}
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>
      </div>
    </motion.div>
  );
});

// ConversationItem Component (unchanged)
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
    "flex items-center p-2 sm:p-3 my-1 rounded-xl transition-all duration-200 cursor-pointer";
  const activeClasses = isSelected
    ? "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 shadow-md"
    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          src={chat.avatar || user.avatar}
          alt={`${chat.name || chat.id.chatPartnerModel}'s avatar`}
          loading="lazy"
        />
        {chat.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
            {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 px-2 sm:px-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {chat.name || chat.id.chatPartnerModel}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
            {/* {formattedTime} */}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px] sm:max-w-[180px]">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && !isSelected && (
            <span className="bg-purple-500 text-white text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

  // Scroll to bottom function
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
      setTimeout(scrollToBottom, 0); // Scroll after DOM update
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
      // Add message to state immediately for instant UI update
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom(); // Scroll to new message
      reset(); // Clear input
      // Send message to server in the background
      await ApiService.sendMessageParent(newMessage);
      // Optionally update chat heads
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
      // Optionally remove the message from state if sending fails
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
        // Update chat heads
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
      socket.disconnect();
    };
  }, [selectedChatId, scrollToBottom]);

  useEffect(() => {
    fetchChatHeads();
  }, [fetchChatHeads]);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(); // Only fetch messages when chat is selected
    }
  }, [selectedChatId, fetchMessages]);

  const filteredChatHeads = chatHeads.filter((chat) =>
    (chat.name || chat.id.chatPartnerModel)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 overflow-hidden"
      >
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 fixed top-2 left-2 z-50 bg-purple-600 text-white rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Lucide icon={isSidebarOpen ? "X" : "Menu"} className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 z-40 flex flex-col`}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Chikaa
            </h1>
            {/* <div className="mt-3 flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              <Lucide icon="Search" className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="flex-1 bg-transparent ml-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}
          </div>
          <div className="flex-1 overflow-y-auto p-2">
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
                        setSelectedChatId(chat.id.chatPartnerId);
                        setIsSidebarOpen(false);
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
                  No conversations yet
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <>
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        src={
                          chatHeads.find(
                            (ch) => ch.id.chatPartnerId === selectedChatId
                          )?.avatar || user.avatar
                        }
                        alt="avatar"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-lg font-semibold truncate">
                        {chatHeads.find(
                          (ch) => ch.id.chatPartnerId === selectedChatId
                        )?.name || "User"}
                      </h2>
                      <p className="text-gray-200 text-sm">Online</p>
                    </div>
                    <button
                      className="md:hidden p-2 text-white"
                      onClick={() => setIsSidebarOpen(true)}
                    >
                      <Lucide icon="Menu" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <AnimatePresence>
                    {isLoading ? (
                      <motion.div
                        className="flex justify-center items-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <LoadingIcon
                          icon="spinning-circles"
                          className="w-8 h-8"
                        />
                      </motion.div>
                    ) : messages.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 dark:text-gray-400 text-center py-8"
                      >
                        No messages yet
                      </motion.p>
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
                  <div ref={messagesEndRef} className="p-8" />
                </div>
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <textarea
                    {...register("content", { required: true })}
                    placeholder="Type your message..."
                    className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[48px] max-h-[150px] resize-y overflow-y-auto"
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
                    className="p-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    <Lucide icon="Send" className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 dark:text-gray-400 text-lg"
              >
                Select a conversation to start messaging
              </motion.p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessagingPage;
