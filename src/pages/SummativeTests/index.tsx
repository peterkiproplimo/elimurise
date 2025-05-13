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
import SummativeDone from "./done-tests";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [gradeId, setGradeId] = useState("");
  const [grade, setGrade] = useState("");
  const [dialogView, setDialogView] = useState(false);
  const [streams, setStreams] = useState([]);
  const [stream, setStream] = useState("");
  const [term, setTerm] = useState("");
  const [grade_data, setGradeData] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [publish, setPublish] = useState(false);
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  const [type, setType] = useState("");
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
      type: yup.string().required("Type is required"),
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

  const getStreams = async (selectedValue: any) => {
    setStreams([]);
    const response = await ApiService.getStream({
      page: 1,
      grade: selectedValue,
    });
    setStreams(response.data);
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        const res = await ApiService.createTests(data);
        await getTests();
        cancel({ name: "" });
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

  useEffect(() => {
    getTests();
  }, [grade, selectedTerm, type, search, limit, page]);

  useEffect(() => {
    fetchGrading();
  }, []);

  useEffect(() => {
    getGrades();
  }, []);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
  };

  const getTests = async () => {
    isLoading(true);
    const response = await ApiService.getTests({
      page: page,
      type,
      search,
      term: selectedTerm,
      grade,
      limit,
    });
    setTests(response.data);
    const pagination = response.pagination;
    setPagination({
      current_page: pagination?.current_page,
      total: pagination?.total,
      total_pages: pagination?.total_pages,
      per_page: pagination?.per_page,
    });
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
    setGradings(res.data);
    isLoading(false);
  };

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

  const publishRecord = async (test: any) => {
    isLoading(true);
    try {
      console.log(test);
      let res = await ApiService.publishTest(test._id, test.isPublished);
      getTests();
      isLoading(false);
      setSuccess(true);
      setMessage(res.message || "Test published successfully");
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
    setGradeId(record?.grading?._id);
    setGrade(record?.grade?._id);
    reset({
      ...record,
      grade: record.grade._id,
      grading: record.grading._id,
      academicYear: record.session._id,
      term: record?.term,
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
      {displayResults ? (
        <SummativeDone
          data={{ stream: stream, test: recordId, grade: grade_data, term }}
          setDisplayResults={setDisplayResults}
        />
      ) : dialog ? (
        <>
          <div className="flex items-center mt-8 ">
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
          <form className="mt-5 p-5  box validate-form" onSubmit={onSubmit}>
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
              <div className="col-span-6 sm:col-span-4 py-2">
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
              <div className="col-span-6 sm:col-span-4 py-2">
                <FormLabel htmlFor="modal-form-6">Type</FormLabel>
                <FormSelect {...register("type")} name="type">
                  <option value={""}>Select Type</option>
                  <option value={"Tunner"}>Tunner-Up</option>
                  <option value={"Mid Term"}>Miderm</option>
                  <option value={"End of the Term"}>End of the Term</option>
                </FormSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-4 py-2">
                <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  onChange={(event: any) => setGrade(event.target.value)}
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
              <div className="col-span-6 sm:col-span-4 py-2">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <FormSelect
                  {...register("term")}
                  name="term"
                  value={selectedTerm}
                  onChange={(event: any) => setSelectedTerm(event.target.value)}
                >
                  <option value={""}>Select Academic Term</option>
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
              </div>
              <div className="col-span-6 sm:col-span-4">
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
          <h2 className="mt-1 text-lg font-medium ">Summative Tests</h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
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
                    onChange={(e) => {
                      setPage(1);
                      setSearch(e.target.value);
                    }}
                  />
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end col-span-12 mt-2 xl:flex-nowrap ">
              <TomSelect
                className="w-56 box mr-3"
                value={grade}
                onChange={(event: any) => {
                  setPage(1);
                  setGrade(event);
                  setSelectedTerm("");
                  setType("");
                }}
              >
                <option value={""}>All Grades</option>
                {grades.map((grade: any, key: any) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </TomSelect>
              <TomSelect
                className="w-56 box mr-3"
                name="stream"
                value={selectedTerm}
                onChange={(event: any) => {
                  setPage(1);
                  setSelectedTerm(event);
                  setType("");
                }}
              >
                <option value={""} selected>
                  All Terms
                </option>
                {terms.map((term: any, key) => (
                  <option key={key} value={term._id}>
                    {term.name}
                  </option>
                ))}
              </TomSelect>
              <TomSelect
                className="w-56 box"
                name="type"
                value={type}
                onChange={(event: any) => {
                  setPage(1);
                  setType(event);
                }}
              >
                <option value={""} selected>
                  All Types
                </option>
                <option value={"Tunner"}>Tunner-Up</option>
                <option value={"Mid Term"}>Miderm</option>
                <option value={"End of the Term"}>End of the Term</option>
              </TomSelect>
            </div>
            <div className="col-span-12 overflow-auto  2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : tests.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
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
                          Session
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Published
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
                        <Table.Tr key={key} className="">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {limit * (page - 1) + key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td
                            onClick={(e: any) => {
                              setRecordId(test._id);
                              setGradeData(test.grade._id);
                              getStreams(test?.grade);
                              setDialogView(true);
                              setTerm(test.term);
                            }}
                            className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] cursor-pointer "
                          >
                            <span className="font-medium whitespace-nowrap">
                              <a
                                onClick={(event: any) => event.preventDefault()}
                              >
                                {test.name}
                              </a>
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.type}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {test?.term}
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
                              {test?.session}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white dark:bg-darkmode-600 px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center w-full font-medium">
                              {test?.isPublished ? (
                                <Lucide
                                  icon="CheckCircle"
                                  className="w-5 h-5 text-green-500"
                                />
                              ) : (
                                <Lucide
                                  icon="AlertCircle"
                                  className="w-5 h-5 text-red-500"
                                />
                              )}
                            </span>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span className="font-medium whitespace-nowrap">
                              {new Date(test.grade.createdAt).toLocaleString(
                                "en-US",
                                {
                                  timeZone: "Africa/Nairobi",
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
                                onClick={() => {
                                  setRecordId(test._id);
                                  setGradeData(test.grade._id);
                                  getStreams(test?.grade);
                                  setDialogView(true);
                                  setTerm(test.term);
                                }}
                              >
                                <Lucide icon="View" className="w-4 h-4 mr-1 " />{" "}
                                View
                              </a>
                              {test?.school && (
                                <>
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
                                    className="flex items-center mr-3 text-primary"
                                    href="#"
                                    onClick={() => publishRecord(test)}
                                  >
                                    <Lucide
                                      icon="Send"
                                      className="w-4 h-4 mr-1"
                                    />{" "}
                                    Publish
                                  </a>
                                  <a
                                    className="flex items-center text-danger"
                                    href="#"
                                    onClick={() => {
                                      setRecordId(test._id);
                                      setConfirmDelete(true);
                                    }}
                                  >
                                    <Lucide
                                      icon="Trash2"
                                      className="w-4 h-4 mr-1"
                                    />{" "}
                                    Delete
                                  </a>
                                </>
                              )}
                            </div>
                          </Table.Td>
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
                          value={limit}
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
          </div>
          <Dialog
            staticBackdrop
            size="lg"
            open={dialogView}
            onClose={() => {
              setDialogView(false);
            }}
          >
            <Dialog.Panel className={"p-5"}>
              <div className="col-span-12 sm:col-span-4 mt-2">
                <FormLabel htmlFor="stream">
                  Select Stream<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormSelect
                  id="stream"
                  {...register("stream")}
                  name="stream"
                  onChange={(e: any) => setStream(e.target.value)}
                >
                  <option value="" selected>
                    All
                  </option>
                  {streams.map((stream: any, key) => (
                    <option key={key} value={stream._id}>
                      {stream.name}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div className="col-span-12 mt-4 text-right">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setDialogView(false);
                  }}
                  className="w-24 mr-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setDisplayResults(true)}
                  variant="success"
                  type="submit"
                  className="w-24 ml-4 text-white"
                >
                  View
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
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
          <div className="font-medium">{success ? " Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
