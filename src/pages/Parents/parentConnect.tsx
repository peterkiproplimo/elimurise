import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import * as ApiService from "../../services/auth";
import Conversation from "./Conversation";
import Messages from "./Messages";
import { useAuth } from "../../contexts/Auth";
interface Message {
  sender: string;
  message: string;
  timestamp: string;
}

interface Parent {
  _id: string;
  first_name: string;
  last_name: string;
}

interface FormData {
  parent: string;
  content: string;
}

// value previously stored
const auth = localStorage.getItem("@AuthData");

let auth_data: { user?: any } = auth ? JSON.parse(auth) : {}; // Ensure `auth_data` is always an object
let user = auth_data.user || null; // Default to `null` if `user` is missing

// Set the default Authorization header for axios

// Now use the token to authenticate the socket connection
const socket: Socket = io(import.meta.env.VITE_API_ENDPOINT, {
  transports: ["websocket"],
  auth: {
    token: `Bearer ${user?.token}`, // Use the token from localStorage
  },
});
console.log(user);
console.log(socket);

interface User {
  name: string;
  avatar: string;
  status: string;
}

function Main() {
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const notify = useRef<NotificationElement>();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [parents, setParents] = useState<Parent[]>([]);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [chatHeads, setChatHeads] = useState<any>([]);
  const auth = localStorage.getItem("@AuthData");

  let auth_data: { user?: any } = auth ? JSON.parse(auth) : {}; // Ensure `auth_data` is always an object
  let user: any = auth_data.user || null; // Default to `null` if `user` is missing
  const getParents = async () => {
    setLoading(true);

    try {
      const response = await ApiService.getParents({
        page: 1,
        limit: 10000,
        search: "",
      });
      setParents(response.data);
      setParentLoading(false);
    } catch (error: any) {
      setMessage("Ooops failed to load");
      setParentLoading(false);
    }
  };

  useEffect(() => {
    socket.emit("register", { userId: user._id, userType: "parent" });

    socket.on("receiveMessage", (newMessage: Message) => {
      console.log(newMessage);
      // fetchMessages();

      setMessages((prev: any) => [...prev, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      console.log("fetching");
      const response = await ApiService.getMessageParent({
        parent: selectedParent,
      });
      console.log(response);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Failed to load messages");
      notify.current?.showToast();
    }
  };
  const fetchChat = async () => {
    setLoading(true);
    try {
      console.log("fetching");
      const response = await ApiService.getChatheads();
      console.log(response);
      setChatHeads(response.chatHeads);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Failed to load messages");
      notify.current?.showToast();
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const newMessage = {
        sender: user._id,
        senderModel: "Parent",
        receiver: selectedParent, // Use selected parent
        receiverModel: "Parent",
        message: data.content,
      };
      console.log(newMessage);
      const response = await ApiService.sendMessageParent(newMessage);

      fetchMessages();

      reset();
      setLoading(false);
      setMessage("Message sent successfully");
      notify.current?.showToast();
    } catch (error) {
      setLoading(false);
      console.log(error);
      setMessage("Failed to send message");
      notify.current?.showToast();
    }
  };
  useEffect(() => {
    getParents();
    fetchChat();
  }, []);

  useEffect(() => {
    fetchMessages();
    console.log(selectedParent);
  }, [selectedParent]);

  return (
    <>
      <div className="">
        <div className="flex bg-white dark:bg-gray-900">
          <div className="w-80 h-screen dark:bg-gray-800 bg-gray-100 p-2 hidden md:block">
            <div className="h-[80vh] overflow-y-auto">
              <div className="text-xl font-extrabold text-gray-600 dark:text-gray-200 p-3">
                Chikaa
              </div>
              <div className="search-chat flex p-3">
                <input
                  className="input text-gray-700 dark:text-gray-200 text-sm p-3 focus:outline-none bg-gray-200 dark:bg-gray-700  w-full rounded-l-md"
                  type="text"
                  placeholder="Search Messages"
                />
                <div className="bg-gray-200 dark:bg-gray-700 flex justify-center items-center pr-3 text-gray-400 rounded-r-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-lg font-semibol text-gray-600 dark:text-gray-200 p-3">
                Recent
              </div>
              <Conversation
                chatHeads={chatHeads}
                onSelectChatHead={setSelectedParent}
              />
            </div>
          </div>
          <div className="flex-grow h-[80vh] p-2 rounded-md">
            <Messages messages={messages} user={user} />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div className="h-15 p-3 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center">
                  <input
                    {...register("content")}
                    className="text-gray-700 dark:text-gray-200 text-sm p-5 focus:outline-none bg-gray-100 dark:bg-gray-800 flex-grow rounded-l-md"
                    type="text"
                    placeholder="Type your message ..."
                  />
                  <button className="bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-r-md p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Success</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
