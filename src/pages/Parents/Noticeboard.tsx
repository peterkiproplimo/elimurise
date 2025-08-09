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
import { Menu } from "@headlessui/react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Communication Dashboard Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Communication Hub</h1>
              <p className="text-blue-100">Manage notices, messages, and announcements</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{notices.length}</div>
                <div className="text-sm text-blue-100">Total Notices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {notices.filter(n => n.status === 'published').length}
                </div>
                <div className="text-sm text-blue-100">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {notices.filter(n => n.priority === 'high').length}
                </div>
                <div className="text-sm text-blue-100">High Priority</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Lucide icon="FileText" className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {notices.filter(n => n.status === 'published').length} active
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Notice Board
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create and manage school announcements and important notices
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Create Notice
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Lucide icon="MessageSquare" className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Real-time
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Messages
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Communicate directly with teachers and school administrators
            </p>
            <button
              onClick={() => window.location.href = '/home/message'}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Open Messages
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lucide icon="Bell" className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {notices.filter(n => n.priority === 'high').length} urgent
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Stay updated with important alerts and announcements
            </p>
            <button
              onClick={() => window.location.href = '/home/notice-board'}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              View All Notices
            </button>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="max-w-4xl mx-auto mt-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editingId ? "Edit Notice" : "Create New Notice"}
          </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Lucide icon="X" className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter notice title"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <ClassicEditor
                value={editorContent}
                onChange={setEditorContent}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notice Date
                </label>
                <DatePicker
                  selected={noticeDate}
                  onChange={setNoticeDate}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Publish On
                </label>
                <DatePicker
                  selected={publishOn}
                  onChange={setPublishOn}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Expires On
                </label>
                <DatePicker
                  selected={expiresOn}
                  onChange={setExpiresOn}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition duration-200 text-gray-900 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Attachment
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Lucide icon="Download" className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingIcon icon="spinning-circles" className="w-5 h-5 mr-2" />
                ) : (
                  <Lucide icon="CheckCircle" className="w-5 h-5 mr-2" />
                )}
                {editingId ? "Update Notice" : "Create Notice"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Notice Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and publish notices to the school community
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <Lucide icon="Plus" className="w-5 h-5 mr-2" />
              Create Notice
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading notices...</p>
              </div>
            ) : notices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Lucide icon="FileText" className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No notices yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first notice to get started
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Create Notice
                </button>
              </div>
            ) : (
          <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Message
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Priority
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Attachment
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {notices.map((notice, index) => (
                      <tr key={notice._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                      {notice.title}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block max-w-xs">
                            <span className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                              {notice.message.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          notice.priority === "high"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                            : notice.priority === "normal"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              notice.priority === "high" ? "bg-red-500" : 
                              notice.priority === "normal" ? "bg-green-500" : "bg-yellow-500"
                            }`}></div>
                        {notice.priority}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          notice.status === "published"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              notice.status === "published" ? "bg-blue-500" : "bg-gray-500"
                            }`}></div>
                        {notice.status}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                      {notice.attachment ? (
                            <div className="flex items-center space-x-2">
                              {notice.attachment.endsWith(".pdf") ? (
                          <a
                            href={`${IMG_URL}${notice.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                                  <Lucide icon="FileText" className="w-4 h-4 mr-1" />
                            View PDF
                          </a>
                        ) : (
                          <a
                            href={`${IMG_URL}${notice.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                >
                                  <Lucide icon="FileText" className="w-4 h-4 mr-1" />
                                  View Image
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No attachment</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <Menu as="div" className="inline-block">
                              <Menu.Button className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                <Lucide icon="MoreVertical" className="w-5 h-5" />
                              </Menu.Button>
                              <Menu.Items className="absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 py-2 mt-2 z-50">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                        onClick={() => handleEdit(notice)}
                                      className={`flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 ${
                                        active ? 'bg-green-50 dark:bg-green-900/20' : ''
                                      }`}
                                >
                                      <Lucide icon="Edit3" className="w-4 h-4 mr-3 text-green-500" />
                                  Edit Notice
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                        onClick={() => handleDelete(notice._id)}
                                      className={`flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 ${
                                        active ? 'bg-red-50 dark:bg-red-900/20' : ''
                                      }`}
                                >
                                      <Lucide icon="Trash" className="w-4 h-4 mr-3 text-red-500" />
                                  Delete Notice
                                    </button>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide
          icon={message.includes("Failed") ? "AlertCircle" : "CheckCircle"}
          className={message.includes("Failed") ? "text-red-500" : "text-green-500"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{message.includes("Failed") ? "Error" : "Success"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </div>
  );
}

export default NoticeBoard;
