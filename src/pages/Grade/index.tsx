import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";
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
import Dropzone from "../../base-components/Dropzone";
import AccountDetails from "../accountDetails";
import fakerData from "../../utils/faker";
import { FormTextarea } from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import { User } from "../../type";

function Main() {
  const [countries] = useState([
    { name: "Afghanistan", code: "AF" },
    { name: "Åland Islands", code: "AX" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "AndorrA", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
  ]);

  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  // const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [conferences, setConferences] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 1,
    total_pages: 1,
    per_page: 1,
  });
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  // const [selectedUserId, setSelectedUserId] = useState(null);

  const [users, setUsers] = useState<User[]>([]); // Initialize with appropriate type
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      tenant: yup.string().required("Conference is required"),
      role: yup.string().required("Role is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup
        .string()
        .required("Email is required")
        .email("Email must be a valid"),
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

  const [select, setSelect] = useState("1");

  useEffect(() => {
    // getUsers();
    // getRoles();
    // getConferences();
  }, []);

  // const getUsers = async () => {
  //   isLoading(true);
  //   try {
  //     let res = await ApiService.getUsers({ page: 1 });
  //     setUsers(res.users);
  //     console.log(res);
  //     isLoading(false);
  //     setNextPage(page < res.total_pages ? page + 1 : res.total_pages);
  //     setPreviousPage(page > 1 ? page - 1 : 1);
  //     setPagination({
  //       current_page: res.current_page,
  //       total: res.total,
  //       total_pages: res.total_pages,
  //       per_page: res.per_page,
  //     });
  //   } catch (error) {
  //     isLoading(false);
  //     console.log("Error fetching users");
  //   }
  // };

  // // const getRoles = async () => {
  //   let res = await ApiService.getRoles();
  //   setRoles(res);
  // };

  // const getConferences = async () => {
  //   let res = await ApiService.getConferences();
  //   setConferences(res.conferences);
  //   setPagination({ current_page: res.current_page, total: res.total, total_pages: res.total_pages, per_page: res.per_page });
  // };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        // data.tenant = "64b199727fe94a1ea97a64cd";
        let res = await ApiService.signup(data);
        getUsers();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        notify.current?.showToast();
      }
    }
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteUser(userId);
      getUsers();
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

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Grades</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          {/* <Button variant="primary" className="mr-2 shadow-md" onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            setDialog(true);
          }}>
            New Speaker
          </Button> */}
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
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="w-56 ml-2 xl:w-auto !box">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </FormSelect>
          </div>
        </div>
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  No.
                </Table.Th>
                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                Middle Name
                </Table.Th> */}
                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                Last Name
                </Table.Th> */}
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Level
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Grade
                </Table.Th>
                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                NATIONALITY
                </Table.Th> */}
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user: any, key) => (
                <Table.Tr
                  key={key}
                  className="intro-x"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setSelectedUserId(user.id);
                    setDialog(true);
                  }}
                >
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-9 h-9 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt=""
                          className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={user.profileImage}
                          content={user.firstName + " " + user.lastname}
                        />
                      </div>
                      <div className="ml-4">
                        {/* <a href="" className="font-medium whitespace-nowrap">
                          {user.firstname + " " + user.lastname}
                        </a> */}
                        {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          {user.role.role}
                        </div> */}
                        {user.firstname}
                      </div>
                    </div>
                  </Table.Td>
                  {/* <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.middlename}
                  </Table.Td> */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.lastname}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.phone}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.email}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.nationality}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": user.approval_status },
                        { "text-danger": !user.approval_status },
                      ])}
                    >
                      <Lucide
                        icon={user.approval_status ? "CheckSquare" : "XSquare"}
                        className="w-4 h-4 mr-2"
                      />
                      {user.approval_status ? "Active" : "Inactive"}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <Menu>
                        <Menu.Button as={Button} className="px-2 !box">
                          <span className="flex items-center justify-center w-5 h-5">
                            <Lucide icon="MoreVertical" className="w-4 h-4" />
                          </span>
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setUserId(user.id), setConfirmDelete(true);
                            }}
                          >
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                            Delete
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="View" className="w-4 h-4 mr-2" />{" "}
                            Profile
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="UserCheck" className="w-4 h-4 mr-2" />{" "}
                            Activate
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Email Credentials
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {loading && (
            <div className="flex flex-col items-center">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link
              onClick={() => (setPage(previous_page), getUsers())}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            {_.times(pagination.total_pages).map((page, key) =>
              page + 1 == pagination.current_page ? (
                <Pagination.Link
                  onClick={() => (setPage(page + 1), getUsers())}
                  active
                  key={key}
                >
                  {page + 1}
                </Pagination.Link>
              ) : (
                <Pagination.Link
                  onClick={() => (setPage(page + 1), getUsers())}
                  key={key}
                >
                  {page + 1}
                </Pagination.Link>
              )
            )}
            <Pagination.Link onClick={() => (setPage(next_page), getUsers())}>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
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
        <Dialog.Panel>
          <>
            <div className="flex items-center mt-8 intro-y">
              <h2 className="mr-auto text-lg font-medium">Account details</h2>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                {/* BEGIN: Display Information */}

                {/* BEGIN: Personal Information */}
                <div className="mt-5 intro-y box">
                  <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="mr-auto text-base font-medium">
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-12 gap-x-5">
                      <div className="col-span-12 xl:col-span-6">
                        <div>
                          <FormLabel htmlFor="update-profile-form-6">
                            first name
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.firstname || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                        <div>
                          <FormLabel htmlFor="update-profile-form-6">
                            middle name
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.middlename || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                          <FormLabel htmlFor="update-profile-form-6">
                            last name
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.lastname || "" : ""}

                            onChange={() => {}}
                            disabled
                          />

                          <FormLabel htmlFor="update-profile-form-6">
                            Document Type
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.document_type || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                          <FormLabel htmlFor="update-profile-form-6">
                            ID Number
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.document_number || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                          <FormLabel htmlFor="update-profile-form-6">
                            Nationality
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.nationality || "" : ""}

                            onChange={() => {}}
                            disabled
                          />

                          <FormLabel htmlFor="update-profile-form-7">
                            Gender
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.gender || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-span-12 xl:col-span-6">
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            Phone Number
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.phone || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>

                        <div className="mt-3">
                          <FormLabel htmlFor="update-profile-form-7">
                            Email
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.email || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>

                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            Marital status
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.maritalStatus || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            Occupation
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.occupation || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            Source of income
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.sourceOfIncome || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            County
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.county || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                        <div className="mt-3 xl:mt-0">
                          <FormLabel htmlFor="update-profile-form-7">
                            Town
                          </FormLabel>
                          <FormInput
                            id="update-profile-form-6"
                            type="text"
                            placeholder="Input text"
                            // value={selectedUserId ? users.find(user => user.id === selectedUserId)?.town || "" : ""}

                            onChange={() => {}}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* END: Personal Information */}

                {/* <div className="intro-y box lg:mt-5">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">
                Display Information
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col xl:flex-row">
                <div className="flex-1 mt-6 xl:mt-0">
                  <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-12 2xl:col-span-6">
                   
                      <div className="mt-3 xl:mt-0">
                  <FormLabel htmlFor="update-profile-form-7">First Name</FormLabel>
                    <FormInput
                      id="update-profile-form-6"
                      type="text"
                      placeholder="Input text"
                      value={selectedUserId ? users.find(user => user.id === selectedUserId)?.town || "" : ""}
           
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                      <div className="mt-3">
                        <FormLabel htmlFor="update-profile-form-2">
                          Nearest MRT Station
                        </FormLabel>
                        <TomSelect
                          id="update-profile-form-2"
                          value={select}
                          onChange={setSelect}
                          className="w-full"
                        >
                          <option value="1">Admiralty</option>
                          <option value="2">Aljunied</option>
                          <option value="3">Ang Mo Kio</option>
                          <option value="4">Bartley</option>
                          <option value="5">Beauty World</option>
                        </TomSelect>
                      </div>
                    </div>
                    <div className="col-span-12 2xl:col-span-6">
                      <div className="mt-3 2xl:mt-0">
                        <FormLabel htmlFor="update-profile-form-3">
                          Postal Code
                        </FormLabel>
                        <TomSelect
                          id="update-profile-form-3"
                          value={select}
                          onChange={setSelect}
                          className="w-full"
                        >
                          <option value="1">
                            018906 - 1 STRAITS BOULEVARD SINGA...
                          </option>
                          <option value="2">
                            018910 - 5A MARINA GARDENS DRIVE...
                          </option>
                          <option value="3">
                            018915 - 100A CENTRAL BOULEVARD...
                          </option>
                          <option value="4">
                            018925 - 21 PARK STREET MARINA...
                          </option>
                          <option value="5">
                            018926 - 23 PARK STREET MARINA...
                          </option>
                        </TomSelect>
                      </div>
                      <div className="mt-3">
                        <FormLabel htmlFor="update-profile-form-4">
                          Phone Number
                        </FormLabel>
                        <FormInput
                          id="update-profile-form-4"
                          type="text"
                          placeholder="Input text"
                          value="65570828"
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="mt-3">
                        <FormLabel htmlFor="update-profile-form-5">
                          Address
                        </FormLabel>
                        <FormTextarea
                          id="update-profile-form-5"
                          placeholder="Adress"
                          value="10 Anson Road, International Plaza, #10-11, 079903
                            Singapore, Singapore"
                          onChange={() => {}}
                        ></FormTextarea>
                      </div>
                    </div>
                  </div>
                  <Button variant="primary" type="button" className="w-20 mt-3">
                    Save
                  </Button>
                </div>
                <div className="mx-auto w-52 xl:mr-0 xl:ml-6">
                  <div className="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400">
                    <div className="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
                      <img
                        className="rounded-md"
                        alt=""
                        src={fakerData[0].photos[0]}
                      />
                      <Tippy
                        as="div"
                        content="Remove this profile photo?"
                        className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                      >
                        <Lucide icon="X" className="w-4 h-4" />
                      </Tippy>
                    </div>
                    <div className="relative mx-auto mt-5 cursor-pointer">
                      <Button
                        variant="primary"
                        type="button"
                        className="w-full"
                      >
                        Change Photo
                      </Button>
                      <FormInput
                        type="file"
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
                {/* END: Display Information */}
              </div>
            </div>
          </>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              setDialog(false);
            }}
            className="w-20 mr-1"
          >
            Cancel
          </Button>
          {/* <Button variant="primary" type="submit" className="w-20">
                Save
                {
                  loading && <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                }
              </Button>
            */}
        </Dialog.Panel>
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

export default Main;
