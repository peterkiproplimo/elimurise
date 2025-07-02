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
import { IMG_URL } from "../../utils/constants";

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
  const [roles, setRoles] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch Notices and Roles (unchanged logic)
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getNotificeBoard({});
      setNotices(response.data);
    } catch (error) {
      setMessage("Failed to load notices");
      notify.current?.showToast();
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await ApiService.getRole({});
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
        await ApiService.updateNotificeBoard(editingId, formData);
      } else {
        await ApiService.createNotificeBoard(formData);
      }

      fetchNotices();
      resetForm();
      setMessage("Notice saved successfully");
      notify.current?.showToast();
    } catch (error) {
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
      await ApiService.deleteNotificeBoard(id);
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
    <div className="min-h-screen bg-gray-100 p-6">
      {showForm ? (
        <div className=" mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? "Edit Notice" : "Create New Notice"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter notice title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Message
              </label>
              <ClassicEditor
                value={editorContent}
                onChange={setEditorContent}
                className="bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notice Date
                </label>
                <DatePicker
                  selected={noticeDate}
                  onChange={setNoticeDate}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Publish On
                </label>
                <DatePicker
                  selected={publishOn}
                  onChange={setPublishOn}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Expires On
                </label>
                <DatePicker
                  selected={expiresOn}
                  onChange={setExpiresOn}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Attachment
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border rounded-md bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <LoadingIcon icon="oval" className="w-5 h-5 mr-2" />
                ) : null}
                {editingId ? "Update Notice" : "Publish Notice"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className=" mx-auto mt-10 bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Notice Board</h2>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              <Lucide icon="Plus" className="w-5 h-5 mr-2" />
              Add Notice
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-indigo-50">
                <tr className="text-sm font-semibold text-gray-700">
                  <th className="p-4">#</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attachment</th> {/* New column */}
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr
                    key={notice._id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium text-gray-800">
                      {notice.title}
                    </td>
                    <td
                      className="p-4 text-gray-600 truncate max-w-md"
                      dangerouslySetInnerHTML={{ __html: notice.message }}
                    ></td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notice.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : notice.priority === "normal"
                            ? "bg-green-100 text-green-highlight"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {notice.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notice.status === "published"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {notice.attachment ? (
                        notice.attachment.endsWith(".pdf") ? (
                          <a
                            href={`${IMG_URL}${notice.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            View PDF
                          </a>
                        ) : (
                          <a
                            href={`${IMG_URL}${notice.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${IMG_URL}${notice.attachment}`}
                              alt="Attachment"
                              className="w-16 h-16 object-cover rounded"
                            />
                          </a>
                        )
                      ) : (
                        "No attachment"
                      )}
                    </td>
                    <td className="p-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 transition"
                      >
                        <Lucide icon="Edit" className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition"
                      >
                        <Lucide icon="Trash" className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex items-center bg-indigo-500 text-black rounded-lg shadow-lg p-4"
      >
        <Lucide
          icon={message.includes("Failed") ? "AlertCircle" : "CheckCircle"}
          className="w-5 h-5 mr-2"
        />
        {message}
      </Notification>
    </div>
  );
}

export default NoticeBoard;
