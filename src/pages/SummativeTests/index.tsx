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
import { Search } from "lucide-react";
import TomSelect from "../../base-components/TomSelect";
import { formatDate } from "../../utils/helper";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [gradeId, setGradeId] = useState("");
  const [grade, setGrade] = useState("");

  const [tests, setTests] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [academic_terms, setTerms] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [gradings, setGradings] = useState([]);
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
      name: yup.string().required("Name is required"),
      grading: yup.string().required("Select Performance Level Scale"),
      term: yup.string().required("Select Term"),
      grade: yup.string().required("Select Grade"),
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

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log(data);
        await ApiService.createTests(data);
        await getTests();
        cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Test created successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        console.log(error.message);
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        console.log(success);
        console.log(message);
        notify.current?.showToast();
      }
    }
  };
  useEffect(() => {
    getTests();
  }, []);
  useEffect(() => {
    fetchGrading();
  }, [search, limit, page]);
  useEffect(() => {
    getGrades();
    getTerms();
  }, [search, page, limit]);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
  };
  const getTerms = async () => {
    const response = await ApiService.getTerm({});
    setTerms(response.data);
  };

  const getTests = async () => {
    isLoading(true);
    const response = await ApiService.getTests({ page: 1 });
    setTests(response.data);
    isLoading(false);
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
    setGradings(res.data);
    console.log(gradings);
    isLoading(false);
  };

  // const getGrades = async () => {
  //   const response = await ApiService.getGrades({
  //     page: page,
  //     search: search,
  //     limit: limit,
  //   });
  //   const pagination = response.pagination;
  //   setPagination({
  //     current_page: pagination.current_page,
  //     total: pagination.total,
  //     total_pages: pagination.total_pages,
  //     per_page: pagination.per_page,
  //   });
  //   setGrades(response.data);
  // };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteTests(recordId);
      getTests();
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
    setSelectedTerm(record?.term?._id);
    setGradeId(record.grading._id);
    setGrade(record.grade._id);
    reset({
      ...record,
      grade: record.grade._id,
      grading: record.grading._id,
      academicYear: record.academicYear._id,
      term: record?.term?._id,
    });
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setSelectedTerm("");
    setGradeId("");
    setGrade("");

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
            <h2 className="mr-auto text-lg font-medium">
              {isEditMode ? "Edit Test" : "New Test"}
            </h2>
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
            </div>{" "}
            <div className="grid grid-cols-12 gap-6 ">
              <div className="col-span-6 sm:col-span-6 py-2">
                <FormLabel className="modal-form-6">
                  Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("name")}
                  type="text"
                  name="name"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="Summative Test"
                />
                {errors.name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.name.message === "string" &&
                      errors.name.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6 py-2">
                <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  onChange={(event: any) => setGrade(event.target.value)}
                  // defaultValue={selectedLevel}
                >
                  <option value={""}>Select Grade</option>
                  {grades.map((grade: any, key: any) => (
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
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 ">
              <div className="col-span-6 sm:col-span-6 py-2">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <FormSelect
                  {...register("term")}
                  name="term"
                  value={selectedTerm}
                  onChange={(event: any) => setSelectedTerm(event.target.value)}
                >
                  <option value={""}>Select Academic Term</option>

                  {academic_terms.map((term: any, key) => (
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
              </div>

              <div className="col-span-6 sm:col-span-6">
                <div className="col-span-4 sm:col-span-12 py-2">
                  <FormLabel className="modal-form-6">
                    Performance Level Scale
                    <span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <TomSelect
                    onChange={(data: any) => {
                      setGradeId(data);
                      reset({ ...getValues(), grading: data });
                    }}
                    value={gradeId}
                  >
                    <option value={""}>Select Scale</option>
                    {gradings
                      .filter((grading: any) => grading.grade._id === grade)
                      .map((grading: any, key) => (
                        <option key={key} value={grading._id}>
                          {grading.name} ({grading.grade.name})
                        </option>
                      ))}
                  </TomSelect>
                  {errors.grading && (
                    <div className="mt-2 text-danger">
                      {typeof errors.grading.message === "string" &&
                        errors.grading.message}
                    </div>
                  )}
                </div>
              </div>
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
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium intro-y">Summative Tests</h2>
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
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
              <Button
                variant="primary"
                className="mr-2 shadow-md"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(true);
                }}
              >
                New Test
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
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : tests.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  {/* <Search size={28} className="" /> */}
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
                  {" "}
                  <Table className="border-spacing-y-[3px] border-separate -mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          NO.
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Type
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Term
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Grade
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Scale
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Created At
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap text-center">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {tests.map((test: any, key) => (
                        <Table.Tr key={key} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.term ? "Custom" : "Hero Assessment"}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.term?.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.grade?.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.grading?.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {new Date(test.grade.createdAt).toLocaleString(
                                "en-US",
                                {
                                  timeZone: "Africa/Nairobi", // Set to the Kenyan time zone
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                              <a
                                className="flex items-center mr-3 text-success"
                                href="#"
                                onClick={() => editRecord(test)}
                              >
                                <Lucide
                                  icon="CheckSquare"
                                  className="w-4 h-4 mr-1 "
                                />{" "}
                                Edit
                              </a>
                              <a
                                className="flex items-center text-danger"
                                href="#"
                                onClick={() => {
                                  setRecordId(test._id), setConfirmDelete(true);
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
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
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
        </>
      )}
      {/* <Notification
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
          <div className="font-medium">{success ? " Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification> */}
    </>
  );
}

export default Main;
