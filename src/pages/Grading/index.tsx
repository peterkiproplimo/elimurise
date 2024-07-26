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
import { Search } from "lucide-react";
import LoadingIcon from "../../base-components/LoadingIcon";
import Dropzone from "../../base-components/Dropzone";
import TomSelect from "../../base-components/TomSelect";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

function Users() {
  const data = useParams();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<any>({});
  const [selectGroup, setGroup] = useState([""]);
  const [roles, setRoles] = useState([]);
  // const [userId, setUserId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [filteredLearningAreas, setFilteredLearningAreas] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [streams, setStreams] = useState([]);
  const [stream, setStream] = useState("");
  const [grading, setGrading] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const initialState = {
    grade: "",
    learning_area: "",
    term: "",
  };
  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };

  // Initialize state with the value from localStorage or initialState if no value is found
  const [strandFilter, updateStrandFilter] = useState(initialState);
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      // tenant: yup.string().required("Conference is required"),
      // user: yup.string().required("user is required"),
      grade: yup.string().required("grade is required"),
      name: yup.string().required("name is required"),
      // learning_area: yup.string().required("learning area is required"),
    })
    .required();

  const {
    register,
    trigger,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    getRole();
    getUsers();
    getLearningAreas();
    getGrades();
    // getStreams();
  }, []);
  useEffect(() => {
    fetchGrading();
  }, [search, limit, page, gradeId]);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({
      page: 1,
      limit: 100000,
    });
    setLearningAreas(response.data);
  };
  const fetchGrading = async () => {
    isLoading(true);
    let res = await ApiService.getListOfGradings({
      page: page,
      search: search,
      limit: 10000,

      gradeId: gradeId,
    });
    isLoading(false);

    const pagination = res.pagination;
    setPagination({
      current_page: pagination?.current_page,
      total: pagination?.total,
      total_pages: pagination?.total_pages,
      per_page: pagination?.per_page,
    });
    setGrading(res.data);
    console.log(grading);
    isLoading(false);
  };
  const getUsers = async () => {
    // let res = await ApiService.getUsers({
    //   page: page,
    //   search: search,
    //   limit: 10000,
    // });
    // setUsers(res.data);
  };
  const getStreams = async (selectedValue: any) => {
    setStreams([]);
    const response = await ApiService.getStream({
      page: 1,
      grade: selectedValue,
    });
    setStreams(response.data);
  };
  const getRole = async () => {
    let res = await ApiService.getRole({ page: 1, search: "", limit: "" });
    setRoles(res.data?.roles);
  };

  const activateUser = async (data: any) => {
    isLoading(true);
    let res = await ApiService.activateorDeactivateUsers(data);
    getUsers();
    setConfirmDelete(false);
    isLoading(false);
  };
  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log(data);
        // isLoading(false);
        // return;
        let res = await ApiService.createGrading(data);
        fetchGrading();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
      } catch (error: any) {
        console.log(error);
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
    console.log(record);
    reset({ ...record, role_id: record.role_id._id });

    setDialog(true);
  };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteLearningAreaAssignment(user?._id);
      fetchGrading();
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
  const cancel = (record: any) => {
    setGroup([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };
  useEffect(() => {
    setFilteredLearningAreas([]);
    const lerning_areas = learningAreas.filter(
      (area: any) => area?.grade_id?._id === strandFilter.grade
    );
    const data = getValues();

    reset();
    reset({ grade: strandFilter.grade });
    setFilteredLearningAreas(lerning_areas);
  }, [strandFilter.grade]);
  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: selectedValue,
    });
    getStreams(selectedValue);

    // You might want to fetch filtered data here
  };
  const handleLearningAreaChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    await setStrandFilter({
      ...strandFilter,
      learning_area: selectedValue,
    });
    // You might want to fetch filtered data here
  };
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    filteredLearningAreas.forEach((_, index) => {
      setValue(`learningArea[${index}].selected`, newSelectAll);
    });
  };
  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    grade: "",
    learningAreas: [
      {
        learning_area: "",
        gradings: [
          {
            minScore: "",
            maxScore: "",
            description: "",
          },
        ],
      },
    ],
  });

  const openConfig = (data: any) => {
    navigate("/grading-config/" + data?._id);
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Users Assignment</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <Button
            className="mr-2 shadow-md user-button"
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              cancel({ name: "" });
              setDialog(true);
            }}
          >
            New Grading
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
            <div className="relative w-56 text-slate-500 box mr-2">
              {/* <TomSelect
                onChange={(data: any) => setGradeId(data)}
                value={gradeId}
              >
                <option value={""}>Select Grade</option>
                {grades.map((grade: any, key) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </TomSelect> */}
            </div>

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
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          {loading ? (
            <div className="flex flex-col items-center mt-5">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          ) : grading.length === 0 ? (
            <div className="flex flex-col items-center mt-10">
              <Search size={88} className="animate-bounce" />
              <p className="text-xl">No data found</p>
            </div>
          ) : (
            <Table className="border-spacing-y-[10px] border-separate -mt-2">
              <Table.Thead>
                <Table.Tr>
                  {/* <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th> */}
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    NO
                  </Table.Th>

                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Name
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Grade
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {grading.map((grade: any, key) => (
                  <Table.Tr key={key} className="intro-x">
                    <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {key + 1}
                    </Table.Td>

                    <Table.Td
                      onClick={(e) => openConfig(grade)}
                      className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] cursor-pointer"
                    >
                      {grade?.name}{" "}
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {grade?.grade?.name}
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
                            {/* <Menu.Item onClick={() => editRecord(assignment)}>
                            <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit
                          </Menu.Item> */}
                            <Menu.Item
                              onClick={() => {
                                // active(user)
                                setUser(grade);
                                setConfirmDelete(true);
                              }}
                              className="text-danger"
                            >
                              <Lucide icon="Trash" className="w-4 h-4 mr-2 " />
                              {"Remove"}
                            </Menu.Item>

                            {/* <Menu.Item>
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Email Credentials
                          </Menu.Item> */}
                          </Menu.Items>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
        {/* END: Data List */}
        {/* END: Data List */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
            <Pagination className="w-full sm:w-auto sm:mr-auto">
              <button
                onClick={() => setPage(previous_page)}
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
                onClick={() => setPage(next_page)}
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
        {/* END: Pagination */}
      </div>
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
                {" "}
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
            <Dialog.Description className="">
              <div className="space-y-6 p-4 max-w-4xl mx-auto  rounded-lg ">
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    {...register("name")}
                    type="text"
                    name="name"
                    // value={form.name}
                    // onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Grade</label>
                  <FormSelect
                    {...register("grade")}
                    name="grade"
                    // value={form.grade}
                    // onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    <option>Select Grade</option>
                    {grades.map((grade: any, key) => (
                      <option key={key} value={grade._id}>
                        {grade.name}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              </div>
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
            {/* <div className="mt-2 text-slate-500">
              Do you want to{user.status !== 1 ? "Activate" : "Deactivate"} user? <br />
             
            </div> */}
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
              onClick={(data: any) => deleteRecord()}
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

export default Users;
