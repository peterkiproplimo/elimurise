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
import { IMG_URL } from "../../utils/constants";

// Types
interface Message {
  id?: string;
  learner?: string; // Add learner field to tie messages to a specific learner
  sender: string;
  senderModel: string;
  receiver: string;
  receiverModel: string;
  message?: string;
  attachments?: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }[];
  createdAt: Date;
  isEdited?: boolean;
}

interface ChatHead {
  id: string; // learnerId
  learnerName: string;
  streamName: string;
  classManagerId: string;
  classManagerName: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unreadCount: number;
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

interface FormData {
  content: string;
  attachments?: FileList;
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
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openZoom = (imageUrl: string) => setZoomedImage(imageUrl);
  const closeZoom = () => setZoomedImage(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4`}
      onClick={() => onClick?.(message)}
    >
      {!isOwnMessage && (
        <img
          className="w-8 h-8 rounded-full mr-3 mt-1 flex-shrink-0 object-cover border-2 border-gray-200 dark:border-gray-700"
          src={user.avatar}
          alt="avatar"
          loading="lazy"
        />
      )}
      <div
        className={`max-w-[75%] p-4 rounded-2xl shadow-lg transition-all duration-200 ${
          isOwnMessage
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700"
        }`}
      >
        {message.message && (
          <p className="text-sm leading-relaxed break-words">{message.message}</p>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2">
                {attachment.fileType.startsWith("image/") ? (
                  <img
                    src={`${IMG_URL}${attachment.url}`}
                    alt={attachment.fileName}
                    className="max-w-[200px] rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => openZoom(`${IMG_URL}${attachment.url}`)}
                  />
                ) : (
                  <a
                    href={`${IMG_URL}${attachment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                      isOwnMessage 
                        ? "bg-blue-500/20 text-blue-100 hover:bg-blue-500/30" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Lucide icon="Paperclip" className="w-4 h-4" />
                    <span className="text-sm">{attachment.fileName}</span>
                    <span className="text-xs opacity-75">
                      ({(attachment.fileSize / 1024).toFixed(2)} KB)
                    </span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeZoom}
          >
            <div
              className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomedImage}
                alt="Zoomed image"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <button
                className="absolute top-4 right-4 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
                onClick={closeZoom}
                aria-label="Close zoom"
              >
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end mt-2 space-x-2">
          {message.isEdited && (
            <span className={`text-xs ${
              isOwnMessage ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
            }`}>
              Edited
            </span>
          )}
          <span className={`text-xs ${
            isOwnMessage ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}>
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
    if (!chat.lastMessageAt) return "";
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
          alt={`${chat.learnerName}'s avatar`}
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
            {chat.learnerName}
          </h3>
          <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
            {formattedTime}
          </span>
        </div>
        <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300">
          {chat.streamName} - {chat.classManagerName}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[180px]">
            {chat.lastMessage === "No messages"
              ? "No messages yet"
              : chat.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
});

// Main Component
const MessagingPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHeads, setChatHeads] = useState<ChatHead[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>(""); // Now learnerId
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>();

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
          id: ch.learnerId,
          learnerName: ch.learnerName,
          streamName: ch.streamName,
          classManagerId: ch.classManagerId,
          classManagerName: ch.classManagerName.trim() || "Not assigned",
          lastMessage: ch.lastMessage,
          lastMessageAt: ch.lastMessageAt ? new Date(ch.lastMessageAt) : null,
          unreadCount: ch.unreadCount,
          avatar:
            "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png",
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
        learner: selectedChatId,
        parent: user.id,
      });
      console.log("Messages response:", response);
      fetchChatHeads();
      setMessages(
        response.data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
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
    if (!selectedChatId || (!data.content && attachments.length === 0)) return;

    const selectedChat = chatHeads.find((ch) => ch.id === selectedChatId);
    if (!selectedChat) return;

    const formData = new FormData();
    formData.append("learner", selectedChatId);
    formData.append("sender", user.id);
    formData.append("senderModel", "Parent");
    formData.append("receiver", selectedChat.classManagerId);
    formData.append("receiverModel", "PortalUser");
    formData.append("message", data.content || "");
    attachments.forEach((file) => formData.append("attachments", file));

    const newMessage: Message = {
      learner: selectedChatId,
      sender: user.id,
      senderModel: "Parent",
      receiver: selectedChat.classManagerId,
      receiverModel: "PortalUser",
      message: data.content || "",
      attachments: attachments.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })),
      createdAt: new Date(),
    };

    try {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
      reset();
      setAttachments([]);
      await ApiService.sendMessageParent(formData);
      // socket.emit("sendMessage", {
      //   learner: selectedChatId,
      //   receiver: selectedChat.classManagerId,
      //   message: data.content || "",
      //   attachments: attachments.map((file) => ({
      //     url: URL.createObjectURL(file),
      //     fileName: file.name,
      //     fileType: file.type,
      //     fileSize: file.size,
      //   })),
      // });
      setChatHeads((prev) =>
        prev.map((ch) =>
          ch.id === selectedChatId
            ? {
                ...ch,
                lastMessage: newMessage.message || "Attachment sent",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    socket.emit("register", { userId: user.id, userType: "parent" });
    socket.on("receiveMessage", (newMessage: Message) => {
      if (newMessage.learner === selectedChatId) {
        setMessages((prev) => [
          ...prev,
          { ...newMessage, createdAt: new Date(newMessage.createdAt) },
        ]);
        scrollToBottom();
        setChatHeads((prev) =>
          prev.map((ch) =>
            ch.id === newMessage.learner
              ? {
                  ...ch,
                  lastMessage: newMessage.message || "Attachment received",
                  lastMessageAt: newMessage.createdAt,
                  unreadCount:
                    newMessage.receiver === user.id
                      ? ch.unreadCount + 1
                      : ch.unreadCount,
                }
              : ch
          )
        );
        if (!audioRef.current) {
          audioRef.current = new Audio("/audio/notification.mp3");
        }
        audioRef.current
          .play()
          .catch((err) => console.error("Audio error:", err));
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
    if (selectedChatId) fetchMessages();
  }, [selectedChatId, fetchMessages]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
      });
    }
  }, [selectedChatId, messages]);

  const filteredChatHeads = chatHeads.filter((chat) =>
    chat.learnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Messaging Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Messages</h1>
              <p className="text-blue-100">Stay connected with teachers and school administrators</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{chatHeads.length}</div>
                <div className="text-sm text-blue-100">Conversations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {chatHeads.filter(ch => ch.unreadCount > 0).length}
                </div>
                <div className="text-sm text-blue-100">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {chatHeads.reduce((sum, ch) => sum + ch.unreadCount, 0)}
                </div>
                <div className="text-sm text-blue-100">Total Messages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="flex h-[calc(100vh-280px)]">
            {/* Sidebar (Chat Heads) */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Conversations
                  </h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200"
                    />
                    <Lucide icon="Search" className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                  </div>
                ) : filteredChatHeads.length > 0 ? (
                  <div className="p-2">
                    {filteredChatHeads.map((chat) => (
                      <div
                        key={chat.id}
                        className={`mb-2 rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedChatId === chat.id
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                        }`}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                src={chat.avatar || user.avatar}
                                alt={`${chat.learnerName}'s avatar`}
                                loading="lazy"
                              />
                              {chat.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                                  {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {chat.learnerName}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                  {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) : ""}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {chat.streamName} • {chat.classManagerName}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {chat.lastMessage === "No messages"
                                  ? "No messages yet"
                                  : chat.lastMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <Lucide icon="MessageCircle" className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Start a conversation with teachers or administrators
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedChatId ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        src={chatHeads.find((ch) => ch.id === selectedChatId)?.avatar || user.avatar}
                        alt="avatar"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {chatHeads.find((ch) => ch.id === selectedChatId)?.learnerName || "Learner"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {chatHeads.find((ch) => ch.id === selectedChatId)?.streamName} • {
                            chatHeads.find((ch) => ch.id === selectedChatId)?.classManagerName
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Lucide icon="MessageSquare" className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          No messages yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                          Start the conversation by sending a message
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <MessageBubble
                            key={message.id || message.createdAt.toString()}
                            message={message}
                            isOwnMessage={message.sender === user.id}
                            onClick={(msg) => console.log("Message clicked:", msg)}
                          />
                        ))}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {attachments.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                          >
                            <Lucide
                              icon={file.type.startsWith("image/") ? "Image" : "File"}
                              className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="ml-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Lucide icon="X" className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          {...register("content")}
                          placeholder="Type your message..."
                          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200"
                          rows={1}
                          disabled={isSubmitting}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Lucide icon="Paperclip" className="w-5 h-5" />
                        </label>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Lucide icon="Send" className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Lucide icon="MessageCircle" className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
