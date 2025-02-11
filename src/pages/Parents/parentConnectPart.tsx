import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import * as ApiService from "../../services/auth";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useAuth } from "../../contexts/Auth";

function ParentChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const notify = useRef<NotificationElement>();
  const { register, handleSubmit, reset } = useForm();
  const { hasPermission } = useAuth();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getMessages();
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage("Failed to load messages");
      notify.current?.showToast();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await ApiService.sendMessage(data);
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
    fetchMessages();
  }, []);

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Parent Chat</h2>
      </div>
      <div className="mt-5 p-5 box">
        <div className="overflow-y-auto h-96">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-4">
                <div className="font-medium">{msg.sender}</div>
                <div>{msg.content}</div>
                <div className="text-xs text-slate-500">{msg.timestamp}</div>
              </div>
            ))
          )}
        </div>
        {/* {hasPermission("chat", "send") && ( */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
        {/* )} */}
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

export default ParentChat;
