import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";
import "./user.css";
import { useState, useRef, useEffect } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import { Dialog, Menu } from "../../base-components/Headless";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useAuth } from "../../contexts/Auth";

function Users() {
  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState(false); // New state for reset password confirmation
  const deleteButtonRef = useRef(null);
  const resetPasswordButtonRef = useRef(null); // Ref for reset password button
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<any>({});
  const [selectGroup, setGroup] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const { authData, hasPermission } = useAuth();
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const notify = useRef<NotificationElement>();

  const schema = yup
    .object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      email: yup
        .string()
        .required("Email is required")
        .email("Email must be valid"),
      phone: yup.string().required("Phone Number is required"),
      password: yup.string().required("Password is required"),
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

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    getUsers();
  }, [search, limit, page]);

  const getUsers = async () => {
    let res = await ApiService.getUsers({
      page: page,
      search: search,
      limit: limit,
    });
    const pagination = res.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setUsers(res.data);
  };

  const getRole = async () => {
    let res = await ApiService.getRole({ page: "", search: "", limit: "" });
    setRoles(res.data);
  };

  const activateUser = async (data: any) => {
    isLoading(true);
    let res = await ApiService.activateorDeactivateUsers(data);
    getUsers();
    setConfirmDelete(false);
    isLoading(false);
    setSuccess(true);
    setMessage(res.message || "User status updated successfully");
    notify.current?.showToast();
  };

  const resetPassword = async (user: any) => {
    isLoading(true);
    try {
      const res = await ApiService.addEmailOTP({ email: user.email }); // Assuming API endpoint
      getUsers();
      setConfirmResetPassword(false);
      isLoading(false);
      setSuccess(true);
      setMessage(res.message || "Password reset triggered successfully");
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message || "Failed to trigger password reset");
      notify.current?.showToast();
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.createUser(data);
        getUsers();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(res.message || "User created successfully");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        notify.current?.showToast();
      }
    }
  };

  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record.groups);
    reset({ ...record, role: record?.role?._id });
    setDialog(true);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      // let res = await ApiService.deleteUsers(userId);
      getUsers();
      isLoading(false);
      setConfirmDelete(false);
      setSuccess(true);
      // setMessage(res.message);
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  const cancel = (record: any) => {
    setGroup([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };

  return (
    <>
      <h2 className="mt-1 text-lg font-medium">Users</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {hasPermission("users", "create") && (
          <div className="flex flex-wrap items-center col-span-12 mt-2 xl:flex-nowrap">
            <Button
              className="mr-2 shadow-md user-button"
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                cancel({ name: "" });
                setDialog(true);
              }}
            >
              New User
            </Button>
            <Menu>
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
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </Menu.Item>
                <Menu.Item>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  PDF
                </Menu.Item>
              </Menu.Items>
            </Menu>
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
        )}
        <div className="col-span-12 overflow-auto 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  First Name
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Last Name
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Phone
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Email
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Title
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user: any, key) => (
                <Table.Tr key={key} className="">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.firstname}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.lastname}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.phone}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.email}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user?.role?.name}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={
                        user.status == 1
                          ? "flex items-center text-success"
                          : "flex items-center text-danger"
                      }
                    >
                      {user.status == 1 ? "Active" : "Deactivated"}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    {(authData as { user: { email: string } })?.user?.email !==
                      user?.email && (
                      <div className="flex items-center justify-center">
                        <Menu>
                          <Menu.Button as={Button} className="px-2 !box">
                            <span className="flex items-center justify-center w-5 h-5">
                              <Lucide icon="MoreVertical" className="w-4 h-4" />
                            </span>
                          </Menu.Button>
                          <Menu.Items className="w-40">
                            {hasPermission("users", "update") && (
                              <Menu.Item onClick={() => editRecord(user)}>
                                <Lucide icon="Edit" className="w-4 h-4 mr-2" />{" "}
                                Edit
                              </Menu.Item>
                            )}
                            {hasPermission("users", "update") && (
                              <Menu.Item
                                onClick={() => {
                                  setUser(user);
                                  setConfirmDelete(true);
                                }}
                              >
                                <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                                {user.status !== 1 ? "Activate" : "Deactivate"}
                              </Menu.Item>
                            )}
                            {hasPermission("users", "update") && (
                              <Menu.Item
                                onClick={() => {
                                  setUser(user);
                                  setConfirmResetPassword(true);
                                }}
                              >
                                <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                                Reset Password
                              </Menu.Item>
                            )}
                          </Menu.Items>
                        </Menu>
                      </div>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center col-span-12 sm:flex-row sm:flex-nowrap tt">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <button
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className="py-2 px-4 rounded-md"
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </button>
            {_.times(pagination.total_pages).map((page, key) =>
              page + 1 === pagination.current_page ? (
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
                setPage(page < pagination.total_pages ? page + 1 : 1)
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

      {/* User Creation/Edit Dialog */}
      <Dialog
        staticBackdrop
        size="lg"
        open={dialog}
        onClose={() => {
          cancel({ name: "" });
          setDialog(false);
        }}
      >
        <Dialog.Panel>
          <form className="validate-form" onSubmit={onSubmit}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">
                {isEditMode ? "Edit User" : "New User"}
              </h2>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(false);
                }}
                className="absolute top-0 right-0 mt-3 mr-3"
                href="#"
              >
                <Lucide icon="X" className="w-8 h-8 text-slate-400" />
              </a>
            </Dialog.Title>
            <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">First Name</FormLabel>
                <FormInput
                  {...register("firstname")}
                  type="text"
                  name="firstname"
                  className={errors.firstname ? "border-danger" : ""}
                  placeholder="John"
                />
                {errors.firstname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.firstname.message === "string" &&
                      errors.firstname.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">Role</FormLabel>
                <FormSelect {...register("role")} name="role">
                  {roles?.map((role: any, key) => (
                    <option key={key} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Last Name</FormLabel>
                <FormInput
                  {...register("lastname")}
                  type="text"
                  name="lastname"
                  className={errors.lastname ? "border-danger" : ""}
                  placeholder="Doe"
                />
                {errors.lastname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastname.message === "string" &&
                      errors.lastname.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Phone Number</FormLabel>
                <FormInput
                  {...register("phone")}
                  type="number"
                  name="phone"
                  className={errors.phone ? "border-danger" : ""}
                  placeholder="+254 712 345 6789"
                />
                {errors.phone && (
                  <div className="mt-2 text-danger">
                    {typeof errors.phone.message === "string" &&
                      errors.phone.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Email</FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.email ? "border-danger" : ""}
                  placeholder="info@example.com"
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div>
              {!isEditMode && (
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-1">Password</FormLabel>
                  <FormInput
                    {...register("password")}
                    type="password"
                    name="password"
                    className={errors.password ? "border-danger" : ""}
                    placeholder="password"
                  />
                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}
                </div>
              )}
            </Dialog.Description>
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  cancel({ name: "" });
                }}
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
            </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>

      {/* Activate/Deactivate Confirmation Dialog */}
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
              Do you want to {user.status !== 1 ? "activate" : "deactivate"}{" "}
              this user?
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
              onClick={() => activateUser(user)}
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Yes
              {loading && (
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={confirmResetPassword}
        onClose={() => {
          setConfirmResetPassword(false);
        }}
        initialFocus={resetPasswordButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="Lock"
              className="w-16 h-16 mx-auto mt-3 text-indigo-600"
            />
            <div className="mt-5 text-3xl">Reset Password</div>
            <div className="mt-2 text-slate-500">
              Are you sure you want to trigger a password reset for <br />
              <strong>{user.email}</strong>?
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setConfirmResetPassword(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => resetPassword(user)}
              variant="primary"
              type="button"
              className="w-24 bg-indigo-600 hover:bg-indigo-700"
              ref={resetPasswordButtonRef}
            >
              Yes
              {loading && (
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Notification */}
      <Notification
        getRef={(el) => {
          notify.current = el;
        }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Users;
