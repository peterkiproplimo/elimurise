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
import fakerData from "../../utils/faker";
import Tippy from "../../base-components/Tippy";
import logo from "../../assets/images/assess.jpeg";

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
  const [acadmic, setAcademic] = useState([]);
  const [year, setYear] = useState<any>({});
  const [nextYear, setNextYear] = useState<any>({});
  const [currentStream, setCurrentStream] = useState<any>({});
  const [nextStream, setNextStream] = useState<any>({});

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
  // const [selectedStrand, setSelectedStrand] = useState(
  //   state_strand?._id || "na"
  // );

  // const [strandFilter, setStrandFilter] = useState({
  //   grade: "na",
  //   learning_area: "na",
  //   term: "na",
  // });

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup.object().shape({
    year: yup.string().required("Current Academic Year is required"),
    nextYear: yup.string().required("Next Academic Year is required"),
    currentStream: yup.string().required("Current Stream is required"),
    nextStream: yup.string().required("Next Stream is required"),
  });

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
    getGrades();
    getAcademic();
    // getLevels();
  }, []);
  const getAcademic = async () => {
    const response = await ApiService.getAcademic({
      page: 1,
    });
    setAcademic(response.data);
  };

  const getGrades = async () => {
    const response = await ApiService.getStream({ page: 1 });

    setGrades(response.data);
  };

  const handleReset = () => {
    setYear("");
    setNextYear("");
    setCurrentStream("");
    setNextStream("");
    reset({
      year: "",
      stream: "",
      grade: "",
      learning_area: "",
    });
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteStrand(recordId);

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
    reset({ ...record, learning_area: record.learning_area._id });

    console.log(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };

  const handleTransition = async () => {
    try {
      const data = {
        currentAcademicYearId: year,
        nextAcademicYearId: nextYear,
        currentStreamId: currentStream,
        nextStreamId: nextStream,
      };

      isLoading(true);
      let res = await ApiService.leanersPromotion(data);
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
            <h2 className="mr-auto text-lg font-medium">New Strand</h2>
          </div>
          <br />
        </>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium intro-y flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Learner Enrollment
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">
                  Current Academic Year
                </FormLabel>
                <TomSelect
                  {...register("year")}
                  name="year"
                  value={year}
                  onChange={(event) => setYear(event)}
                >
                  <option>Current Academic Year</option>
                  {acadmic.map((year: any, key: any) => (
                    <option key={key} value={year._id}>
                      {year.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.year && (
                  <div className="mt-2 text-danger">
                    {typeof errors.year.message === "string" &&
                      errors.year.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Next Academic year</FormLabel>
                <TomSelect
                  {...register("stream")}
                  name="stream"
                  value={nextYear}
                  onChange={(event) => setNextYear(event)}
                >
                  <option>Next Academic Year</option>
                  {acadmic.map((year: any, key: any) => (
                    <option key={key} value={year._id}>
                      {year.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.nextYear && (
                  <div className="mt-2 text-danger">
                    {typeof errors.nextYear.message === "string" &&
                      errors.nextYear.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Current Grade</FormLabel>
                <TomSelect
                  {...register("grade")}
                  name="grade"
                  value={currentStream}
                  onChange={(event: any) => setCurrentStream(event)}
                >
                  <option>Current Grade</option>
                  {grades.map((grade: any, key) => (
                    <option key={key} value={grade._id}>
                      {grade?.grade?.name}
                      {grade?.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.currentStream && (
                  <div className="mt-2 text-danger">
                    {typeof errors.currentStream.message === "string" &&
                      errors.currentStream.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Next Grade </FormLabel>
                <TomSelect
                  {...register("learning_area")}
                  value={nextStream}
                  name="learning_area"
                  onChange={(event) => setNextStream(event)}
                >
                  <option>Next Grade</option>
                  {grades.map((grade: any, key) => (
                    <option key={key} value={grade._id}>
                      {grade?.grade?.name}
                      {grade?.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.nextStream && (
                  <div className="mt-2 text-danger">
                    {typeof errors.nextStream.message === "string" &&
                      errors.nextStream.message}
                  </div>
                )}
              </div>
            </div>
            <div className="flex mt-4  ">
              <Button
                variant="primary"
                type="submit"
                className="w-20"
                onClick={(e: any) => handleTransition()}
                // onClick={async () => {
                //   const result = await trigger();
                //   if (result) {
                //     handleTransition();
                //   }
                // }}
              >
                Save
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleReset}
                className="w-20 ml-4"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
            <Table className="border-spacing-y-[10px] border-separate -mt-2">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    <FormCheck.Input type="checkbox" />
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    LEARNER NAME
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    ADMISSION NUMBER
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    GENDER
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    NAMEIST NO.
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    SCORE
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {_.take(fakerData, 9).map((faker, fakerKey) => (
                  <Table.Tr key={fakerKey} className="intro-x">
                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <FormCheck.Input type="checkbox" />
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <div className="flex items-center">
                        <div className="w-9 h-9 image-fit zoom-in">
                          <Tippy
                            as="img"
                            alt="Midone - HTML Admin Template"
                            className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                            src={faker.images[0]}
                            content={`Uploaded at ${faker.dates[0]}`}
                          />
                        </div>
                        <div className="ml-4">
                          <a href="" className="font-medium whitespace-nowrap">
                            {faker.users[0].name}
                          </a>
                         
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <a
                        className="flex items-center justify-center underline decoration-dotted"
                        href="#"
                      >
                        {
                          ["Themeforest", "Codecanyon", "Graphicriver"][
                            _.random(0, 2)
                          ]
                        }
                      </a>
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {faker.users[0].gender}
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {faker.totals[0]} Items
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                      <div className="flex items-center justify-center">
                        <a className="flex items-center mr-3" href="#">
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                          Edit
                        </a>
                        <a className="flex items-center text-danger" href="#">
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                          Delete
                        </a>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div> */}

          {/* <div className="grid grid-cols-12 gap-6">
           

        
         
            <div className="col-span-12 intro-y md:col-span-6 cursor-pointer">
            
               <div className="box" >
                   <div className=" lg:flex lg:justify-between gap-4 p-5 min-h-[100px] ">
                     <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                     <div> 
                      <img alt="Midone Tailwind HTML Admin Template" className="rounded-full w-30 h-20" src={logo}/>
                      </div>
                    <div className="mt-3 ml-4 lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                        <h2 className="font-bold text-xl">Name:</h2>
                    <div className="text  mt-0.5">Adm No: </div>
               </div>
             </div>
             <div className=" mt-4 lg:mt-0 lg:justify-end justify-center">
              <h2 className="mb-2 text-xl font-bold">Score</h2>

                 <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">Assess Learner</button>
           </div>
             </div>
           </div>
          
          </div>
          <div className="col-span-12 intro-y md:col-span-6 cursor-pointer">
            
            <div className="box" >
                <div className=" lg:flex lg:justify-between gap-4 p-5 min-h-[100px] ">
                  <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                  <div> 
                   <img alt="Midone Tailwind HTML Admin Template" className="rounded-full p-0 w-30 h-20" src={logo}/>
                   </div>
                 <div className="mt-3 ml-4 lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                     <h2 className="font-bold text-xl">Name:</h2>
                 <div className="text  mt-0.5">Adm No: </div>
            </div>
          </div>
          <div className="flex mt-4 lg:mt-0 lg:justify-end justify-center">
              <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">Assess Learner</button>
              <button className="transition duration-200 border shadow-sm inline-flex items-center justify-center rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 dark:border-darkmode-100/40 dark:text-slate-300 [&amp;:hover:not(:disabled)]:bg-secondary/20 [&amp;:hover:not(:disabled)]:dark:bg-darkmode-100/10 px-5 py-1">Profile</button>
          </div>
          </div>
        </div>
       
       </div>
        
           
          
         

  



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
          </div> */}
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
