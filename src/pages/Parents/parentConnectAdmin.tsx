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
interface AdminMessage {
  id?: string;
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

interface ParentChatHead {
  parentId: string;
  parentName: string;
  lastMessage: string;
  lastMessageAt: Date | null;
  unreadCount: number;
  avatar?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  school: {
    _id: string;
  };
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
    "Admin",
  avatar:
    auth.user?.avatar ||
    "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png",
  status: "online",
  school: auth.user?.school,
};

const socket: Socket = io(new URL(import.meta.env.VITE_API_ENDPOINT).origin, {
  transports: ["websocket"],
  auth: { token: `Bearer ${auth.user?.token}` },
});

// MessageBubble Component (unchanged)
const MessageBubble: React.FC<{
  message: AdminMessage;
  isOwnMessage: boolean;
  onClick?: (message: AdminMessage) => void;
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
      } mb-2 sm:mb-4`}
      onClick={() => onClick?.(message)}
    >
      {!isOwnMessage && (
        <img
          className="w-6 h-6 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 mt-1 flex-shrink-0 object-cover"
          src={
            "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
          }
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
                    className="max-w-[150px] sm:max-w-[200px] rounded-lg shadow-sm cursor-pointer hover:opacity-90"
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
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <button
                className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
                onClick={closeZoom}
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

// ParentItem Component (unchanged)
const ParentItem: React.FC<{
  chat: ParentChatHead;
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
    "flex items-center p-2 xs:p-3 my-1 rounded-xl transition-all duration-200 cursor-pointer";
  const activeClasses = isSelected
    ? "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 shadow-md"
    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <div className={`${baseClasses} ${activeClasses}`} onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img
          className="w-10 h-10 xs:w-12 xs:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
          src={
            "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
          }
          alt={`${chat.parentName}'s avatar`}
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
            {chat.parentName}
          </h3>
          <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
            {formattedTime}
          </span>
        </div>
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
const AdminMessagingPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [chatHeads, setChatHeads] = useState<ParentChatHead[]>([]);
  const [allParents, setAllParents] = useState<
    { parentId: string; parentName: string; avatar?: string }[]
  >([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
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
      const response = await ApiService.getAdminParentChats();
      setChatHeads(
        response.chatHeads.map((ch: any) => ({
          parentId: ch.parentId,
          parentName: ch.parentName,
          lastMessage: ch.lastMessage,
          lastMessageAt: ch.lastMessageAt ? new Date(ch.lastMessageAt) : null,
          unreadCount: ch.unreadCount,
          avatar: ch.avatar,
        }))
      );
    } catch (error) {
      console.error("Failed to load parent chats:", error);
    }
  }, []);

  const fetchAllParents = useCallback(async () => {
    try {
      const response = await ApiService.getParents({
        page: pagination.current_page,
        limit: pagination.per_page,
        search: searchQuery,
        sortBy: "name",
        sortOrder: "asc",
      });
      setAllParents(
        response.data.map((p: any) => ({
          parentId: p._id, // Assuming _id is the parent ID
          parentName: `${p.first_name} ${p.last_name}`.trim(),
          avatar: p.avatar,
        }))
      );
      const pag = response.pagination;
      setPagination({
        current_page: pag.current_page,
        total: pag.total,
        total_pages: pag.total_pages,
        per_page: pag.per_page,
      });
    } catch (error) {
      console.error("Failed to load all parents:", error);
    }
  }, [pagination.current_page, pagination.per_page, searchQuery]);

  const fetchMessages = useCallback(async () => {
    if (!selectedParentId) return;
    setIsLoading(true);
    try {
      const response = await ApiService.getAdminMessages({
        parentId: selectedParentId,
      });
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
  }, [selectedParentId, scrollToBottom]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedParentId || (!data.content && attachments.length === 0))
      return;

    const formData = new FormData();
    formData.append("sender", user?.school?._id);
    formData.append("senderModel", "PortalUser");
    formData.append("learner", user?.school?._id);
    formData.append("receiver", selectedParentId);
    formData.append("receiverModel", "Parent");
    formData.append("message", data.content || "");
    attachments.forEach((file) => formData.append("attachments", file));
    console.log(user);
    const newMessage: AdminMessage = {
      sender: user?.school?._id,
      senderModel: "PortalUser",
      receiver: selectedParentId,
      receiverModel: "Parent",
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
      await ApiService.sendMessage(formData);
      socket.emit("admin message", {
        parentId: selectedParentId,
        message: data.content || "",
        attachments: attachments.map((file) => ({
          url: URL.createObjectURL(file),
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        })),
      });
      setChatHeads((prev) => {
        const existingChat = prev.find(
          (ch) => ch.parentId === selectedParentId
        );
        if (existingChat) {
          return prev.map((ch) =>
            ch.parentId === selectedParentId
              ? {
                  ...ch,
                  lastMessage: newMessage.message || "Attachment sent",
                  lastMessageAt: newMessage.createdAt,
                }
              : ch
          );
        }
        const parent = allParents.find((p) => p.parentId === selectedParentId);
        return [
          {
            parentId: selectedParentId,
            parentName: parent?.parentName || "Unknown Parent",
            lastMessage: newMessage.message || "Attachment sent",
            lastMessageAt: newMessage.createdAt,
            unreadCount: 0,
            avatar: parent?.avatar,
          },
          ...prev,
        ];
      });
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
    socket.emit("register", { userId: user?.school?._id, userType: "admin" });
    socket.on("receiveMessage", (newMessage: AdminMessage) => {
      if (
        newMessage.receiver === user?.school?._id &&
        newMessage.sender === selectedParentId
      ) {
        setMessages((prev) => [
          ...prev,
          { ...newMessage, createdAt: new Date(newMessage.createdAt) },
        ]);
        scrollToBottom();
        setChatHeads((prev) =>
          prev.map((ch) =>
            ch.parentId === newMessage.sender
              ? {
                  ...ch,
                  lastMessage: newMessage.message || "Attachment received",
                  lastMessageAt: newMessage.createdAt,
                  unreadCount: ch.unreadCount + 1,
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
  }, [selectedParentId, scrollToBottom]);

  useEffect(() => {
    fetchChatHeads();
    fetchAllParents();
  }, [fetchChatHeads, fetchAllParents, searchQuery]);

  useEffect(() => {
    if (selectedParentId) fetchMessages();
  }, [selectedParentId, fetchMessages]);

  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
      });
    }
  }, [selectedParentId, messages]);

  const filteredChatHeads = chatHeads.filter((chat) =>
    chat.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredParentsForModal = allParents.filter((parent) =>
    parent.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 overflow-hidden relative"
      >
        {/* Sidebar (Parent Chats) */}
        <div
          ref={sidebarRef}
          className={`fixed inset-0 w-full md:w-72 xs:md:w-80 bg-white dark:bg-gray-800 shadow-lg transform ${
            selectedParentId
              ? "translate-x-full md:translate-x-0"
              : "translate-x-0"
          } md:relative transition-transform duration-300 z-50 flex flex-col`}
        >
          <div className="p-3 xs:p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h1 className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white">
              Parent Chats
            </h1>
            <input
              type="text"
              placeholder="Search parents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-1 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 xs:p-3">
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
                    key={chat.parentId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ParentItem
                      chat={chat}
                      isSelected={selectedParentId === chat.parentId}
                      onClick={() => setSelectedParentId(chat.parentId)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 dark:text-gray-400 text-center py-8"
                >
                  No parent chats yet
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsNewChatModalOpen(true)}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:from-purple-700 hover:to-indigo-700 z-50"
            >
              <Lucide icon="Plus" className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className={`fixed inset-0 flex flex-col md:flex-1 md:static transform ${
            selectedParentId
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 z-40`}
        >
          {selectedParentId && (
            <>
              <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-h-0">
                {/* Header */}
                <div className="bg-gradient-to-r mt-[60px] md:mt-0 from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 p-3 xs:p-4 shadow-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2 xs:space-x-3">
                    <button
                      className="text-white p-1"
                      onClick={() => setSelectedParentId("")}
                    >
                      <Lucide icon="ArrowLeft" className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img
                        className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 border-white object-cover"
                        src={
                          "https://cdn.pixabay.com/photo/2017/01/31/21/23/avatar-2027366_960_720.png"
                        }
                        alt="avatar"
                        loading="lazy"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full border-2 border-white bg-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white text-base xs:text-lg font-semibold truncate">
                        {chatHeads.find(
                          (ch) => ch.parentId === selectedParentId
                        )?.parentName ||
                          allParents.find(
                            (p) => p.parentId === selectedParentId
                          )?.parentName ||
                          "Parent"}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-3 xs:p-4"
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
                          isOwnMessage={message.sender === user?.school?._id}
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
                          className="relative flex items-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-2 rounded-xl shadow-sm"
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
                            className="ml-2 text-red-500 hover:text-red-600"
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
                  className="relative flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <textarea
                    {...register("content")}
                    placeholder="Type your message..."
                    className="flex-1 p-2 bg-transparent text-gray-900 dark:text-white text-sm sm:text-base resize-none min-h-[40px] max-h-[100px] overflow-y-auto focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
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
                      className="p-1 text-gray-500 hover:text-purple-500 cursor-pointer"
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
                      className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      <Lucide icon="Send" className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            </>
          )}
        </div>

        {/* Floating Start New Chat Button */}

        {/* New Chat Modal */}
        {isNewChatModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Start New Chat
                </h2>
                <button
                  onClick={() => setIsNewChatModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Lucide icon="X" className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-4 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-sm"
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredParentsForModal.length > 0 ? (
                  filteredParentsForModal.map((parent) => (
                    <div
                      key={parent.parentId}
                      className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedParentId(parent.parentId);
                        setIsNewChatModalOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <img
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        src={parent.avatar || user.avatar}
                        alt={`${parent.parentName}'s avatar`}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {parent.parentName}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No parents found
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminMessagingPage;
