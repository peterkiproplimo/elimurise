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
import { useAuth } from "../../contexts/Auth";

interface TableRow {
  no: number;
  strandName: string;
}
interface Learner {
  first_name: string;
  // Add other properties if needed
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const auth = useAuth();
  const learner = auth?.authData?.user as Learner;
  useEffect(() => {
    reset({ ...learner });
  }, [auth]);
  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [learners, setLearners] = useState([{}]);
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

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("Firstname is required"),
      last_name: yup.string().required("Lastname is required"),
      surname: yup.string().required("Surname is required"),
      // adm_no: yup.string().required("Adm.No is required"),
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

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        await ApiService.createLearner(data);
        await getStudents();
        await reset({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Learner added successfully.");
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
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  useEffect(() => {
    getGrades();
    const learner = JSON.parse(localStorage.getItem("learner") || "");
    reset({
      ...learner.learner,
      stream: learner?.stream?._id,
      grade: learner?.stream?.grade?._id,
      guardian_id_no: learner?.learner?.guardian?.id_no,
      guardian: learner?.learner?.guardian?._id,
      guardian_first_name: learner?.learner?.guardian?.first_name,
      guardian_email: learner?.learner?.guardian?.email,
      guardian_last_name: learner?.learner?.guardian?.last_name,
      guardian_surname: learner?.learner?.guardian?.surname,
      guardian_phone: learner?.learner?.guardian?.phone,
      guardian2_id_no: learner?.learner?.guardian2?.id_no,
      guardian2: learner?.learner?.guardian2?._id,
      guardian2_first_name: learner?.learner?.guardian2?.first_name,
      guardian2_email: learner?.learner?.guardian2?.email,
      guardian2_last_name: learner?.learner?.guardian2?.last_name,
      guardian2_surname: learner?.learner?.guardian2?.surname,
      guardian2_phone: learner?.learner?.guardian2?.phone,
    });
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit]);

  const getStudents = async () => {
    const response = await ApiService.getLearners(
      {
        page: page,
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
    setLearners(response.data);
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
      setConfirmDelete(false);
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
    reset({ ...record, stream: record?.stream?._id });
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
          {isEditMode ? "Edit Learner" : "New Learner"}
        </h2>
      </div>
      <br />
      <form className="mt-5 p-5 intro-y box validate-form" onSubmit={onSubmit}>
        <div>
          <a
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              setDialog(false);
            }}
            className="absolute top-0 right-0 mt-3 mr-3"
            href="#"
          ></a>
        </div>
        <fieldset className="mt-5 p-5 intro-y box validate-form">
          <legend className="text-lg font-semibold">Learner Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                First Name<span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("first_name")}
                type="text"
                name="first_name"
                className={errors.first_name ? "border-danger" : ""}
                placeholder="first name"
              />
              {errors.first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.first_name.message === "string" &&
                    errors.first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Last Name<span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("last_name")}
                type="text"
                name="last_name"
                className={errors.last_name ? "border-danger" : ""}
                placeholder="last name"
              />
              {errors.last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.last_name.message === "string" &&
                    errors.last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Surname</FormLabel>
              <FormInput
                disabled
                {...register("surname")}
                type="text"
                name="surname"
                className={errors.surname ? "border-danger" : ""}
                placeholder="surname"
              />
              {errors.surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.surname.message === "string" &&
                    errors.surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Admission Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("adm_no")}
                type="text"
                name="adm_no"
                className={errors.adm_no ? "border-danger" : ""}
                placeholder="admission no"
              />
              {errors.adm_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.adm_no.message === "string" &&
                    errors.adm_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Nemis No</FormLabel>
              <FormInput
                disabled
                {...register("nemis_no")}
                type="text"
                name="nemis_no"
                className={errors.nemis_no ? "border-danger" : ""}
                placeholder="nemis no"
              />
              {errors.nemis_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.nemis_no.message === "string" &&
                    errors.nemis_no.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-5 p-5 intro-y box validate-form">
          <legend className="text-lg font-semibold">Guardian Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian First Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_first_name")}
                type="text"
                name="guardian_first_name"
                className={errors.guardian_first_name ? "border-danger" : ""}
                placeholder="guardian first name"
              />
              {errors.guardian_first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_first_name.message === "string" &&
                    errors.guardian_first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Surname</FormLabel>
              <FormInput
                disabled
                {...register("guardian_surname")}
                type="text"
                name="guardian_surname"
                className={errors.guardian_surname ? "border-danger" : ""}
                placeholder="guardian surname"
              />
              {errors.guardian_surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_surname.message === "string" &&
                    errors.guardian_surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian Last Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_last_name")}
                type="text"
                name="guardian_last_name"
                className={errors.guardian_last_name ? "border-danger" : ""}
                placeholder="guardian last name"
              />
              {errors.guardian_last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_last_name.message === "string" &&
                    errors.guardian_last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian ID Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_id_no")}
                type="text"
                name="guardian_id_no"
                className={errors.guardian_id_no ? "border-danger" : ""}
                placeholder="guardian ID number"
              />
              {errors.guardian_id_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_id_no.message === "string" &&
                    errors.guardian_id_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Email</FormLabel>
              <FormInput
                disabled
                {...register("guardian_email")}
                type="email"
                name="guardian_email"
                className={errors.guardian_email ? "border-danger" : ""}
                placeholder="guardian email"
              />
              {errors.guardian_email && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_email.message === "string" &&
                    errors.guardian_email.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Phone</FormLabel>
              <FormInput
                disabled
                {...register("guardian_phone")}
                type="text"
                name="guardian_phone"
                className={errors.guardian_phone ? "border-danger" : ""}
                placeholder="guardian phone"
              />
              {errors.guardian_phone && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_phone.message === "string" &&
                    errors.guardian_phone.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-5 p-5 intro-y box validate-form">
          <legend className="text-lg font-semibold">Guardian 2 Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian First Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_first_name")}
                type="text"
                name="guardian2_first_name"
                className={errors.guardian2_first_name ? "border-danger" : ""}
                placeholder="Second guardian first name"
                disabled
              />
              {errors.guardian2_first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_first_name.message === "string" &&
                    errors.guardian2_first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Surname</FormLabel>
              <FormInput
                {...register("guardian2_surname")}
                type="text"
                name="guardian2_surname"
                className={errors.guardian2_surname ? "border-danger" : ""}
                placeholder="Second guardian surname"
                disabled
              />
              {errors.guardian2_surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_surname.message === "string" &&
                    errors.guardian2_surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian Last Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_last_name")}
                type="text"
                name="guardian2_last_name"
                className={errors.guardian2_last_name ? "border-danger" : ""}
                placeholder="Second guardian last name"
                disabled
              />
              {errors.guardian2_last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_last_name.message === "string" &&
                    errors.guardian2_last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian ID Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_id_no")}
                type="text"
                name="guardian2_id_no"
                className={errors.guardian2_id_no ? "border-danger" : ""}
                placeholder="Second guardian ID number"
                disabled
              />
              {errors.guardian2_id_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_id_no.message === "string" &&
                    errors.guardian2_id_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Email</FormLabel>
              <FormInput
                {...register("guardian2_email")}
                type="email"
                name="guardian2_email"
                className={errors.guardian2_email ? "border-danger" : ""}
                placeholder="Second guardian email"
                disabled
              />
              {errors.guardian2_email && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_email.message === "string" &&
                    errors.guardian2_email.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Phone</FormLabel>
              <FormInput
                {...register("guardian2_phone")}
                type="text"
                name="guardian2_phone"
                className={errors.guardian2_phone ? "border-danger" : ""}
                placeholder="Second guardian phone"
                disabled
              />
              {errors.guardian2_phone && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_phone.message === "string" &&
                    errors.guardian2_phone.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export default Main;
