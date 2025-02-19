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
  const notify = useRef<NotificationElement>(null);
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
  const [roles, setRoles] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch Notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getNotificeBoard();
      setNotices(response.data);
    } catch (error) {
      setMessage("Failed to load notices");
      notify.current?.showToast();
    }
    setLoading(false);
  };

  // Fetch Roles (for Recipients)
  const fetchRoles = async () => {
    try {
      const response = await ApiService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Failed to load roles", error);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchRoles();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("message", editorContent);
      if (noticeDate) formData.append("noticeDate", noticeDate.toISOString());
      if (publishOn) formData.append("publishOn", publishOn.toISOString());
      if (expiresOn) formData.append("expiresOn", expiresOn.toISOString());
      if (attachment) formData.append("attachment", attachment);
      formData.append("priority", priority);
      formData.append("status", status);
      recipients.forEach((id) => formData.append("recipients[]", id));

      if (editingId) {
        await ApiService.updateNotice(editingId, formData);
      } else {
        await ApiService.createNotificeBoard(formData);
      }

      fetchNotices();
      resetForm();
      setMessage("Notice saved successfully");
      notify.current?.showToast();
    } catch (error) {
      console.log(error);
      setMessage("Failed to save notice");
      notify.current?.showToast();
    }
    setLoading(false);
  };

  const resetForm = () => {
    reset();
    setEditorContent("");
    setNoticeDate(new Date());
    setPublishOn(new Date());
    setExpiresOn(null);
    setAttachment(null);
    setPriority("normal");
    setStatus("draft");
    setRecipients([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (notice: any) => {
    setEditingId(notice._id);
    setValue("title", notice.title);
    setEditorContent(notice.message);
    setNoticeDate(new Date(notice.noticeDate));
    setPublishOn(new Date(notice.publishOn));
    setExpiresOn(notice.expiresOn ? new Date(notice.expiresOn) : null);
    setPriority(notice.priority);
    setStatus(notice.status);
    setRecipients(notice.recipients || []);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    setLoading(true);
    try {
      await ApiService.deleteNotice(id);
      fetchNotices();
      setMessage("Notice deleted successfully");
      notify.current?.showToast();
    } catch (error) {
      setMessage("Failed to delete notice");
      notify.current?.showToast();
    }
    setLoading(false);
  };

  return (
    <>
      {showForm ? (
        <div className="mt-5 p-6 bg-white shadow-md rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter title"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <ClassicEditor
                value={editorContent}
                onChange={setEditorContent}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notice Date
              </label>
              <DatePicker
                selected={noticeDate}
                onChange={setNoticeDate}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publish On
              </label>
              <DatePicker
                selected={publishOn}
                onChange={setPublishOn}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <DatePicker
                selected={expiresOn}
                onChange={setExpiresOn}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                {editingId ? "Update" : "Add"} Notice
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-5 p-5 box">
          <div className="flex items-center mt-8">
            <h2 className="mr-auto text-lg font-medium">Notice Board</h2>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Add Notice
            </Button>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Priority</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{notice.title}</td>
                    <td
                      className="p-3 truncate"
                      dangerouslySetInnerHTML={{ __html: notice.message }}
                    ></td>
                    <td className="p-3 capitalize">{notice.priority}</td>
                    <td className="p-3 capitalize">{notice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Notification ref={notify}>{message}</Notification>
    </>
  );
}

export default NoticeBoard;
