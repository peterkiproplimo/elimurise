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
    token: `Bearer ${user.token}`, // Use the token from localStorage
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
  const [selectedParent, setSelectedParent] = useState<string>(
    "676e2905deac6e09363e2dcf"
  );
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
    socket.emit("register", { userId: user.id, userType: "parent" });

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const newMessage = {
        sender: user.id,
        senderModel: "Parent",
        receiver: selectedParent, // Use selected parent
        receiverModel: "Parent",
        message: data.content,
      };

      socket.emit("sendMessage", newMessage);
      fetchMessages();

      reset();
      setLoading(false);
      setMessage("Message sent successfully");
      notify.current?.showToast();
    } catch (error) {
      setLoading(false);
      setMessage("Failed to send message");
      notify.current?.showToast();
    }
  };
  useEffect(() => {
    getParents();
  }, []);

  useEffect(() => {
    fetchMessages();
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
              <Conversation />
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
      {/* <div className="flex-1 bg-gray-100 w-full h-full overflow-auto">
        <div className="main-body container m-auto w-11/12 h-full flex flex-col">
          <div className="py-4 flex-2 flex flex-row">
            <div className="flex-1">
              <span className="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
                <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </span>
              </span>
              <span className="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex-1 text-right">
              <span className="inline-block text-gray-700">
                Status:{" "}
                <span className="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>{" "}
                <b>Online</b>
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </span>
              </span>

              <span className="inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                  >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </span>
              </span>
            </div>
          </div>

          <div className="main flex-1 flex flex-col overflow-auto">
            <div className="hidden lg:block heading flex-2">
              <h1 className="text-3xl text-gray-700 mb-4">Chat</h1>
            </div>

            <div className="flex-1 flex h-full">
              <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
                <div className="search flex-2 pb-6 px-2">
                  <input
                    type="text"
                    className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
                    placeholder="Search"
                  />
                </div>
                <div className="flex-1 h-full overflow-auto px-2">
                  {parents.map((parent) => (
                    <div
                      key={parent._id}
                      className="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md"
                      onClick={() => setSelectedParent(parent._id)}
                    >
                      <div className="flex-2">
                        <div className="w-12 h-12 relative">
                          <img
                            className="w-12 h-12 rounded-full mx-auto"
                            src="../resources/profile-image.png"
                            alt="chat-user"
                          />
                          <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                        </div>
                      </div>
                      <div className="flex-1 px-2">
                        <div className="truncate w-32">
                          <span className="text-gray-800">
                            {parent.first_name} {parent.last_name}
                          </span>
                        </div>
                        <div>
                          <small className="text-gray-600">Yea, Sure!</small>
                        </div>
                      </div>
                      <div className="flex-2 text-right">
                        <div>
                          <small className="text-gray-500">15 April</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chat-area flex-1 flex flex-col">
                <div className="flex-3">
                  <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-200">
                    Chatting with <b>Mercedes Yemelyan</b>
                  </h2>
                </div>
                <div className="messages flex-1 overflow-auto h-10">
                  {messages.map((msg, index) => (
                    <div key={index} className="message mb-4 flex">
                      <div className="flex-2">
                        <div className="w-12 h-12 relative">
                          <img
                            className="w-12 h-12 rounded-full mx-auto"
                            src="../resources/profile-image.png"
                            alt="chat-user"
                          />
                          <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                        </div>
                      </div>
                      <div className="flex-1 px-2">
                        <div className="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                          <span>{msg.message}</span>
                        </div>
                        <div className="pl-4">
                          <small className="text-gray-500">
                            {msg.timestamp}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-2 pt-4 pb-10">
                  <div className="write bg-white shadow flex rounded-lg">
                    <div className="flex-3 flex content-center items-center text-center p-4 pr-0">
                      <span className="block text-center text-gray-400 hover:text-gray-800">
                        <svg
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                        >
                          <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        name="message"
                        className="w-full block outline-none py-4 px-4 bg-transparent"
                        rows="1"
                        placeholder="Type a message..."
                        autoFocus
                      ></textarea>
                    </div>
                    <div className="flex-2 w-32 p-2 flex content-center items-center">
                      <div className="flex-1 text-center">
                        <span className="text-gray-400 hover:text-gray-800">
                          <span className="inline-block align-text-bottom">
                            <svg
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              className="w-6 h-6"
                            >
                              <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                          </span>
                        </span>
                      </div>
                      <div className="flex-1">
                        <button className="bg-blue-400 w-10 h-10 rounded-full inline-block">
                          <span className="inline-block align-text-bottom">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4 text-white"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

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
