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

const auth = await localStorage.getItem("@AuthData");

// value previously stored
let auth_data = JSON.parse(auth);
let user = auth_data.user;

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

function Main() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const notify = useRef<NotificationElement>(null);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [parents, setParents] = useState<Parent[]>([]);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  const [selectedParent, setSelectedParent] = useState<string>(
    "676e2905deac6e09363e2dcf"
  );

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

      setMessages((prev) => [...prev, newMessage]);
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
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Parent Conmmunication</h2>
      </div>
      <div className="mt-5 p-5 box">
        <div className="overflow-y-auto h-96 chat-box">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          ) : (
            messages?.map((msg: any, index) => (
              <div key={index} className="mb-4 message">
                {/* <div className="font-medium">{msg.sender}</div> */}
                <div>{msg.message}</div>
                <div className="text-xs text-slate-500">{msg.createdAt}</div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* <FormLabel>Select Parent</FormLabel> */}

          <FormLabel>Message</FormLabel>
          <FormInput
            {...register("content")}
            type="text"
            placeholder="Type your message"
            className="mb-4"
          />
          <Button variant="primary" type="submit" className="w-20">
            Send
            {loading && (
              <LoadingIcon
                icon="spinning-circles"
                color="white"
                className="w-4 h-4 ml-2"
              />
            )}
          </Button>
        </form>
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
