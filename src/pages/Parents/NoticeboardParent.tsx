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
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getNotificeBoardParent();
        setNotices(response.data);
      } catch (error) {
        setMessage("Failed to load notices");
        notify.current?.showToast();
      }
      setLoading(false);
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Notice Board</h2>
        {/* <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Notice
        </Button> */}
      </div>
      {showForm && (
        <form className="space-y-4 bg-gray-50 p-5 rounded-lg shadow">
          <FormLabel>Title</FormLabel>
          <FormInput
            {...register("title")}
            type="text"
            placeholder="Enter title"
          />

          <FormLabel>Message</FormLabel>
          <ClassicEditor value={editorContent} onChange={setEditorContent} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormLabel>Notice Date</FormLabel>
              <DatePicker
                selected={noticeDate}
                onChange={setNoticeDate}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <FormLabel>Publish On</FormLabel>
              <DatePicker
                selected={publishOn}
                onChange={setPublishOn}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <FormLabel>Expiration Date</FormLabel>
              <DatePicker
                selected={expiresOn}
                onChange={setExpiresOn}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <FormLabel>Priority</FormLabel>
          <FormSelect
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </FormSelect>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Notice</Button>
          </div>
        </form>
      )}
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
      <Notification ref={notify}>{message}</Notification>
    </div>
  );
}

export default NoticeBoard;
