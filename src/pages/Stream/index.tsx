import { useState, useRef, useEffect, RefObject } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import Pagination from "../../base-components/Pagination";
import { useAuth } from "../../contexts/Auth";

// Interfaces
interface Grade {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
}

interface Stream {
  _id: string;
  name: string;
  grade: Grade;
  class_manager: User;
  section_head: User;
}

interface PaginationData {
  current_page: number;
  total: number;
  total_pages: number;
  per_page: number;
}

interface FormData {
  name: string;
  grade: string;
  class_manager: string;
  section_head: string;
  _id?: string;
}

// Constants
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_LIMIT = 10;

function Main() {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const deleteButtonRef: RefObject<HTMLButtonElement> = useRef(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: DEFAULT_LIMIT,
  });
  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(1);
  const notify = useRef<NotificationElement>(null);
  const { hasPermission } = useAuth();

  const schema = yup
    .object({
      name: yup.string().required("Stream name is required"),
      grade: yup.string().required("Grade is required"),
      class_manager: yup.string().required("Class Manager is required"),
      section_head: yup.string().required("Section Head is required"),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    Promise.all([getGrades(), getUsers(), getStreams()]);
  }, [search, page, limit, grade]);

  const getGrades = async (): Promise<void> => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    }
  };

  const getUsers = async (): Promise<void> => {
    try {
      const res = await ApiService.getUsers({ page: 1, limit: 1000 });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const getStreams = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await ApiService.getStream({
        page,
        limit,
        search,
        grade,
      });
      setStreams(response.data || []);
      setPagination({
        current_page: response.pagination.current_page,
        total: response.pagination.total,
        total_pages: response.pagination.total_pages,
        per_page: response.pagination.per_page,
      });
    } catch (error) {
      console.error("Failed to fetch streams:", error);
      setStreams([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      setLoading(true);
      try {
        const data = getValues();

        await ApiService.createStream(data);

        await getStreams();
        reset({ name: "", grade: "", class_manager: "", section_head: "" });
        setDialog(false);
        setIsEditMode(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Stream updated successfully"
            : "Stream created successfully"
        );
        notify.current?.showToast();
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.message || "An error occurred");
        notify.current?.showToast();
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteRecord = async (): Promise<void> => {
    if (!recordId) return;
    setLoading(true);
    try {
      const res = await ApiService.deleteStream(recordId);
      await getStreams();
      setConfirmDelete(false);
      setSuccess(true);
      setMessage(res.message || "Stream deleted successfully");
      notify.current?.showToast();
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to delete stream");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const editRecord = (record: Stream): void => {
    setIsEditMode(true);
    setRecordId(record._id);
    reset({
      _id: record._id,
      name: record.name,
      grade: record.grade._id,
      class_manager: record.class_manager?._id || "",
      section_head: record.section_head?._id || "",
    });
    setDialog(true);
  };

  const cancel = (): void => {
    reset({ name: "", grade: "", class_manager: "", section_head: "" });
    setDialog(false);
    setIsEditMode(false);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  // JSX remains mostly the same, with type safety from above definitions
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkmode-900 dark:to-darkmode-800 p-6 xl:p-8">
      <div className="mx-auto bg-white dark:bg-darkmode-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          {dialog ? (
            <>
              <div className="flex items-center mb-6">
                <Button
                  //
                  onClick={cancel}
                  className="mr-4 bg-gray-100 dark:bg-darkmode-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-darkmode-500 rounded-full p-2 transition-all duration-200"
                >
                  <Lucide icon="ArrowLeft" className="w-5 h-5" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {isEditMode ? "Edit Stream" : "New Stream"}
                </h2>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Grade <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormSelect
                      {...register("grade")}
                      className={`w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.grade
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade._id} value={grade._id}>
                          {grade.name}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.grade && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.grade.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stream Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                      placeholder="Enter stream name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Class Manager <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormSelect
                      {...register("class_manager")}
                      className={`w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.class_manager
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                    >
                      <option value="">Select Class Manager</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstname} {user.lastname}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.class_manager && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.class_manager.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Section Head <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormSelect
                      {...register("section_head")}
                      className={`w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.section_head
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                    >
                      <option value="">Select Section Head</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstname} {user.lastname}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.section_head && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.section_head.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={cancel}
                    className="px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <LoadingIcon
                          icon="spinning-circles"
                          className="w-4 h-4 mr-2"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Streams
                </h2>
                {hasPermission("streams", "create") && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDialog(true);
                      setIsEditMode(false);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                  >
                    <Lucide icon="Plus" className="w-5 h-5 mr-2" />
                    New Stream
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-64 text-gray-500">
                  <FormInput
                    type="text"
                    className="w-full pr-10 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    placeholder="Search streams..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-gray-400"
                  />
                </div>
                <FormSelect
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-48 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <option value="">All Grades</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingIcon
                    icon="spinning-circles"
                    className="w-10 h-10 text-indigo-500"
                  />
                </div>
              ) : streams.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-darkmode-600 rounded-xl shadow-inner">
                  <Lucide
                    icon="FolderOpen"
                    className="w-12 h-12 text-gray-400 mb-4"
                  />
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    No streams found
                  </p>
                </div>
              ) : (
                <>
                  <Table className="border-separate border-spacing-y-2">
                    <Table.Thead className="bg-gray-100 dark:bg-darkmode-600">
                      <Table.Tr>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4">
                          No.
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4">
                          Name
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4">
                          Grade
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4">
                          Class Manager
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4">
                          Section Head
                        </Table.Th>
                        <Table.Th className="whitespace-nowrap text-gray-700 dark:text-gray-200 py-3 px-4 text-center">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {streams.map((stream, index) => (
                        <Table.Tr
                          key={stream._id}
                          className="bg-white dark:bg-darkmode-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-darkmode-500 transition-all duration-200"
                        >
                          <Table.Td className="py-3 px-4">
                            {(page - 1) * limit + index + 1}
                          </Table.Td>
                          <Table.Td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                            {stream.name}
                          </Table.Td>
                          <Table.Td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {stream.grade?.name || "N/A"}
                          </Table.Td>
                          <Table.Td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {stream.class_manager?.firstname}{" "}
                            {stream.class_manager?.lastname}
                          </Table.Td>
                          <Table.Td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {stream.section_head?.firstname}{" "}
                            {stream.section_head?.lastname}
                          </Table.Td>
                          <Table.Td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              {hasPermission("streams", "update") && (
                                <Button
                                  //
                                  onClick={() => editRecord(stream)}
                                  className="text-success hover:text-indigo-600 transition-colors duration-200"
                                >
                                  <Lucide
                                    icon="Edit"
                                    className="w-4 h-4 mr-1"
                                  />
                                  Edit
                                </Button>
                              )}
                              {hasPermission("streams", "delete") && (
                                <Button
                                  onClick={() => {
                                    setRecordId(stream._id);
                                    setConfirmDelete(true);
                                  }}
                                  className="text-danger hover:text-red-700 transition-colors duration-200"
                                >
                                  <Lucide
                                    icon="Trash2"
                                    className="w-4 h-4 mr-1"
                                  />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, pagination.total)} of{" "}
                      {pagination.total} entries
                    </div>
                    <div className="flex items-center gap-4">
                      <Pagination className="flex items-center gap-2">
                        <Button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="p-2 bg-gray-100 dark:bg-darkmode-600 rounded-lg hover:bg-gray-200 dark:hover:bg-darkmode-500 transition-all duration-200"
                        >
                          <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Button>
                        {Array.from(
                          { length: pagination.total_pages },
                          (_, i) => i + 1
                        ).map((pg) => (
                          <Button
                            key={pg}
                            variant={pg === page ? "primary" : "soft"}
                            onClick={() => handlePageChange(pg)}
                            className={`min-w-[2.5rem] py-2 px-3 rounded-lg transition-all duration-200 ${
                              pg === page
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-darkmode-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-darkmode-500"
                            }`}
                          >
                            {pg}
                          </Button>
                        ))}
                        <Button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === pagination.total_pages}
                          className="p-2 bg-gray-100 dark:bg-darkmode-600 rounded-lg hover:bg-gray-200 dark:hover:bg-darkmode-500 transition-all duration-200"
                        >
                          <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </Button>
                      </Pagination>
                      <FormSelect
                        value={limit}
                        onChange={(e) => {
                          setLimit(parseInt(e.target.value));
                          setPage(1);
                        }}
                        className="w-32 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}/page
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <Dialog
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel className="p-6 bg-white dark:bg-darkmode-600 rounded-lg shadow-lg">
              <div className="text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-red-500"
                />
                <h3 className="mt-5 text-2xl font-semibold text-gray-800 dark:text-white">
                  Are you sure?
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Do you really want to delete this stream? This action cannot
                  be undone.
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setConfirmDelete(false)}
                  className="px-6 py-2 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={deleteRecord}
                  ref={deleteButtonRef}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => (notify.current = el)}
        className="flex items-center p-4 rounded-lg shadow-lg bg-white dark:bg-darkmode-600"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={`w-6 h-6 ${success ? "text-green-500" : "text-red-500"}`}
        />
        <div className="ml-3">
          <div className="font-semibold text-gray-800 dark:text-white">
            {success ? "Success" : "Error"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </div>
        </div>
      </Notification>
    </div>
  );
}

export default Main;
