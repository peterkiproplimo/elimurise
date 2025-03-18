import { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import * as ApiService from "../../services/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClassicEditor } from "../../base-components/Ckeditor";

interface FormData {
  title: string;
  message: string;
  noticeDate: Date;
  publishOn: Date;
  expiresOn: Date | null;
  attachment: File | null;
  priority: string;
  status: string;
  recipients: string[];
}

function NoticeBoard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const notify = useRef<NotificationElement>();
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [notices, setNotices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>("");
  const [noticeDate, setNoticeDate] = useState<Date | null>(new Date());
  const [publishOn, setPublishOn] = useState<Date | null>(new Date());
  const [expiresOn, setExpiresOn] = useState<Date | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [priority, setPriority] = useState<string>("normal");
  const [status, setStatus] = useState<string>("draft");
  const [recipients, setRecipients] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getNotificeBoardParent({});
        setNotices(response.data);
      } catch (error) {
        setMessage("Failed to load notices");
        notify.current?.showToast();
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const noticeData = {
        ...data,
        message: editorContent,
        noticeDate,
        publishOn,
        expiresOn,
        priority,
        status,
        recipients,
      };
      setMessage("Notice created successfully!");
      notify.current?.showToast();
      setShowForm(false);
      reset();
      setEditorContent("");
      setNoticeDate(new Date());
      setPublishOn(new Date());
      setExpiresOn(null);
      setPriority("normal");
      setStatus("draft");
      const response = await ApiService.getNotificeBoardParent({});
      setNotices(response.data);
    } catch (error) {
      setMessage("Failed to create notice");
      notify.current?.showToast();
    }
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-500 text-red-800";
      case "normal":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "low":
        return "bg-green-100 border-green-500 text-green-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  // Function to check if a notice is "new" (within 3 days)
  const isNewNotice = (publishOn: string | Date) => {
    const noticeDate = new Date(publishOn);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - noticeDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 3; // True if within 3 days
  };

  // Find the most recent notice
  const latestNotice = notices.reduce((latest, current) => {
    return new Date(current.publishOn) > new Date(latest.publishOn)
      ? current
      : latest;
  }, notices[0]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Lucide icon="Bell" className="w-8 h-8 mr-2 text-blue-600" />
            Notice Board
          </h2>
        </div>

        {/* Notices List */}
        {loading && !notices.length ? (
          <div className="flex justify-center items-center h-64">
            <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No notices available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`p-5 rounded-xl shadow-md border-l-4 ${getPriorityColor(
                  notice.priority
                )} transition-all hover:shadow-lg relative`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {notice.title}
                  </h3>
                  <div className="flex gap-2">
                    {notice === latestNotice &&
                      isNewNotice(notice.publishOn) && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <Lucide icon="Star" className="w-3 h-3 mr-1" />
                          New
                        </span>
                      )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        notice.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {notice.status.charAt(0).toUpperCase() +
                        notice.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-2 text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: notice.message }}
                />
                <div className="mt-4 text-xs text-gray-500 flex justify-between">
                  <span>
                    Published: {new Date(notice.publishOn).toLocaleDateString()}
                  </span>
                  {notice.expiresOn && (
                    <span>
                      Expires: {new Date(notice.expiresOn).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification */}
        <Notification
          options={{ duration: 3000 }}
          getRef={(el) => {
            notify.current = el;
          }}
          className="flex items-center gap-2 bg-blue-500 text-white p-3 rounded-lg shadow-lg"
        >
          <Lucide icon="Info" className="w-5 h-5" />
          {message}
        </Notification>
      </div>
    </div>
  );
}

export default NoticeBoard;
