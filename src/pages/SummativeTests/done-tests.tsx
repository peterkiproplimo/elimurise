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
import ProgressBar from "../AssessLearner/ProgressBar";
import { useNavigate } from "react-router-dom";

function Main(props: any) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [gradeId, setGradeId] = useState("");
  const [grade, setGrade] = useState("");

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
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("");

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

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log(data);
        const res = await ApiService.createTests(data);
        await getTests();
        cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(res.message);
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
    const response = await ApiService.getTestsDone(props.data);
    setTests(response.data);
    setSubjects(response.subjects);
    const pagination = response?.pagination;
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
  const generateAssessment = async () => {
    isLoading(true);
    let data = {};
    if (props.data.stream == "") {
      data = {
        test: props.data.test,
        term: props.data.term,
        type: "grade",
        grade: props.data.grade,
      };
    } else {
      data = {
        test: props.data.test,
        term: props.data.term,
        type: "stream",
        stream: props.data.stream,
      };
    }

    isLoading(true);
    try {
      let res = await ApiService.getSummativeByLearners(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=yes`
      );

      setPdfUrl(url);
      // setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  return (
    <>
      {dialog ? (
        <></>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium ">
            <div className="flex items-center mt-8 ">
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  props.setDisplayResults(false);
                }}
                href="#"
              >
                <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
              </a>
              <h2 className="mr-auto text-lg font-medium">
                Assessment Records
              </h2>
            </div>
          </h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto 2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : tests.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  <p className="text-xl text-slate-500">No records found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-12 gap-6 ">
                    <div className="flex flex-wrap items-center col-span-12 xl:flex-nowrap">
                      <div className="hidden mx-auto md:block text-slate-500"></div>

                      <div className="flex items-right w-full mt-3 xl:w-auto xl:mt-0 pb-2">
                        <Button
                          variant="primary" // A variant that stands out more for export
                          className="mr-2 shadow-md px-6 py-2.5 bg-primary text-white border border-blue-600 rounded-md hover:bg-blue hover:border-blue focus:ring-2 focus:ring-blue-500"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            generateAssessment();
                          }}
                        >
                          <i className="mr-2 fas fa-download"></i>{" "}
                          {/* Icon for the export functionality */}
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Table
                    id="table"
                    className="border-separate border-spacing-y-[3px] w-full -mt-2"
                  >
                    <Table.Thead className="bg-gray-100">
                      <Table.Tr>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          #
                        </Table.Th>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          ADM NO
                        </Table.Th>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          Stream
                        </Table.Th>
                        {subjects?.map((subject, index) => (
                          <Table.Th
                            key={index}
                            className="border-b-2 text-left py-2 px-4"
                          >
                            {subject}
                          </Table.Th>
                        ))}
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          Total
                        </Table.Th>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          AVG
                        </Table.Th>
                        <Table.Th className="border-b-2 text-left py-2 px-4">
                          POS
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody className="bg-white">
                      {tests.map((test: any, key: any) => (
                        <Table.Tr key={key} className="border-t">
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {limit * (page - 1) + key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {test.learner.adm_no}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {test.learner.first_name} {test.learner.last_name}{" "}
                              {test.learner.surname}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {test.stream?.name}
                            </span>
                          </Table.Td>
                          {subjects?.map((subject) => (
                            <Table.Td
                              key={subject}
                              className="py-2 px-4 text-left"
                            >
                              <span className="font-medium">
                                {test.assessments?.[subject] !== undefined
                                  ? test.assessments[subject]
                                  : "-"}
                              </span>
                            </Table.Td>
                          ))}
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {test.totalScore}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">
                              {test.averageScore}
                            </span>
                          </Table.Td>
                          <Table.Td className="py-2 px-4 text-left">
                            <span className="font-medium">{test.rank}</span>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
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
          {/* BEGIN: Delete Confirmation Modal s*/}
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
          <div className="font-medium">{success ? " Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
