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
      } mb-2 sm:mb-4 touch-action-pan-y`}
      onClick={() => onClick?.(message)}
    >
      {!isOwnMessage && (
        <img
          className="w-6 h-6 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 mt-1 flex-shrink-0 object-cover"
          src={user.avatar}
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
        {message.message && (
          <p className="text-xs sm:text-sm break-words">{message.message}</p>
        )}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2">
                {attachment.fileType.startsWith("image/") ? (
                  <img
                    src={`${IMG_URL}${attachment.url}`}
                    alt={attachment.fileName}
                    className="max-w-[150px] sm:max-w-[200px] rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => openZoom(`${IMG_URL}${attachment.url}`)}
                  />
                ) : (
                  <a
                    href={`${IMG_URL}${attachment.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xs sm:text-sm flex items-center gap-1"
                  >
                    <Lucide icon="Paperclip" className="w-4 h-4" />
                    {attachment.fileName} (
                    {(attachment.fileSize / 1024).toFixed(2)} KB)
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
                className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-125"
              />
              <button
                className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                onClick={closeZoom}
                aria-label="Close zoom"
              >
                <Lucide icon="X" className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
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
    <div className="h-[calc(100vh-120px)] flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden touch-action-manipulation">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 overflow-hidden relative"
      >
        {/* Sidebar (Chat Heads) */}
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
              Conversations
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
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ConversationItem
                      chat={chat}
                      isSelected={selectedChatId === chat.id}
                      onClick={() => {
                        console.log("Chat selected:", chat.id);
                        setSelectedChatId(chat.id);
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

        {/* Messages Area */}
        <div
          className={`fixed inset-0 flex flex-col md:flex-1 md:static transform ${
            selectedChatId
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 z-40`}
        >
          {selectedChatId && (
            <>
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
                {/* Header */}
                <div className="bg-gradient-to-r mt-[60px] md:mt-0 from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-3 xs:p-4 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <button
                      className="text-white p-1"
                      onClick={() => setSelectedChatId("")}
                    >
                      <Lucide icon="ArrowLeft" className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img
                        className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 border-white object-cover"
                        src={
                          chatHeads.find((ch) => ch.id === selectedChatId)
                            ?.avatar || user.avatar
                        }
                        alt="avatar"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full border-2 border-white bg-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-base xs:text-lg font-semibold truncate">
                        {chatHeads.find((ch) => ch.id === selectedChatId)
                          ?.learnerName || "Learner"}
                      </h2>
                      <p className="text-gray-200 text-xs xs:text-sm">
                        {
                          chatHeads.find((ch) => ch.id === selectedChatId)
                            ?.streamName
                        }{" "}
                        -{" "}
                        {
                          chatHeads.find((ch) => ch.id === selectedChatId)
                            ?.classManagerName
                        }
                      </p>
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
                  <div ref={messagesEndRef} className="p-1 xs:p-1" />
                </div>
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
                className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
              >
                {attachments.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    <AnimatePresence>
                      {attachments.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="relative flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <Lucide
                            icon={
                              file.type.startsWith("image/") ? "Image" : "File"
                            }
                            className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px] sm:max-w-[140px]">
                            {file.name}
                          </span>
                          <motion.button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="ml-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Lucide icon="X" className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-transparent transition-all duration-300"
                >
                  <textarea
                    {...register("content")}
                    placeholder="Type your message..."
                    className="flex-1 p-2 bg-transparent text-gray-900 dark:text-white text-sm sm:text-base resize-none min-h-[40px] max-h-[100px] overflow-y-auto focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />
                  <div className="flex items-center gap-2 pr-2">
                    <motion.label
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-500 hover:text-purple-500 cursor-pointer transition-colors duration-200"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Lucide icon="Paperclip" className="w-5 h-5" />
                    </motion.label>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full disabled:bg-gray-400 transition-all duration-300"
                      disabled={isSubmitting}
                      aria-label="Send message"
                    >
                      <Lucide icon="Send" className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessagingPage;
