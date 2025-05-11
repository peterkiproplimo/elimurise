import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
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
// Define module-specific actions
type ModuleConfig = {
  [moduleName: string]: string[]; // Actions are defined as strings
};

// Configuration for modules and their actions
const MODULE_CONFIG: ModuleConfig = {
  // meta: ["read", "create", "update", "delete"],
  behaviour: ["read", "create", "update", "delete", "assess"],
  "grading-scale": ["read", "create", "update", "delete"],
  // auth: ["read", "create", "update", "delete"],
  subscription: ["read", "create", "update", "delete"],
  teachers: ["read", "create", "update", "delete", "bulky-import"],
  learners: [
    "read",
    "create",
    "update",
    "delete",
    "history",
    "bulk-import",
    "change-status",
  ],
  streams: ["read", "create", "update", "delete"],
  enrollment: ["read", "create", "update", "promote"],
  parents: ["read", "create", "update", "delete", "bulk-import"],
  assessment: [
    "read",
    // "create",
    "assess",
    // "publish",
    "learners-report",
    "analysis-report",
  ],
  "learning-areas": ["read", "create", "update", "delete"],

  users: [
    "read",
    "create",
    "update",
    "delete",
    "update-profile",
    "deactivate",
    "activate",
  ],
  roles: ["read", "create", "update", "delete"],
  school: ["read", "create", "update", "delete"],
  "grade-teacher-assignment": ["read", "create", "update", "delete"],
  tests: [
    "read",
    "create",
    "update",
    "delete",
    "learners-report",
    "assess",
    "publish",
  ],
  "grading-system": ["read", "create", "update", "delete"],
  summative: ["read", "create", "update", "delete"],
  grades: ["read", "create", "update", "delete"],
  dashboard: ["read", "view-stats"],
  "transfer-requests": ["read", "create", "update", "delete", "approve"],
  payments: ["read", "create", "process", "delete"],
  comment: ["read", "create"],
  communication: ["read", "create"],
  attendance: ["read", "create"],
};

// Define role structure
type Permissions = Record<string, string[]>;

interface Role {
  _id: string;
  name: string;
  permissions: Permissions;
}

interface RolePermissionsScreenProps {
  initialData: Role;
}
function Roles() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [newRole, setNewRole] = useState(false);
  const [roles, setRoles] = useState<any>([]);
  const [modules, setModules] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [role, setRole] = useState<any>({});

  const allActions = [
    "read",
    "create",
    "update",
    "delete",
    "assess",
    "publish",
    "history",
    "bulk-import",
    "change-status",
    "view-stats",
    "approve",
    "process",
  ];

  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions, setPermissions] = useState<any>([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [images, setImages] = useState([]);
  const [module, setModule] = useState([]);
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
      // name: yup.string().required("Role name is required"),
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
    console.log(role);
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log(data);
        await ApiService.createRole(role);
        await getRoles();
        await reset();
        isLoading(false);
        setNewRole(false);
        setSuccess(true);
        setMessage("Role created successfully.");
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
    getRoles();
    // getModules();
  }, [search, limit, page]);

  const getRoles = async () => {
    const response = await ApiService.getRole({
      page: page,
      search: search,
      limit: limit,
    });
    const pagination = response.pagination;
    // setPagination({
    //   current_page: pagination.current_page,
    //   total: pagination.total,
    //   total_pages: pagination.total_pages,
    //   per_page: pagination.per_page,
    // });
    setModule(response?.data?.module);
    setRoles(response?.data);
    isLoading(false);
    console.log(response?.data);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteRole(recordId);
      getRoles();
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
    setNewRole(true);
    setIsEditMode(true);
    setGroup(record.groups);
    setRole(record);
    setPermissions(record.permissions);
    console.log("loggiing role", role);
    reset(record);
    setNewRole(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setNewRole(false);
  };

  // Function to toggle permissions
  const handlePermissionChange = (module: string, action: string) => {
    setRole((prev: any) => {
      const updatedPermissions = { ...prev.permissions };
      if (updatedPermissions[module]?.includes(action)) {
        // Remove action
        updatedPermissions[module] = updatedPermissions[module].filter(
          (a: any) => a !== action
        );
      } else {
        // Add action
        updatedPermissions[module] = [
          ...(updatedPermissions[module] || []),
          action,
        ];
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Save Role Permissions
  const handleSave = () => {
    console.log("Updated Role:", role);
    // Send updated role to API
  };

  return (
    <>
      <h2 className="mt-1 text-lg font-medium ">Roles</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
          <Button
            variant="primary"
            className="mr-2 shadow-md"
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              setNewRole(true);
            }}
          >
            New Role
          </Button>
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
        <div className="col-span-12 overflow-auto  2xl:overflow-visible">
          <Table className="border-spacing-y-[5px]  border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  No.
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Name
                </Table.Th>

                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                  Created AT
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Updated At
                </Table.Th> */}
                <Table.Th className="border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {roles?.map((role: any, key: any) => (
                <Table.Tr key={key} className="">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <span className="font-medium whitespace-nowrap">
                      {key + 1}
                    </span>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <span className="font-medium whitespace-nowrap">
                      {role.name}
                    </span>
                  </Table.Td>
                  {/* 
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <span className="font-medium whitespace-nowrap">
                      {new Date(role.createdAt).toLocaleString("en-US", {
                        timeZone: "Africa/Nairobi", // Set to the Kenyan time zone
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <span className="font-medium whitespace-nowrap">
                      {new Date(role.updatedAt).toLocaleString("en-US", {
                        timeZone: "Africa/Nairobi", // Set to the Kenyan time zone
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Table.Td> */}

                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      {/* {role.name != "Super Admin" && ( */}
                      <Menu>
                        <Menu.Button as={Button} className="px-2 !box">
                          <span className="flex items-center justify-center w-5 h-5">
                            <Lucide icon="MoreVertical" className="w-4 h-4" />
                          </span>
                        </Menu.Button>
                        <Menu.Items>
                          <Menu.Item onClick={() => editRecord(role)}>
                            <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit
                          </Menu.Item>
                          <Menu.Item onClick={() => editRecord(role)}>
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Permissions
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setRecordId(role._id), setConfirmDelete(true);
                            }}
                          >
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                            Delete
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                      {/* )} */}
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
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
        {/* END: Data List */}
      </div>
      <>
        <Dialog
          staticBackdrop
          size="lg"
          open={newRole}
          onClose={() => {
            setNewRole(false);
          }}
        >
          <Dialog.Panel>
            <form className="validate-form" onSubmit={onSubmit}>
              <Dialog.Title>
                <h2 className="mr-auto text-base font-medium">
                  {isEditMode
                    ? "Edit Role"
                    : newRole
                    ? "New Role"
                    : "Permissions"}
                </h2>
                <a
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setNewRole(false);
                  }}
                  className="absolute top-0 right-0 mt-3 mr-3"
                  href="#"
                >
                  <Lucide icon="X" className="w-8 h-8 text-slate-400" />
                </a>
              </Dialog.Title>
              <Dialog.Description className="grid grid-cols-1 gap-4 gap-y-3">
                {/* <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-1">Role Name</FormLabel>
                  <FormInput
                    {...register("name")}
                    type="text"
                    name="name"
                    className={errors.name ? "border-danger" : ""}
                    placeholder="Role Name"
                  />
                  {errors.name && (
                    <div className="mt-2 text-danger">
                      {typeof errors.name.message === "string" &&
                        errors.name.message}
                    </div>
                  )}
                </div> */}
                <div className="mb-1">
                  <label className="block text-sm font-medium">Role Name</label>
                  <FormInput
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={role.name}
                    onChange={(e) => setRole({ ...role, name: e.target.value })}
                  />
                </div>
                <div className="bg-white shadow rounded ">
                  <h2 className="text-lg font-semibold mb-2">Permissions</h2>
                  {Object.entries(MODULE_CONFIG)
                    .sort(([moduleA], [moduleB]) =>
                      moduleA.localeCompare(moduleB)
                    ) // Sort by module name

                    .map(([module, actions]) => (
                      <div key={module} className="mb-4">
                        <h3 className="text-md font-medium capitalize">
                          {module.replaceAll("-", " ")}
                        </h3>
                        <div className="flex gap-4 flex-wrap">
                          {actions.map((action) => (
                            <label
                              key={action}
                              className="flex items-center gap-2"
                            >
                              <FormInput
                                type="checkbox"
                                defaultChecked={
                                  permissions[module]?.includes(action) || false
                                }
                                className=" w-5 h-5 border-gray-400 rounded-md focus:ring-indigo-500"
                                onChange={() =>
                                  handlePermissionChange(module, action)
                                }
                              />
                              <span className="capitalize">
                                {action.replaceAll("-", " ")}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                {/* Permissions */}
                {/* <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Permissions</h2>
                  <div className="space-y-4">
                    {Object.keys(permissions)?.map((category) => (
                      <div key={category} className="p-4 border rounded">
                        <h3 className="text-md font-medium capitalize">
                          {category.replaceAll("-", " ")}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          {allActions.map((action) => (
                            <label
                              key={action}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                className="rounded focus:ring-blue-500"
                                checked={
                                  role.permissions[category]?.includes(
                                    action
                                  ) || false
                                }
                            
                              />
                             
                              <h3 className="text-md font-medium capitalize">
                                {action.replaceAll("-", " ")}
                              </h3>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </Dialog.Description>

              <Dialog.Footer>
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => {
                    setNewRole(false);
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
      </>

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
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Roles;
