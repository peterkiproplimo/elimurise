import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";
import { Search } from "lucide-react";
import { formatDate } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import avarter from "../../assets/images/parent.jpeg";
import * as c from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const [parents, setParents] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [parent, setParent] = useState<any>({});
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportDialog, setExportDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("First Name is required"),
      last_name: yup.string().required("Last Name is required"),
      email: yup.string().required(" Email is required"),
      surname: yup.string().required("Surname is required"),
      phone: yup
        .string()
        .required("Phone Number is required")
        .min(6, "Phone Number must be at least 6 characters long"),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        await ApiService.createParents(data);
        await getParents();
        cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Parent Updated successfully"
            : "Parent created successfully."
        );
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the term."
        );
        notify.current?.showToast();
      }
    }
  };

  useEffect(() => {
    getParents();
  }, [search, page, limit, sortBy, sortOrder]);
  const handleSort = (column: string) => {
    setSortOrder((prevOrder) =>
      sortBy === column && prevOrder === "asc" ? "desc" : "asc"
    );
    setSortBy(column);
  };

  const getParents = async () => {
    isLoading(true);

    try {
      const response = await ApiService.getParents({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });
      setParents(response.data);
      const pagination = response.pagination;
      setPagination({
        current_page: pagination.current_page,
        total: pagination.total,
        total_pages: pagination.total_pages,
        per_page: pagination.per_page,
      });
      isLoading(false);
    } catch (error: any) {
      setMessage("Ooops failed to load");

      isLoading(false);
    }
  };
  const sendWelcomeEmail = async (data: any) => {
    isLoading(true);

    try {
      const response = await ApiService.sendWecomeEmail(data);
      setSuccess(true);
      setMessage("Welcome email sent succeessiful");
      isLoading(false);

      notify.current?.showToast();
    } catch (error: any) {
      setSuccess(false);

      setMessage("Ooops failed to send, contact Administrator");
      notify.current?.showToast();

      isLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("upd.............");
      // Check file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a CSV file.");
        event.target.value = ""; // Clear the file input to prevent uploading
        return;
      }

      setSelectedFile(file);
    }
  };

  const exportTemplate = async () => {
    console.log(selectedFile);

    try {
      const res = await ApiService.exportParents({});
      setUploadDialog(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();

      setDialog(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message || "An error occurred while creating the role.");
      notify.current?.showToast();
    }
  };
  const importData = async () => {
    console.log(selectedFile);

    if (!loading) {
      if (!selectedFile) {
        // Handle case where no file is selected
        return;
      }
      isLoading(true);

      try {
        const formData = new FormData();
        formData.append("csvFile", selectedFile);

        const res = await ApiService.importParents(formData);
        // await getStrands();
        await getParents();
        isLoading(false);
        setUploadDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();

        setDialog(false);
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the role."
        );
        notify.current?.showToast();
      }
    }
  };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteParents(parent._id);
      getParents();
      isLoading(false);
      setConfirmDelete(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record.groups);
    reset(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleSendEmail = () => {
    setOpenDialog(false); // Close dialog
    sendWelcomeEmail("all"); // Trigger email
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <Dialog.Panel className={"p-5"}>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to send the welcome email to all parents?
          </Dialog.Description>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendEmail}>
              Yes, Send
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {dialog ? (
        <>
          <div className="flex items-center mt-8 ">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                reset({ name: "" });
                setDialog(false);
                setIsEditMode(false);
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">
              {isEditMode ? "Edit Parent" : "Add Parent"}
            </h2>
          </div>

          <form className="mt-5 p-5   box validate-form" onSubmit={onSubmit}>
            <div>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(false);
                }}
                className="absolute  top-0 right-0 mt-3 mr-3"
                href="#"
              ></a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-3">
              <div>
                <FormLabel>
                  First Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("first_name")}
                  type="text"
                  name="first_name"
                  className={errors.first_name ? "border-danger" : ""}
                  placeholder="First name"
                />
                {errors.first_name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.first_name.message === "string" &&
                      errors.first_name.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel>
                  Middle Name <span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("surname")}
                  type="text"
                  name="surname"
                  className={errors.surname ? "border-danger" : ""}
                  placeholder="Surname"
                />
                {errors.surname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.surname.message === "string" &&
                      errors.surname.message}
                  </div>
                )}
              </div>
              <div>
                <FormLabel>
                  Last Name <span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("last_name")}
                  type="text"
                  name="last_name"
                  className={errors.last_name ? "border-danger" : ""}
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.last_name.message === "string" &&
                      errors.last_name.message}
                  </div>
                )}
              </div>
              <div>
                <FormLabel htmlFor="modal-form-6">Gender</FormLabel>
                <FormSelect {...register("gender")} name="gender">
                  <option value={""}>Select Gender</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </FormSelect>
                {errors.relationship && (
                  <div className="mt-2 text-danger">
                    {typeof errors.relationship.message === "string" &&
                      errors.relationship.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel>ID Number</FormLabel>
                <FormInput
                  {...register("id_no")}
                  type="text"
                  name="id_no"
                  className={errors.id_no ? "border-danger" : ""}
                  placeholder="ID number"
                />
                {errors.id_no && (
                  <div className="mt-2 text-danger">
                    {typeof errors.id_no.message === "string" &&
                      errors.id_no.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel>
                  Email<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.email ? "border-danger" : ""}
                  placeholder="Email"
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel>
                  Phone<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("phone")}
                  type="text"
                  name="phone"
                  className={errors.phone ? "border-danger" : ""}
                  placeholder="Phone"
                />
                {errors.phone && (
                  <div className="mt-2 text-danger">
                    {typeof errors.phone.message === "string" &&
                      errors.phone.message}
                  </div>
                )}
              </div>

              {/* Submit buttons */}
              <div className="col-span-1 sm:col-span-2 md:col-span-3 mt-3">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => cancel({ name: "" })}
                  className="w-20 mr-1"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="w-20">
                  Save
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium ">Parents</h2>
          {/* {message && success && (
            <Alert
              variant="soft-success"
              className="flex items-center mb-2"
              dismissTimeout={3000}
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              {message}
            </Alert>
          )} */}
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
              {hasPermission("parents", "create") && (
                <>
                  <Button
                    variant="primary"
                    className="mr-2 shadow-md"
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setDialog(true);
                      setIsEditMode(false);
                    }}
                  >
                    Add Parent
                  </Button>

                  <Menu>
                    <Menu.Button as={Button} className="px-2 !box">
                      <span className="flex items-center justify-center w-5 h-5">
                        <Lucide icon="Plus" className="w-4 h-4" />
                      </span>
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item onClick={() => setUploadDialog(true)}>
                        <Lucide icon="Book" className="w-4 h-4 mr-2" /> Import
                        Data
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          setExportDialog(true);
                        }}
                      >
                        <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                        Export Template
                      </Menu.Item>
                      {/* <Menu.Item>
                   <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                   to PDF
                 </Menu.Item> */}
                    </Menu.Items>
                  </Menu>
                </>
              )}
              {/* <Menu>
                <Menu.Button as={Button} className="px-2 !box">
                  <span className="flex items-center justify-center w-5 h-5">
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </span>
                </Menu.Button>
                <Menu.Items className="w-40">
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    to Excel
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    to PDF
                  </Menu.Item>
                </Menu.Items>
              </Menu> */}
              <div className="hidden mx-auto md:block text-slate-500">
                Showing{" "}
                {pagination.current_page +
                  " to " +
                  pagination.total_pages +
                  " of " +
                  pagination.total}{" "}
                entries
              </div>
              <div className="flex items-center space-x-3 mr-3">
                <Button
                  variant="outline-primary"
                  onClick={() => setOpenDialog(true)}
                >
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  Send Welcome Email
                </Button>
              </div>

              <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                <div className="relative w-56 text-slate-500">
                  <FormInput
                    type="text"
                    className="w-56 pr-10 !box"
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                  />
                </div>
              </div>
            </div>
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : parents.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  {/* <Search size={28} className="" /> */}
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
                  {" "}
                  <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
                    <Table className="border-spacing-y-[3px] border-separate mt-2 ">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                            No.
                          </Table.Th>
                          <Table.Th
                            className="py-0 border-b-0 whitespace-nowrap cursor-pointer"
                            onClick={() => handleSort("first_name")}
                          >
                            Name{" "}
                            {sortBy === "first_name"
                              ? sortOrder === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </Table.Th>
                          <Table.Th
                            className="py-0 border-b-0 whitespace-nowrap cursor-pointer"
                            onClick={() => handleSort("email")}
                          >
                            Email{" "}
                            {sortBy === "email"
                              ? sortOrder === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </Table.Th>
                          <Table.Th
                            className="py-0 border-b-0 whitespace-nowrap cursor-pointer"
                            onClick={() => handleSort("id_no")}
                          >
                            ID Number{" "}
                            {sortBy === "id_no"
                              ? sortOrder === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </Table.Th>
                          <Table.Th
                            className="py-0 border-b-0 whitespace-nowrap cursor-pointer"
                            onClick={() => handleSort("phone")}
                          >
                            Phone Number{" "}
                            {sortBy === "phone"
                              ? sortOrder === "asc"
                                ? "▲"
                                : "▼"
                              : ""}
                          </Table.Th>
                          <Table.Th className="py-0 border-b-0 whitespace-nowrap text-center">
                            Actions
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody>
                        {parents.map((parent: any, key) => (
                          <Table.Tr key={key} className="">
                            <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span className="font-medium whitespace-nowrap">
                                {limit * (page - 1) + key + 1}
                              </span>
                            </Table.Td>
                            <Table.Td
                              onClick={() =>
                                navigate("/home/parents/" + parent._id)
                              }
                              className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                            >
                              <div className="flex items-center">
                                <div className="w-9 h-9 image-fit zoom-in">
                                  <Tippy
                                    as="img"
                                    alt=""
                                    className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                    src={avarter}
                                    content={
                                      parent.first_name + " " + parent.last_name
                                    }
                                  />
                                </div>
                                <div className="ml-4">
                                  <a
                                    href="#"
                                    onClick={(e: any) => e.preventDefault()}
                                    className="font-medium whitespace-nowrap"
                                  >
                                    {parent.first_name && parent.first_name}
                                    {parent.last_name + " " + parent.surname}
                                  </a>
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span className="font-medium whitespace-nowrap">
                                {parent.email}
                              </span>
                            </Table.Td>
                            <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span className="font-medium whitespace-nowrap">
                                {parent.id_no}
                              </span>
                            </Table.Td>
                            <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span className="font-medium whitespace-nowrap">
                                {parent.phone}
                              </span>
                            </Table.Td>

                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-3 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center justify-center">
                                {hasPermission("parents", "update") && (
                                  <a
                                    className="flex items-center mr-3 text-success"
                                    href="#"
                                    onClick={() => {
                                      sendWelcomeEmail(parent._id);
                                    }}
                                  >
                                    <Lucide
                                      icon="Mail"
                                      className="w-4 h-4 mr-1"
                                    />{" "}
                                    Email
                                  </a>
                                )}
                                {hasPermission("parents", "update") && (
                                  <a
                                    className="flex items-center mr-3 text-success"
                                    href="#"
                                    onClick={() => editRecord(parent)}
                                  >
                                    <Lucide
                                      icon="CheckSquare"
                                      className="w-4 h-4 mr-1"
                                    />{" "}
                                    Edit
                                  </a>
                                )}
                                {hasPermission("parents", "delete") && (
                                  <a
                                    className="flex items-center text-danger"
                                    href="#"
                                    onClick={() => {
                                      setParent(parent);
                                      setConfirmDelete(true);
                                    }}
                                  >
                                    <Lucide
                                      icon="Trash2"
                                      className="w-4 h-4 mr-1"
                                    />{" "}
                                    Delete
                                  </a>
                                )}
                              </div>
                            </Table.Td>

                            {/* <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] ">
                        <div className="flex items-center justify-center">
                          {true && (
                            <Menu>
                              <Menu.Button as={Button} className="px-2 !box">
                                <span className="flex items-center justify-center w-5 h-5">
                                  <Lucide
                                    icon="MoreVertical"
                                    className="w-4 h-4"
                                  />
                                </span>
                              </Menu.Button>
                              <Menu.Items>
                                <Menu.Item
                                  onClick={() => editRecord(parent)}
                                >
                                  <Lucide
                                    icon="Edit"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    setRecordId(parent._id),
                                      setConfirmDelete(true);
                                  }}
                                >
                                  <Lucide
                                    icon="Trash"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Delete
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          )}
                        </div>
                      </Table.Td> */}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>

                    <div className="flex flex-wrap items-center col-span-12 sm:flex-nowrap gap-4 mt-6">
                      {/* Pagination */}
                      <div className="flex items-center w-full sm:w-auto sm:mr-auto">
                        <nav className="flex items-center space-x-1">
                          {/* Previous Button */}
                          <button
                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                            disabled={page === 1}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                          >
                            <Lucide icon="ChevronLeft" className="w-5 h-5" />
                          </button>

                          {/* Page Numbers with Ellipsis */}
                          {pagination.total_pages <= 7 ? (
                            // Show all pages if total_pages <= 7
                            _.times(pagination.total_pages).map((_, index) => {
                              const pageNum = index + 1;
                              return (
                                <button
                                  key={index}
                                  onClick={() => setPage(pageNum)}
                                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    pageNum === pagination.current_page
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })
                          ) : (
                            // Show limited pages with ellipsis for larger counts
                            <>
                              {/* First Page */}
                              <button
                                onClick={() => setPage(1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                  1 === pagination.current_page
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                1
                              </button>

                              {/* Ellipsis or nearby pages */}
                              {pagination.current_page > 3 && (
                                <span className="px-4 py-2 text-gray-500">
                                  ...
                                </span>
                              )}

                              {/* Dynamic middle pages */}
                              {_.range(
                                Math.max(2, pagination.current_page - 1),
                                Math.min(
                                  pagination.total_pages,
                                  pagination.current_page + 2
                                )
                              ).map((pageNum) => (
                                <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    pageNum === pagination.current_page
                                      ? "bg-indigo-600 text-white shadow-md"
                                      : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              ))}

                              {/* Ellipsis or last pages */}
                              {pagination.current_page <
                                pagination.total_pages - 2 && (
                                <span className="px-4 py-2 text-gray-500">
                                  ...
                                </span>
                              )}

                              {/* Last Page */}
                              <button
                                onClick={() => setPage(pagination.total_pages)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                  pagination.total_pages ===
                                  pagination.current_page
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                {pagination.total_pages}
                              </button>
                            </>
                          )}

                          {/* Next Button */}
                          <button
                            onClick={() =>
                              setPage(
                                page < pagination.total_pages
                                  ? page + 1
                                  : pagination.total_pages
                              )
                            }
                            disabled={page === pagination.total_pages}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                          >
                            <Lucide icon="ChevronRight" className="w-5 h-5" />
                          </button>
                        </nav>
                      </div>

                      {/* Total and Limit Selector */}
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="text-sm font-medium">
                          Total: {pagination.total}
                        </span>
                        <FormSelect
                          className="w-32 py-2 text-sm bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          onChange={(e) => setLimit(parseInt(e.target.value))}
                        >
                          <option value={10}>10 / page</option>
                          <option value={25}>25 / page</option>
                          <option value={50}>50 / page</option>
                          <option value={100}>100 / page</option>
                        </FormSelect>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Dialog
              staticBackdrop
              size="lg"
              open={exportDialog}
              onClose={() => {
                setDialog(false);
              }}
            >
              <Dialog.Panel className="w-full max-w-screen-lg">
                <Dialog.Title>
                  <h2 className="mr-auto text-base font-medium">
                    Download learners import Template
                  </h2>
                  <a
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setUploadDialog(false);
                    }}
                    className="absolute top-0 right-0 mt-3 mr-3"
                    href="#"
                  >
                    <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                  </a>
                </Dialog.Title>
                <div className="grid grid-cols-12 gap-4 gap-y-3 p-4"></div>
                <Dialog.Footer>
                  <div className=" text-right">
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => {
                        setExportDialog(false);
                      }}
                      className="w-24 mr-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => exportTemplate()}
                      variant="primary"
                      type="button"
                      className="m-3 w-24"
                      ref={deleteButtonRef}
                    >
                      Download
                      {loading && (
                        <LoadingIcon
                          icon="spinning-circles"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      )}
                    </Button>
                  </div>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog>
            <Dialog
              staticBackdrop
              size="lg"
              open={uploadDialog}
              onClose={() => setUploadDialog(false)}
            >
              <Dialog.Panel className="w-full max-w-screen-lg bg-white rounded-lg shadow-lg overflow-hidden">
                <Dialog.Title className="flex items-center justify-between px-6 py-1 bg-gray-100 border-b border-gray-300">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Import Parents
                  </h2>
                  <button
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setUploadDialog(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close"
                  >
                    <Lucide icon="X" className="w-6 h-6" />
                  </button>
                </Dialog.Title>

                <div className="px-6 py-4">
                  <p className="mb-4 text-sm text-gray-600">
                    Choose the file to upload. <i>Type must be CSV</i>. Ensure
                    the file follows the required format for successful
                    processing. Each row should represent one parent, and the
                    following fields are mandatory:
                  </p>
                  <ul className="mb-4 text-sm text-gray-600 list-disc list-inside">
                    <li>
                      <b>Parent Name</b>: Full name of the parent.
                    </li>
                    <li>
                      <b>Contact Information</b>: A valid email address or phone
                      number.
                    </li>
                    <li>
                      <b>Student ID</b>: The unique identifier for the student
                      associated with the parent.
                    </li>
                  </ul>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      If you need a sample file to guide your data entry,
                      download the template below.
                    </p>
                    <Button
                      onClick={() => exportTemplate()}
                      variant="primary"
                      type="button"
                      className="px-1 py-1  text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition"
                      ref={deleteButtonRef}
                    >
                      Download Template
                    </Button>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    After selecting a file, click "Import" to upload and process
                    the data. You can click "Cancel" at any time to close this
                    dialog without making changes.
                  </p>

                  <input
                    id="file_input"
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  />
                </div>

                <Dialog.Footer className="flex justify-end px-6 py-4 bg-gray-100 border-t border-gray-300">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setUploadDialog(false)}
                    className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => importData()}
                    variant="primary"
                    type="button"
                    className="ml-3 px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition"
                    ref={deleteButtonRef}
                  >
                    Import
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    )}
                  </Button>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog>

            {/* END: Pagination */}
          </div>
          <Dialog
            staticBackdrop
            size="lg"
            open={dialog}
            onClose={() => {
              setDialog(false);
            }}
          >
            <Dialog.Panel></Dialog.Panel>
          </Dialog>
          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
                <div className="mt-5 text-3xl">Are you sure?</div>
                <div className="mt-2 text-slate-500">
                  Do you really want to delete {parent.first_name}{" "}
                  {parent.last_name}? <br />
                  This process cannot be undone.
                </div>
              </div>
              <div className="px-5 pb-8 text-center">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                  }}
                  className="w-24 mr-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteRecord()}
                  variant="danger"
                  type="button"
                  className="w-24"
                  ref={deleteButtonRef}
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}
        </>
      )}
      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed "}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
