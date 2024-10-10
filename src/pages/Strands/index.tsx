import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
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
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/collection.jpeg";
import { Search } from "lucide-react";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);

  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [hasTheme, setHasTheme] = useState(false);
  const [strands, setStrands] = useState([]);
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
  const navigate = useNavigate();
  const location = useLocation();
  const learningArea = location?.state?.data;
  console.log(learningArea);
  const initialState = {
    grade: learningArea?.grade_id?._id || "na",
    learning_area: learningArea?._id || "na",
    term: learningArea?._id ? 1 : "na",
  };

  // const [strandFilter, setStrandFilter] = useState({
  //   grade: "na",
  //   learning_area: "na",
  //   term: "na",
  // });
  const [strandFilter, updateStrandFilter] = useState(() => {
    const savedState = localStorage.getItem("strandFilter");
    return initialState;
  });
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      name: yup.string().required("Level is required"),
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
    getStrands();
  }, []);
  const getStrands = async () => {
    isLoading(true);
    const response = await ApiService.getStrands(
      {
        page: page,
        search: search,
        limit: limit,
      },
      strandFilter
    );
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setStrands(response.data);
    isLoading(false);
  };

  const openSubStrand = (strand: any) => {
    navigate("/home/substrand", {
      replace: true,
      state: { data: strand, learningArea: learningArea },
    });
  };

  const openLearningArea = (strand: any) => {
    console.log(learningArea);
    navigate("/home/learning_areas", {
      replace: true,
      state: { data: learningArea.grade },
    });
  };

  const handleHasThemeChange = async (event: any) => {
    const isChecked = event.target.checked;
    setStrands([]);
    setHasTheme(isChecked);
    // You might want to fetch filtered data here
  };
  const [rows, setRows] = useState<TableRow[]>([
    { no: 1, strandName: "Example Strand" },
  ]);

  return (
    <>
      {dialog ? (
        <></>
      ) : (
        <>
          <h2 className="mt-10 text-xl font-medium intro-y flex flex-wrap">
            <a
              onClick={(e: any) => openLearningArea(strands)}
              className=" mr-5 "
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 " />
            </a>
            {learningArea?.name}
          </h2>

          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select Grade</FormLabel>
              <FormSelect
                {...register("grade")}
                name="grade"
                value={strandFilter.grade}
                onChange={(event) => handleGradeChange(event)}
              >
                <option>Select Grade</option>
                {grades.map((grade: any, key) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </FormSelect>
              {errors.grade && (
                <div className="mt-2 text-danger">
                  {typeof errors.grade.message === "string" &&
                    errors.grade.message}
                </div>
              )}
            </div> */}

            {/* <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select Learning Area</FormLabel>
              <FormSelect
                {...register("learning_area")}
                name="learning_area"
                value={strandFilter.learning_area}
                onChange={(event) => handleLearningAreaChange(event)}
              >
                <option>Select Learning Area</option>
                {learningAreas
                  .filter(
                    (area: any) => area?.grade_id?._id === strandFilter.grade
                  )
                  .map((filteredArea: any, key) => (
                    <option key={key} value={filteredArea._id}>
                      {filteredArea.name}
                    </option>
                  ))}
              </FormSelect>
              {errors.learning_area && (
                <div className="mt-2 text-danger">
                  {typeof errors.learning_area.message === "string" &&
                    errors.learning_area.message}
                </div>
              )}
            </div>

            <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select Term</FormLabel>
              <FormSelect
                {...register("term")}
                name="term"
                value={strandFilter.term}
                onChange={(event) => handleTermChange(event)}
              >
                <option>Select Term</option>
                {terms.map((term: any, key) => (
                  <option key={key} value={term._id}>
                    {term.name}
                  </option>
                ))}
              </FormSelect>
              {errors.term && (
                <div className="mt-2 text-danger">
                  {typeof errors.term.message === "string" &&
                    errors.term.message}
                </div>
              )}
            </div> */}

            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
              {/* <Button
                variant="primary"
                className="mr-2 shadow-md"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(true);
                }}
              >
                New Strand
              </Button> */}

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
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
              </div>
            ) : strands.length === 0 ? (
              <div className="col-span-12 text-center items-center mt-10 bg-white p-8">
                {/* <Search size={28} className="" /> */}
                <p className="text-xl text-slate-500 ">No Strands found</p>
              </div>
            ) : (
              <>
                {strands.map((strand: any, key) => (
                  <div className="col-span-12 intro-y md:col-span-6">
                    <div
                      className="box"
                      onClick={(e: any) => openSubStrand(strand)}
                    >
                      <div className=" lg:flex lg:justify-between gap-4 p-5 min-h-[100px] ">
                        <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                          <div>
                            <img
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full w-20 h-20"
                              src={logo}
                            />
                          </div>
                          <div className="mt-3 ml-4 lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                            <h2 className="font-bold text-xl">
                              {strand?.name}
                            </h2>
                            <div className="text  mt-0.5">
                              Theme: {strand?.theme}
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-4 lg:mt-0 lg:justify-end justify-center">
                          <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">
                            View Substrands
                          </button>
                          {/* <button className="transition duration-200 border shadow-sm inline-flex items-center justify-center rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 dark:border-darkmode-100/40 dark:text-slate-300 [&amp;:hover:not(:disabled)]:bg-secondary/20 [&amp;:hover:not(:disabled)]:dark:bg-darkmode-100/10 px-2 py-1">Profile</button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
              </>
            )}

            {/* <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      No.
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Strand
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Theme
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Actions
                    </Table.Th>

                 
                
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {strands.map((strand: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                      onClick={(e: any) => openSubStrand(strand)}>
                        <span className="font-medium whitespace-nowrap">
                          {strand?.name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {strand?.theme}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]  flex justify-center">
                         <button className="w-1/2  px-3 py-4 bg-primary text-white rounded-md hover:bg-blue-600 "
                          onClick={(e: any) => openSubStrand(strand)}>
                            View Substrands....
                          </button>
                       </Table.Td>
                    
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div> */}
            {/* END: Data List */}
          </div>

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
