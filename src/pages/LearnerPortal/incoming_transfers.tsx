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
import { Loader } from "lucide-react";
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
import leanerImg from "../../assets/images/student.jpeg";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const deleteButtonRef = useRef(null);
  const approveButtonRef = useRef(null);
  const [approveDialog, setApproveDialog] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [learners, setLearners] = useState([]);

  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");

  const [tranfers, setTransfers] = useState([]);
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
  const [strandFilter, setStrandFilter] = useState({
    school: "na",
    grade: "na",
    stream: "na",
  });
  const [streams, setStreams] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parents, setParents] = useState(false);
  const [guardianIdNo, setGuardianIdNo] = useState("");
  const [guardianIdNo2, setGuardianIdNo2] = useState("");
  const [stream, setStream] = useState("");
  const [learner, setLearner] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [approveTranfer, setApproveTranfer] = useState<any>({
    id: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleNavigate = (learnerId: any) => {
    navigate(`/learner/${learnerId}`, {
      replace: true,
      state: { data: learnerId },
    });
  };

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      learnerId: yup.string().required("Learner is required"),
      newSchoolCode: yup.string().required("School Code is required"),
      reason: yup.string().required("Reason is required"),
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

  const approveTranferSubmit = async () => {
    if (!loading) {
      isLoading(true);
      try {
        const data = await getValues();
        const res = await ApiService.payForTransfer(approveTranfer);
        setPaymentUrl(res.redirect_url);

        await getTransfers();
        await reset({ name: "" });
        isLoading(false);
        setApproveDialog(false);
        setSuccess(true);
        // setMessage("Transfer Approved successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the learner."
        );
        notify.current?.showToast();
      }
    }
  };
  // const getGrades = async () => {
  //   const response = await ApiService.getGrades({ page: 1 });

  //   setGrades(response.data);
  // };
  // useEffect(() => {
  //   getGrades();
  //   getParents();
  // }, []);
  // useEffect(() => {
  //   getStreams();
  // }, [grade]);
  // useEffect(() => {
  //   getStudents();
  // }, [strandFilter]);
  useEffect(() => {
    getTransfers();
  }, [search, page, limit]);

  const getTransfers = async () => {
    isLoading(true);
    const response = await ApiService.getLearnersTransfers({
      page: page,
      limit: limit,
    });
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setTransfers(response.data);
    isLoading(false);
  };
  const getParents = async () => {
    const response = await ApiService.getLearners(
      {
        page: 1,
      },
      {}
    );
    setParents(response.data);
  };
  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    setStreams(response.data);
    console.log(response);
  };

  const getAcademics = async () => {
    const response = await ApiService.getAcademic({
      page: 1,
    });
    setAcademic(response.data);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteLearner(recordId);
      getTransfers();
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Learner record deleted successfully");
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
    setPhoto(record.learner.photo);

    console.log(record);
    setDialog(true);
  };
  const handleGuardianIdNoBlur = async () => {
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: "",
      guardian_first_name: "",
      guardian_email: "",
      guardian_last_name: "",
      guardian_surname: "",
      guardian_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo });
    const response = res.data;
    console.log(response._id);
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: response._id,
      guardian_first_name: response.first_name,
      guardian_email: response.email,
      guardian_last_name: response.last_name,
      guardian_surname: response.surname,
      guardian_phone: response.phone,
    });
  };
  const handleGuardianIdNoBlur2 = async () => {
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: "",
      guardian2_first_name: "",
      guardian2_email: "",
      guardian2_last_name: "",
      guardian2_surname: "",
      guardian2_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo2 });
    const response = res.data;
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: response._id,
      guardian2_first_name: response.first_name,
      guardian2_email: response.email,
      guardian2_last_name: response.last_name,
      guardian2_surname: response.surname,
      guardian2_phone: response.phone,
    });
  };
  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };
  const getStudents = async () => {
    isLoading(true);
    const response = await ApiService.getEnrolments(
      {
        page: 1,
        ...strandFilter,
      },
      {}
    );
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setEnrollments(response.data);
    isLoading(false);
  };

  const [rows, setRows] = useState<TableRow[]>([
    { no: 1, strandName: "Example Strand" },
  ]);

  const addRow = () => {
    const newRow: TableRow = {
      no: rows.length + 1,
      strandName: "New Strand",
    };

    setRows([...rows, newRow]);
  };
  return (
    <>
      {paymentUrl ? (
        <>
          {" "}
          <div className="flex h-screen">
            {/* Left Panel: Explanation */}
            <div className="flex-none w-1/3 bg-gray-100 p-6 border-r border-gray-300">
              <h2 className="text-2xl font-semibold text-gray-700">
                Complete Your Learner's Transfer Payment
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                This payment is required to complete the transfer of your
                learner from their current school to a new institution. The
                payment covers the system fee associated with processing the
                transfer and ensuring a seamless transition. Please review the
                details carefully and proceed with the payment securely through
                the gateway below.
              </p>
            </div>

            {/* Right Panel: Payment processing and iframe */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              {/* Processing State */}
              {loading && (
                <div className="text-center font-semibold text-xl text-gray-700">
                  {paymentUrl
                    ? "Processing, Please Wait..."
                    : "Initiating payment..."}
                </div>
              )}

              {/* Loading Animation */}
              {loading && !paymentUrl && (
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    className="w-16 h-16 animate-spin text-blue-600"
                  >
                    <circle
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      r="20"
                      cx="100"
                      cy="100"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        values="0, 150; 150, 150; 0, 150"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              )}

              {/* Payment URL Iframe */}
              {paymentUrl && !loading && (
                <div className="flex justify-center">
                  <iframe
                    width="860"
                    height="600"
                    src={paymentUrl}
                    className="border-none"
                    onLoad={() => isLoading(false)}
                    title="Payment iframe"
                  />
                </div>
              )}

              {/* Error or additional state (optional) */}
              {!paymentUrl && !loading && (
                <div className="text-center font-semibold text-lg text-gray-500">
                  No payment URL available.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium ">Transfers</h2>
          {message && success && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lucide icon="CheckCircle" className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Success
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{message}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Lucide icon="AlertTriangle" className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Transfer Request Pending
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your transfer request is currently being reviewed by the school administration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
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

          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-x-auto overflow-y-visible 2xl:overflow-visible">
              <Table hover striped className="mt-6">
                <Table.Thead variant="modern">
                  <Table.Tr>
                    <Table.Th className="w-16 text-center">
                      #
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Student Name</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>From School</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>From Grade</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>From Stream</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>To Grade</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>To Stream</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Status</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="text-center w-32">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {tranfers.map((transfer: any, key: number) => (
                    <Table.Tr key={key}>
                      <Table.Td className="text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {limit * (page - 1) + key + 1}
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                            <img
                              src={transfer?.learner?.photo ? `${C.IMG_URL}${transfer.learner.photo}` : leanerImg}
                              alt="Student"
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.src = leanerImg)}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {transfer?.learner?.first_name} {transfer?.learner?.surname} {transfer?.learner?.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ID: {transfer?.learner?._id?.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {transfer?.from_school?.name || "N/A"}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {transfer?.from_grade?.name || "N/A"}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            {transfer?.from_stream?.name || "N/A"}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {transfer?.to_grade?.name || "N/A"}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-orange-700 dark:text-orange-300">
                            {transfer?.to_stream?.name || "N/A"}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          transfer?.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : transfer?.status === "approved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            transfer?.status === "pending"
                              ? "bg-yellow-500"
                              : transfer?.status === "approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}></div>
                          {transfer?.status?.charAt(0).toUpperCase() + transfer?.status?.slice(1) || "Unknown"}
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className="flex items-center justify-center space-x-2">
                            <a
                              className="flex items-center mr-3 text-primary"
                              href="#"
                              onClick={() => {
                                setApproveTranfer({
                                  id: transfer?._id,
                                });
                                setApproveDialog(true);
                              }}
                            >
                              <Lucide
                                icon="CheckSquare"
                                className="w-4 h-4 mr-1"
                              />{" "}
                              Approve
                            </a>
                            <a
                              className="flex items-center text-primary"
                              onClick={(e: any) => handleNavigate(transfer?.learner?._id)}
                            >
                              <Lucide icon="Eye" className="w-4 h-4 mr-1" /> View More
                            </a>

                            {/* Uncomment the following block if you want to enable the delete action */}
                            {/* <a
              className="flex items-center text-danger"
              href="#"
              onClick={() => {
                setRecordId(learner.learner._id),
                setConfirmDelete(true);
              }}
            >
              <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
            </a> */}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

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
              open={viewMore}
              onClose={() => {
                setViewMore(false);
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
                      setViewMore(false);
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
                  ></Button>
                </div>
              </Dialog.Panel>
            </Dialog>
            <Dialog
              open={approveDialog}
              onClose={() => {
                setApproveDialog(false);
              }}
              initialFocus={approveButtonRef}
            >
              <Dialog.Panel>
                <div className="p-5 text-center">
                  {/* <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                /> */}
                <div className="mt-5 text-center font-medium">
                  Incoming Tranfer
                </div>
                <div className="mt-2 text-slate-500">
                  You need to pay convinience fee of{" "}
                  <FormLabel htmlFor="modal-form-6">Ksh 250</FormLabel> to
                  Complete the process
                </div>
                <div className="col-span-4 sm:col-span-4"></div>
              </div>
              <div className="px-5 pb-8 text-center">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setApproveDialog(false);
                  }}
                  className="w-24 mr-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => approveTranferSubmit()}
                  variant="success"
                  type="button"
                  className="w-44 ml-4 text-white"
                  ref={approveButtonRef}
                >
                  Intiate Payment{" "}
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
