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

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
      id_no: yup
        .string()
        .required("ID Number is required")
        .min(6, "ID Number must be at least 6 characters long"),
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
  }, [search, page, limit]);
  useEffect(() => {
    getAcademicYear();
  }, []);
  const getParents = async () => {
    isLoading(true);

    try {
      const response = await ApiService.getParents({
        page,
        limit,
        search,
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
  const getAcademicYear = async () => {
    const response = await ApiService.getAcademic({ page: 1 });
    setAcademic(response.data);
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

  return (
    <>
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
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-6 sm:col-span-6">
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
              <div className="col-span-6 sm:col-span-6">
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
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Surname <span className="text-danger ml-0.5">*</span>
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
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  ID Number<span className="text-danger ml-0.5">*</span>
                </FormLabel>
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
              <div className="col-span-6 sm:col-span-6">
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
              <div className="col-span-6 sm:col-span-6">
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
              <div className="col-span-12 sm:col-span-12 mt-3">
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
                          <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                            Name
                          </Table.Th>

                          <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                            Email
                          </Table.Th>
                          <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                            ID Number
                          </Table.Th>
                          <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                            Phone Number
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
                            <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
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
                                    onClick={() => editRecord(parent)}
                                    className="font-medium whitespace-nowrap"
                                  >
                                    {parent.first_name && parent.first_name}
                                    {" " +
                                      parent.surname +
                                      " " +
                                      parent.last_name}
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

                    <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
                      <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
                        <Pagination className="w-full sm:w-auto sm:mr-auto">
                          <button
                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                            className="py-2 px-4 rounded-md"
                          >
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                          </button>
                          {_.times(pagination.total_pages).map((page, key) =>
                            page + 1 == pagination.current_page ? (
                              <button
                                onClick={() => setPage(page + 1)}
                                key={key}
                                className="py-2 px-4 bg-white rounded-md"
                              >
                                {page + 1}
                              </button>
                            ) : (
                              <button
                                onClick={() => setPage(page + 1)}
                                key={key}
                                className="py-2 px-4 rounded-md"
                              >
                                {page + 1}
                              </button>
                            )
                          )}
                          <button
                            onClick={() =>
                              setPage(
                                page < pagination.total_pages ? page + 1 : 1
                              )
                            }
                            className="py-2 px-4 rounded-md"
                          >
                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                          </button>
                        </Pagination>
                        <div className="text-slate-500">
                          <span className="mr-3">Total {pagination.total}</span>
                          <FormSelect
                            className="w-30 mt-3 !box sm:mt-0"
                            onChange={(e) => setLimit(parseInt(e.target.value))}
                          >
                            <option value={10}>10/page</option>
                            <option value={25}>25/page</option>
                            <option value={50}>50/page</option>
                            <option value={100}>100/page</option>
                          </FormSelect>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

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
