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
import { useLocation } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Search } from "lucide-react";
import TomSelect from "../../base-components/TomSelect";
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [learners, setLearners] = useState([]);
  const location = useLocation();
  const learnerId = location?.state?.data;
  console.log(learnerId);
  const initialState = {
    learner: learnerId?.learner?._id || "na",
  };
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
  const [strandFilter, updateStrandFilter] = useState(() => {
    const savedState = localStorage.getItem("strandFilter");
    return initialState;
  });
  const [streams, setStreams] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("Firstname is required"),
      last_name: yup.string().required("Lastname is required"),
      surname: yup.string().required("Surname is required"),
      adm_no: yup.string().required("Adm.No is required"),
      grade: yup.string().required("Grade is required"),
      stream: yup.string().required("Stream is required"),
      guardian_first_name: yup.string().required("Firstname is required"),
      guardian_last_name: yup.string().required("Lastname is required"),
      guardian_id_no: yup.string().required("ID Number is required"),
      guardian_email: yup.string().required("Email is required"),
      guardian_phone: yup.string().required("Phone Number is required"),
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

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  useEffect(() => {
    getGrades();
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [strandFilter, search, page, limit]);

  const getStudents = async () => {
    isLoading(true);
    const response = await ApiService.getEnrolments(
      {
        page: 1,
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
    setLearners(response.data);
    isLoading(false);
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
      getStudents();
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
    reset({
      ...record.learner,
      stream: record?.stream?._id,
      grade: record?.stream?.grade?._id,
    });
    console.log(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset({ name: "" });
    setDialog(false);
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
      <h2 className="mt-1 text-lg font-medium ">Learners</h2>

      <Table className="border-spacing-y-[3px] border-separate mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian First Name
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian Last Name
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian Surname
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian ID No
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian Email
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap w-20">
              Guardian Phone
            </Table.Th>
            <Table.Th className="border-b-0 whitespace-nowrap text-center w-20">
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {learners.map((learner: any, key) => (
            <Table.Tr key={key} className="">
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_first_name}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_last_name}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_surname}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_id_no}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_email}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                <span className="font-medium whitespace-nowrap">
                  {learner?.learner?.guardian_phone}
                </span>
              </Table.Td>
              <Table.Td className="first:rounded-l-md last:rounded-r-md w-20 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                <div className="flex items-center justify-center">
                  <a
                    className="flex items-center mr-3 text-success"
                    href="#"
                    onClick={() => editRecord(learner)}
                  >
                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                  </a>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}

export default Main;
