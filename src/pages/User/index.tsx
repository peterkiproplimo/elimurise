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

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [users, setUsers] = useState([]);

  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      firstname: yup.string().required("name is required"),
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
        console.log(data);
        await ApiService.createUser(data);
        await getUser();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("User created successfully.");
        notify.current?.showToast();
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

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const response = await ApiService.getUser({ page: 1 });
    setUsers(response.data);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteUser(recordId);
      getUser();
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
          <div className="flex items-center mt-8 intro-y">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                reset({ name: "" });
                setDialog(false);
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">New User</h2>
          </div>
          <br />
          <form
            className="mt-5 p-5 intro-y box validate-form"
            onSubmit={onSubmit}
          >
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
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>First Name</FormLabel>
                <FormInput
                  {...register("firstname")}
                  type="text"
                  name="firstname"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="firstname"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Last Name</FormLabel>
                <FormInput
                  {...register("lastname")}
                  type="text"
                  name="lastname"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="lastname"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Phone</FormLabel>
                <FormInput
                  {...register("phone")}
                  type="number"
                  name="phone"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="phone"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Email</FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="email"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Role</FormLabel>
                <FormInput
                  {...register("role")}
                  type="text"
                  name="role_id"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="role"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Status</FormLabel>
                <FormInput
                  {...register("status")}
                  type="text"
                  name="status"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="status"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-12">
                <FormLabel>Password</FormLabel>
                <FormInput
                  {...register("password")}
                  type="password"
                  name="password"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="password"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
            </div>

            <div>
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
          <h2 className="mt-10 text-lg font-medium intro-y">Users</h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
              <Button
                variant="primary"
                className="mr-2 shadow-md"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(true);
                }}
              >
                New User
              </Button>

              <div className="hidden mx-auto md:block text-slate-500"></div>
            </div>
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      No
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      FirstName
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      LastName
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Phone
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Email
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Role
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
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.firstname}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.lastname}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.phone}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.email}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.role_id}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {user.status}
                        </span>
                      </Table.Td>

                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
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
                                <Menu.Item onClick={() => editRecord(user)}>
                                  <Lucide
                                    icon="Edit"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    setRecordId(user._id),
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
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
            {/* END: Data List */}
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
                  Do you really want to delete this record? <br />
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
              <div className="font-medium">
                {success ? "Success" : "Failed"}
              </div>
              <div className="mt-1 text-slate-500">{message}</div>
            </div>
          </Notification>
        </>
      )}
    </>
  );
}

export default Main;
// import _ from "lodash";
// import clsx from "clsx";
// import Button from "../../base-components/Button";
// import Pagination from "../../base-components/Pagination";
// import Lucide from "../../base-components/Lucide";
// import Tippy from "../../base-components/Tippy";
// import Table from "../../base-components/Table";
// import "./user.css";
// import { useState, useRef, useEffect } from "react";
// import {
//   FormCheck,
//   FormInput,
//   FormLabel,
//   FormSelect,
// } from "../../base-components/Form";
// import { Dialog, Menu } from "../../base-components/Headless";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as ApiService from "../../services/auth";
// import * as yup from "yup";
// import Notification, {
//   NotificationElement,
// } from "../../base-components/Notification";
// import LoadingIcon from "../../base-components/LoadingIcon";
// import Dropzone from "../../base-components/Dropzone";

// function Users() {
//   const [dialog, setDialog] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const deleteButtonRef = useRef(null);
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [conferences, setConferences] = useState([]);
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     total: 1,
//     total_pages: 1,
//     per_page: 1,
//   });
//   const [page, setPage] = useState(1);
//   const [next_page, setNextPage] = useState(1);
//   const [previous_page, setPreviousPage] = useState(1);
//   const [loading, isLoading] = useState(false);
//   const [success, setSuccess] = useState(true);
//   const [message, setMessage] = useState("");

//   // Success notification
//   const notify = useRef<NotificationElement>();
//   const schema = yup
//     .object({
//       tenant: yup.string().required("Conference is required"),
//       role: yup.string().required("Role is required"),
//       firstName: yup.string().required("First name is required"),
//       lastName: yup.string().required("Last name is required"),
//       email: yup
//         .string()
//         .required("Email is required")
//         .email("Email must be a valid"),
//     })
//     .required();

//   const {
//     register,
//     trigger,
//     getValues,
//     reset,
//     formState: { errors },
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     // getUsers();
//   }, []);

//   const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const result = await trigger();
//     if (result && !loading) {
//       isLoading(true);
//       try {
//         const data = await getValues();
//         // data.tenant = "64b199727fe94a1ea97a64cd";
//         let res = await ApiService.signup(data);
//         //getUsers();
//         await reset();
//         isLoading(false);
//         setDialog(false);
//         setSuccess(true);
//         setMessage(res.message);
//         notify.current?.showToast();
//       } catch (error: any) {
//         isLoading(false);
//         setSuccess(false);
//         setMessage(error.message);
//         notify.current?.showToast();
//       }
//     }
//   };

//   const deleteRecord = async () => {
//     isLoading(true);
//     try {
//       let res = await ApiService.deleteUser(userId);
//       //getUsers();
//       isLoading(false);
//       setConfirmDelete(false);
//       setSuccess(true);
//       setMessage(res.message);
//       notify.current?.showToast();
//     } catch (error: any) {
//       isLoading(false);
//       setSuccess(false);
//       setMessage(error.message);
//       notify.current?.showToast();
//     }
//   };

//   return (
//     <>
//       <h2 className="mt-10 text-lg font-medium intro-y">Users</h2>
//       <div className="grid grid-cols-12 gap-6 mt-5">
//         <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
//           <Button
//             className="mr-2 shadow-md user-button"
//             onClick={(event: React.MouseEvent) => {
//               event.preventDefault();
//               setDialog(true);
//             }}
//           >
//             New User
//           </Button>
//           <Menu>
//             <Menu.Button as={Button} className="px-2 !box">
//               <span className="flex items-center justify-center w-5 h-5">
//                 <Lucide icon="Plus" className="w-4 h-4" />
//               </span>
//             </Menu.Button>
//             <Menu.Items className="w-40">
//               <Menu.Item>
//                 <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
//               </Menu.Item>
//               <Menu.Item>
//                 <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
//                 Excel
//               </Menu.Item>
//               <Menu.Item>
//                 <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
//                 PDF
//               </Menu.Item>
//             </Menu.Items>
//           </Menu>
//           <div className="hidden mx-auto md:block text-slate-500">
//             Showing{" "}
//             {pagination.current_page +
//               " to " +
//               pagination.total_pages +
//               " of " +
//               pagination.total}{" "}
//             entries
//           </div>
//           <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
//             <div className="relative w-56 text-slate-500">
//               <FormInput
//                 type="text"
//                 className="w-56 pr-10 !box"
//                 placeholder="Search..."
//               />
//               <Lucide
//                 icon="Search"
//                 className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
//               />
//             </div>
//             <FormSelect className="w-56 ml-2 xl:w-auto !box">
//               <option>Status</option>
//               <option>Active</option>
//               <option>Inactive</option>
//             </FormSelect>
//           </div>
//         </div>
// <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
//   <Table className="border-spacing-y-[10px] border-separate -mt-2">
//     <Table.Thead>
//       <Table.Tr>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           <FormCheck.Input type="checkbox" />
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           ATTENDEE
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           SIM CARD
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           PREFERRED THEMES
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           PREFERRED SPEAKERS
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           PROFILE
//         </Table.Th>
//         <Table.Th className="border-b-0 whitespace-nowrap">
//           ACTIONS
//         </Table.Th>
//       </Table.Tr>
//     </Table.Thead>
//     <Table.Tbody>
//       {users.map((user: any, key) => (
//         <Table.Tr key={key} className="intro-x">
//           <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             <FormCheck.Input type="checkbox" />
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             <div className="flex items-center">
//               <div className="w-9 h-9 image-fit zoom-in">
//                 <Tippy
//                   as="img"
//                   alt=""
//                   className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
//                   src={user.profileImage}
//                   content={user.firstName + " " + user.lastName}
//                 />
//               </div>
//               <div className="ml-4">
//                 <a href="" className="font-medium whitespace-nowrap">
//                   {user.firstName + " " + user.lastName}
//                 </a>
//                 <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
//                   {user.email}
//                 </div>
//               </div>
//             </div>
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             <div
//               className={
//                 user.isPasswordChanged
//                   ? "flex items-center text-success"
//                   : "flex items-center text-danger"
//               }
//             >
//               <Lucide
//                 icon={
//                   user.isPasswordChanged ? "CheckSquare" : "XSquare"
//                 }
//                 className="w-4 h-4 mr-2"
//               />
//               {user.phoneNumber}
//             </div>
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             {user.themes}
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             {user.speakers}
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
//             <div
//               className={
//                 user.isPasswordChanged
//                   ? "flex items-center text-success"
//                   : "flex items-center text-danger"
//               }
//             >
//               {user.isPasswordChanged ? "COMPLETE" : "INCOMPLETE"}
//             </div>
//           </Table.Td>
//           <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
//             <div className="flex items-center justify-center">
//               <Menu>
//                 <Menu.Button as={Button} className="px-2 !box">
//                   <span className="flex items-center justify-center w-5 h-5">
//                     <Lucide icon="MoreVertical" className="w-4 h-4" />
//                   </span>
//                 </Menu.Button>
//                 <Menu.Items className="w-40">
//                   <Menu.Item>
//                     <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit
//                   </Menu.Item>
//                   <Menu.Item
//                     onClick={() => {
//                       setUserId(user._id), setConfirmDelete(true);
//                     }}
//                   >
//                     <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
//                     Delete
//                   </Menu.Item>
//                   <Menu.Item>
//                     <Lucide icon="View" className="w-4 h-4 mr-2" />{" "}
//                     Profile
//                   </Menu.Item>
//                   <Menu.Item>
//                     <Lucide icon="UserCheck" className="w-4 h-4 mr-2" />{" "}
//                     Activate
//                   </Menu.Item>
//                   <Menu.Item>
//                     <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
//                     Email Credentials
//                   </Menu.Item>
//                 </Menu.Items>
//               </Menu>
//             </div>
//           </Table.Td>
//         </Table.Tr>
//       ))}
//     </Table.Tbody>
//   </Table>
//   {loading && (
//     <div className="flex flex-col items-center">
//       <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
//     </div>
//   )}
// </div>
//         {/* END: Data List */}
//         {/* BEGIN: Pagination */}
//         <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
//           <FormSelect className="w-20 mt-3 !box sm:mt-0">
//             <option>10</option>
//             <option>25</option>
//             <option>35</option>
//             <option>50</option>
//           </FormSelect>
//         </div>
//         {/* END: Pagination */}
//       </div>
//       <Dialog
//         staticBackdrop
//         size="lg"
//         open={dialog}
//         onClose={() => {
//           setDialog(false);
//         }}
//       >
//         <Dialog.Panel>
//           <form className="validate-form" onSubmit={onSubmit}>
//             <Dialog.Title>
//               <h2 className="mr-auto text-base font-medium">New User</h2>
//               <a
//                 onClick={(event: React.MouseEvent) => {
//                   event.preventDefault();
//                   setDialog(false);
//                 }}
//                 className="absolute top-0 right-0 mt-3 mr-3"
//                 href="#"
//               >
//                 <Lucide icon="X" className="w-8 h-8 text-slate-400" />
//               </a>
//             </Dialog.Title>
//             <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">First Name</FormLabel>
//                 <FormInput
//                   {...register("firstName")}
//                   type="text"
//                   name="firstName"
//                   className={errors.firstName ? "border-danger" : ""}
//                   placeholder="John"
//                 />
//                 {errors.firstName && (
//                   <div className="mt-2 text-danger">
//                     {typeof errors.firstName.message === "string" &&
//                       errors.firstName.message}
//                   </div>
//                 )}
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Last Name</FormLabel>
//                 <FormInput
//                   {...register("lastName")}
//                   type="text"
//                   name="lastName"
//                   className={errors.lastName ? "border-danger" : ""}
//                   placeholder="Doe"
//                 />
//                 {errors.lastName && (
//                   <div className="mt-2 text-danger">
//                     {typeof errors.lastName.message === "string" &&
//                       errors.lastName.message}
//                   </div>
//                 )}
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-6">Conference</FormLabel>
//                 <FormSelect {...register("tenant")} name="tenant">
//                   {conferences.map((conference: any, key) => (
//                     <option key={key} value={conference._id}>
//                       {conference.name}
//                     </option>
//                   ))}
//                 </FormSelect>
//                 {errors.role && (
//                   <div className="mt-2 text-danger">
//                     {typeof errors.role.message === "string" &&
//                       errors.role.message}
//                   </div>
//                 )}
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-6">Role</FormLabel>
//                 <FormSelect {...register("role")} name="role">
//                   {roles.map((role: any, key) => (
//                     <option key={key} value={role._id}>
//                       {role.role}
//                     </option>
//                   ))}
//                 </FormSelect>
//                 {errors.role && (
//                   <div className="mt-2 text-danger">
//                     {typeof errors.role.message === "string" &&
//                       errors.role.message}
//                   </div>
//                 )}
//               </div>

//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Phone Number</FormLabel>
//                 <FormInput
//                   {...register("phoneNumber")}
//                   type="text"
//                   name="phoneNumber"
//                   placeholder="+254 712 345 6789"
//                 />
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Email</FormLabel>
//                 <FormInput
//                   {...register("email")}
//                   type="email"
//                   name="email"
//                   className={errors.email ? "border-danger" : ""}
//                   placeholder="info@example.com"
//                 />
//                 {errors.email && (
//                   <div className="mt-2 text-danger">
//                     {typeof errors.email.message === "string" &&
//                       errors.email.message}
//                   </div>
//                 )}
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Linkedin</FormLabel>
//                 <FormInput
//                   {...register("linkedin")}
//                   type="text"
//                   name="linkedin"
//                   placeholder="https://www.linkedin.com/"
//                 />
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Twitter</FormLabel>
//                 <FormInput
//                   {...register("twitter")}
//                   type="text"
//                   name="twitter"
//                   placeholder="https://twitter.com/"
//                 />
//               </div>
//               <div className="col-span-12 sm:col-span-6">
//                 <FormLabel htmlFor="modal-form-1">Facebook</FormLabel>
//                 <FormInput
//                   {...register("facebook")}
//                   type="text"
//                   name="linkedin"
//                   placeholder="https://www.facebook.com/"
//                 />
//               </div>

//               <div className="col-span-12 sm:col-span-12">
//                 <Dropzone
//                   getRef={(el) => {}}
//                   options={{
//                     url: "https://africaclimatesummit.org/",
//                     thumbnailWidth: 150,
//                     maxFilesize: 0.5,
//                     maxFiles: 1,
//                     headers: { "My-Awesome-Header": "header value" },
//                   }}
//                   className="dropzone"
//                 >
//                   <div className="text-lg font-medium">
//                     Upload profile photo.
//                   </div>
//                   <div className="text-gray-600">Optional</div>
//                 </Dropzone>
//               </div>
//             </Dialog.Description>
//             <Dialog.Footer>
//               <Button
//                 type="button"
//                 variant="outline-secondary"
//                 onClick={() => {
//                   setDialog(false);
//                 }}
//                 className="w-20 mr-1"
//               >
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" className="w-20">
//                 Save
//                 {loading && (
//                   <LoadingIcon
//                     icon="spinning-circles"
//                     color="white"
//                     className="w-4 h-4 ml-2"
//                   />
//                 )}
//               </Button>
//             </Dialog.Footer>
//           </form>
//         </Dialog.Panel>
//       </Dialog>
//       {/* BEGIN: Delete Confirmation Modal */}
//       <Dialog
//         open={confirmDelete}
//         onClose={() => {
//           setConfirmDelete(false);
//         }}
//         initialFocus={deleteButtonRef}
//       >
//         <Dialog.Panel>
//           <div className="p-5 text-center">
//             <Lucide
//               icon="XCircle"
//               className="w-16 h-16 mx-auto mt-3 text-danger"
//             />
//             <div className="mt-5 text-3xl">Are you sure?</div>
//             <div className="mt-2 text-slate-500">
//               Do you really want to delete this record? <br />
//               This process cannot be undone.
//             </div>
//           </div>
//           <div className="px-5 pb-8 text-center">
//             <Button
//               variant="outline-secondary"
//               type="button"
//               onClick={() => {
//                 setConfirmDelete(false);
//               }}
//               className="w-24 mr-1"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => deleteRecord()}
//               variant="danger"
//               type="button"
//               className="w-24"
//               ref={deleteButtonRef}
//             >
//               Delete
//             </Button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//       {/* END: Delete Confirmation Modal */}
//       <Notification
//         getRef={(el) => {
//           notify.current = el;
//         }}
//         options={{
//           duration: 3000,
//         }}
//         className="flex"
//       >
//         <Lucide
//           icon={success ? "CheckCircle" : "XCircle"}
//           className={success ? "text-success" : "text-danger"}
//         />
//         <div className="ml-4 mr-4">
//           <div className="font-medium">{success ? "Success" : "Failed"}</div>
//           <div className="mt-1 text-slate-500">{message}</div>
//         </div>
//       </Notification>
//     </>
//   );
// }

// export default Users;
