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
import { formatDate } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import Alert from "../../base-components/Alert";
import Tippy from "../../base-components/Tippy";
import avarter from "../../assets/images/woman.jpeg";
function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [filteredLearningAreas, setFilteredLearningAreas] = useState([]);
  const [grades, setGrades] = useState([]);
  const initialState = {
    grade: "",
    learning_area: "",
    term: "",
  };
  const [strandFilter, updateStrandFilter] = useState(initialState);
  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };
  useEffect(() => {
    setFilteredLearningAreas([]);
    const lerning_areas = learningAreas.filter(
      (area: any) => area?.grade_id?._id === strandFilter.grade
    );
    const data = getValues();

    reset();
    reset({ user: data.user, grade: strandFilter.grade });
    setFilteredLearningAreas(lerning_areas);
  }, [strandFilter.grade]);
  const navigate = useNavigate();

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
      firstname: yup.string().required("First Name is required"),
      lastname: yup.string().required("Last Name is required"),
      email: yup.string().required(" Email is required"),
      surname: yup.string().required("Surname is required"),
      phone: yup.string().required("Phone  Number is required"),
      // .min(11, "Phone number must be at least 11 characters long")
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
  const handleGradeChange = async (value: any) => {
    // const selectedValue = event.target.value;

    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: value,
    });

    // You might want to fetch filtered data here
  };


  useEffect(() => {
    getTeachers();
  }, [search, page, limit]);
  useEffect(() => {
    // getAcademicYear();
  }, []);
  const getTeachers = async () => {
    isLoading(true);
    const response = await ApiService.getTeachers({
      page: 1,
    });
    setTeachers(response.data);
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    isLoading(false);
  };
  useEffect(() => {
    getLearningAreas();
    getGrades();
  }, []);

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
  // const getAcademicYear = async () => {
  //   const response = await ApiService.getAcademic({ page: 1 });
  //   setAcademic(response.data);
  // };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteTeachers(recordId);
      getTeachers();
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

  const openStrand = (learningArea: any) => {
    navigate("/home/Strands", {
      replace: true,
      state: { data: learningArea },
    });
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
                setIsEditMode(false);
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">
              {isEditMode ? "Edit Teacher" : "Add Teacher"}
            </h2>
          </div>

       
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium intro-y">Grades</h2>
          {message && success && (
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
          )}
          <div className="grid grid-cols-12 gap-6 mt-5">
          
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
              <Table className="border-spacing-y-[3px] border-separate mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      No.
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                       Name
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                       Levels
                    </Table.Th>
              
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {grades.map((grade: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
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
                                grade.name
                              }
                            />
                          </div>
                          <div className="ml-4">
                            <a
                              href="#"
                              onClick={() =>
                                navigate("/home/learning_areas/" + grade?._id)
                              }
                              className="font-medium whitespace-nowrap"
                            >
                              {grade.name}
                            
                            </a>
                            {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {teacher.phone}
                            </div> */}
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {grade.level_id.name}
                            </span>
                          </Table.Td>
                  
                  
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : (
                <>
                  {teachers.length === 0 && (
                    <div className="flex flex-col items-center mt-10 bg-white p-8">
                      {/* <Search size={28} className="" /> */}
                      <p className="text-xl text-slate-500 ">
                        No records found
                      </p>
                    </div>
                  )}
                </>
              )}
              {loading === false && teachers.length > 0 && (
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
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
