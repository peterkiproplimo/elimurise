import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import PassportUpload from "./profilephoto";
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
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import TomSelect from "../../base-components/TomSelect";
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";
import Dropzone from "dropzone";
import Tippy from "../../base-components/Tippy";
import * as c from "../../utils/constants";
import leanerImg from "../../assets/images/learner.jpeg";
import { formatDate, is_admin } from "../../utils/helper";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [test, setTest] = useState("");
  const [tests, setTests] = useState<any>([]);

  const [learner_grades, setLearnerGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportDialog, setExportDialog] = useState(false);

  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");
  const [profile, setProfile] = useState(false);
  const [learner, setLearner] = useState<any>({});
  const [learners, setLearners] = useState([]);
  const [stream, setStream] = useState("");
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
  const [pdfUrl, setPdfUrl] = useState("");

  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedLeaningArea, setSelectedLearningArea] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [streams, setStreams] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parents, setParents] = useState([]);
  const [guardianIdNo, setGuardianIdNo] = useState("");
  const [guardianIdNo2, setGuardianIdNo2] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info
  const [learningAreas, setLearningAreas] = useState([]);
  const location = useLocation();

  const handleNavigate = (learnerId: any) => {
    navigate(`/learner/${learnerId}`, {
      replace: true,
      state: { data: learnerId },
    });
  };
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  const getLeanerClasses = async (learner: any) => {
    const response = await ApiService.learnerHistory(learner);
    setLearnerGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLeanerLeaningAreaAdmin({
      term: selectedTerm,
      learner: learner._id,
      session: selectedAcademicYear,
    });
    setLearningAreas(response.data);
  };

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      surname: yup.string().required("Surname is required"),
      adm_no: yup.string().required("Adm.No is required"),
      grade: yup.string().required("Grade is required"),
      stream: yup.string().required("Stream is required"),
      guardian_first_name: yup.string().required("First name is required"),
      guardian_last_name: yup.string().required("Last name is required"),
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

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      setIsEditMode(false);
      try {
        const data = await getValues();
        await ApiService.createLearner(data);
        await getStudents();
        await cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Learner Updated successfully"
            : "Learner created successfully."
        );
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
  const getTests = async () => {
    const response = await ApiService.getLeanerTests({
      learner: learner._id,
      term: selectedTerm,
      session: selectedAcademicYear,
    });

    setTests(response.data);
  };
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  useEffect(() => {
    getGrades();
    getParents();
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit, grade, stream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a CSV file.");
        event.target.value = ""; // Clear the file input to prevent uploading
        return;
      }

      setSelectedFile(file);
    }
  };

  const exportTemplate = async () => {
    console.log(selectedFile);

    try {
      if (!stream) {
        throw Error("Select stream to download");
      }
      const res = await ApiService.exportLearners({
        stream: stream,
      });
      setUploadDialog(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();

      setDialog(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message || "An error occurred while creating the role.");
      notify.current?.showToast();
    }
  };
  const importData = async () => {
    console.log(selectedFile);

    if (!loading) {
      if (!selectedFile) {
        // Handle case where no file is selected
        return;
      }
      isLoading(true);

      try {
        const formData = new FormData();
        formData.append("csvFile", selectedFile);
        formData.append("stream", "");

        const res = await ApiService.importLearners(formData);
        // await getStrands();
        await getStudents();
        isLoading(false);
        setUploadDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();

        setDialog(false);
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the role."
        );
        notify.current?.showToast();
      }
    }
  };
  const getStudents = async () => {
    isLoading(true);
    const response = await ApiService.getLearnersEnroll(
      {
        page,
        search,
        limit,
        grade,
        stream,
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
  const getParents = async () => {
    const response = await ApiService.getParents({
      page: 1,
    });
    setParents(response.data);
  };
  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    setStreams(response.data);
    console.log(response);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteLearner(recordId);
      getStudents();
      setViewMore(false);
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
  const disableRecord = async (record: any) => {
    isLoading(true);
    try {
      let res = await ApiService.toggleLearnerStatus(record);
      getStudents();
      setViewMore(false);
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Learner status changed!");
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const profileRecord = (record: any) => {
    // setIsEditMode(true);
    // setGroup(record?.groups);
    // setPhoto(record?.photo);
    // setGrade(record?.stream?.grade?._id);
    // setGuardianIdNo(record?.guardian?.email);
    // setGuardianIdNo2(record?.guardian2?.email);
    setLearner(record);
    getLeanerClasses(record._id);
    console.log(record);
    setProfile(true);
  };
  const learner_state = location.state; // The object passed in `state`
  useEffect(() => {
    if (learner_state) {
      profileRecord(learner_state);
    }
  }, [learner_state]);
  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record?.groups);
    setPhoto(record?.photo);
    setGrade(record?.stream?.grade?._id);
    setGuardianIdNo(record?.guardian?.email);
    setGuardianIdNo2(record?.guardian2?.email);
    reset({
      ...record,
      image: "",
      stream: record?.stream?._id,
      grade: record?.stream?.grade?._id,
      guardian_id_no: record?.guardian?.id_no,
      guardian: record?.guardian?._id,
      guardian_first_name: record?.guardian?.first_name,
      guardian_email: record?.guardian?.email,
      guardian_last_name: record?.guardian?.last_name,
      guardian_surname: record?.guardian?.surname,
      guardian_phone: record?.guardian?.phone,
      guardian2_id_no: record?.guardian2?.id_no,
      guardian2: record?.guardian2?._id,
      guardian2_first_name: record?.guardian2?.first_name,
      guardian2_email: record?.guardian2?.email,
      guardian2_last_name: record?.guardian2?.last_name,
      guardian2_surname: record?.guardian2?.surname,
      guardian2_phone: record?.guardian2?.phone,
    });
    console.log(record);
    setDialog(true);
  };
  useEffect(() => {
    handleGuardianIdNoBlur();
  }, [guardianIdNo]);
  useEffect(() => {
    if (selectedTerm && selectedAcademicYear) {
      getTests();
      getLearningAreas();
    }
  }, [selectedAcademicYear, selectedTerm]);

  useEffect(() => {
    handleGuardianIdNoBlur2();
  }, [guardianIdNo2]);

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
    setGrade("");
    setGuardianIdNo("");
    setPhoto("");
    setGuardianIdNo2("");
    setGroup([""]);
    setPermission([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };
  const generateAssessment = async () => {
    isLoading(true);

    const data = {
      learning_area: selectedLeaningArea,
      term: selectedTerm,
      learner: learner._id,
      type: "learner",
    };

    isLoading(true);
    try {
      if (data.learner == "") {
        throw Error("Select learner to continue");
      } else if (data.term == "") {
        throw Error("Select term to continue");
      } else if (data.learning_area == "") {
        throw Error("Select learning area to continue");
      }
      let res = await ApiService.getReportByLearners(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,
        // "_blank",
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
  const generateAssessmentSummative = async () => {
    isLoading(true);
    const data = {
      test: test,
      term: selectedTerm,
      stream: stream,
      learner: learner._id,
      type: "learner",
    };
    console.log(data);
    isLoading(true);
    try {
      if (learner == "") {
        throw Error("Select learner to continue");
      } else if (selectedTerm == "") {
        throw Error("Select term to continue");
      } else if (test == "") {
        throw Error("Select test to continue");
      }
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
      {dialog && !profile ? (
        <>
          <div className="flex items-center mt-8 ">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                // cancel({ name: "" });

                setDialog(false);
                setIsEditMode(false);
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
          <form className="mt-5 p-5  box validate-form" onSubmit={onSubmit}>
            {/* {message && !success && (
              <Alert
                variant="soft-danger"
                className="flex items-center mb-2"
                dismissTimeout={9000}
              >
                <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" /> {message}
              </Alert>
            )} */}
            <div>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setPhoto("");
                  setIsEditMode(false);
                  setDialog(false);
                }}
                className="absolute top-0 right-0 mt-3 mr-3"
                href="#"
              ></a>
            </div>
            <fieldset className="mt-5 p-5  box validate-form">
              <legend className="text-lg font-semibold">Learner Details</legend>
              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    First Name<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormInput
                    {...register("first_name")}
                    type="text"
                    name="first_name"
                    className={errors.first_name ? "border-danger" : ""}
                    placeholder="First name"
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
                    Middle Name<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormInput
                    {...register("last_name")}
                    type="text"
                    name="last_name"
                    className={errors.last_name ? "border-danger" : ""}
                    placeholder="Last name"
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
                    {...register("surname")}
                    type="text"
                    name="surname"
                    className={errors.surname ? "border-danger" : ""}
                    placeholder="Surname"
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
                    {...register("adm_no")}
                    type="text"
                    name="adm_no"
                    className={errors.adm_no ? "border-danger" : ""}
                    placeholder="Admission no"
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
                    {...register("nemis_no")}
                    type="text"
                    name="nemis_no"
                    className={errors.nemis_no ? "border-danger" : ""}
                    placeholder="Nemis no"
                  />
                  {errors.nemis_no && (
                    <div className="mt-2 text-danger">
                      {typeof errors.nemis_no.message === "string" &&
                        errors.nemis_no.message}
                    </div>
                  )}
                </div>
                {!isEditMode && (
                  <>
                    {" "}
                    <div className="col-span-4 sm:col-span-4">
                      <FormLabel htmlFor="modal-form-6">
                        Grade<span className="text-danger ml-0.5">*</span>
                      </FormLabel>
                      <TomSelect
                        name="grade"
                        value={grade}
                        className={errors.grade ? "border-danger" : ""}
                        onChange={(event: any) => {
                          reset({ ...getValues(), grade: event });
                          setGrade(event);
                        }}
                        disabled={isEditMode}
                      >
                        <option value={""} selected>
                          Select Grade
                        </option>
                        {grades.map((grade: any, key) => (
                          <option key={key} value={grade._id}>
                            {grade.name}
                          </option>
                        ))}
                      </TomSelect>
                      {errors.grade && (
                        <div className="mt-2 text-danger">
                          {typeof errors.grade.message === "string" &&
                            errors.grade.message}
                        </div>
                      )}
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <FormLabel htmlFor="modal-form-6">
                        Stream<span className="text-danger ml-0.5">*</span>
                      </FormLabel>
                      <FormSelect
                        {...register("stream")}
                        name="stream"
                        className={errors.stream ? "border-danger" : ""}
                        disabled={isEditMode}
                      >
                        <option value={""}>Select Stream</option>
                        {streams.map((stream: any, key) => (
                          <option key={key} value={stream._id}>
                            {stream.name}
                          </option>
                        ))}
                      </FormSelect>
                      {errors.stream && (
                        <div className="mt-2 text-danger">
                          {typeof errors.stream.message === "string" &&
                            errors.stream.message}
                        </div>
                      )}
                    </div>
                    {/* <div className="col-span-12 sm:col-span-4"></div>
                    <div className="col-span-12 sm:col-span-4"></div> */}
                  </>
                )}

                <div className="col-span-12 sm:col-span-4">
                  <FormLabel htmlFor="modal-form-6">Passport Photo</FormLabel>
                  <PassportUpload
                    name={"image"}
                    register={register}
                    errors={errors}
                    initialImageUrl={c.IMG_URL + photo}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="mt-5 p-5  box validate-form">
              <legend className="text-lg font-semibold">
                Guardian Details
              </legend>
              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    Guardian ID Number or Email
                    <span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <TomSelect
                    {...register("guardian_id_no")}
                    name="guardian_id_no"
                    value={guardianIdNo}
                    onChange={(event: any) => {
                      reset({ ...getValues(), parent: event });
                      setGuardianIdNo(event);
                    }}
                    className={errors.guardian_id_no ? "border-danger" : ""}
                  >
                    <option>Select Email</option>
                    {parents
                      .filter((parent: any) => parent.email !== guardianIdNo2)
                      .map((parent: any, key) => (
                        <option key={key} value={parent.email}>
                          {parent?.first_name} {parent?.last_name} -{" "}
                          {parent?.email}
                        </option>
                      ))}
                  </TomSelect>
                  <FormInput
                    {...register("guardian")}
                    type="hidden"
                    name="guardian"
                    className={errors.guardian_id_no ? "border-danger" : ""}
                    placeholder="Guardian ID number"
                  />
                  {errors.guardian_id_no && (
                    <div className="mt-2 text-danger">
                      {typeof errors.guardian_id_no.message === "string" &&
                        errors.guardian_id_no.message}
                    </div>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    Guardian First Name
                    <span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormInput
                    {...register("guardian_first_name")}
                    type="text"
                    name="guardian_first_name"
                    className={
                      errors.guardian_first_name ? "border-danger" : ""
                    }
                    placeholder="Guardian First name"
                    disabled
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
                    {...register("guardian_surname")}
                    type="text"
                    name="guardian_surname"
                    className={errors.guardian_surname ? "border-danger" : ""}
                    placeholder="Guardian surname"
                    disabled
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
                    {...register("guardian_last_name")}
                    type="text"
                    name="guardian_last_name"
                    className={errors.guardian_last_name ? "border-danger" : ""}
                    placeholder="Guardian Last name"
                    disabled
                  />
                  {errors.guardian_last_name && (
                    <div className="mt-2 text-danger">
                      {typeof errors.guardian_last_name.message === "string" &&
                        errors.guardian_last_name.message}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>Guardian Email</FormLabel>
                  <FormInput
                    {...register("guardian_email")}
                    type="email"
                    name="guardian_email"
                    className={errors.guardian_email ? "border-danger" : ""}
                    placeholder="Guardian email"
                    disabled
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
                    {...register("guardian_phone")}
                    type="text"
                    name="guardian_phone"
                    className={errors.guardian_phone ? "border-danger" : ""}
                    placeholder="Guardian phone"
                    disabled
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
            <fieldset className="mt-5 p-5  box validate-form">
              <legend className="text-lg font-semibold">
                Guardian 2 Details
              </legend>
              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    Guardian ID Number or Email
                    <span className="text-danger ml-0.5">*</span>
                  </FormLabel>

                  <TomSelect
                    {...register("guardian2_id_no")}
                    name="guardian2_id_no"
                    value={guardianIdNo2}
                    onChange={(event: any) => {
                      reset({ ...getValues(), parent: event });
                      setGuardianIdNo2(event);
                    }}
                    className={errors.guardian2_id_no ? "border-danger" : ""}
                  >
                    <option>Select Email</option>
                    {parents
                      .filter((parent: any) => parent.email !== guardianIdNo)
                      .map((parent: any, key) => (
                        <option key={key} value={parent.email}>
                          {parent?.email}
                        </option>
                      ))}
                  </TomSelect>

                  <FormInput
                    {...register("guardian2")}
                    type="hidden"
                    name="guardian2"
                    className={errors.guardian2_id_no ? "border-danger" : ""}
                    placeholder="Second Guardian ID number"
                  />
                  {errors.guardian2_id_no && (
                    <div className="mt-2 text-danger">
                      {typeof errors.guardian2_id_no.message === "string" &&
                        errors.guardian2_id_no.message}
                    </div>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    Guardian First Name
                    <span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormInput
                    {...register("guardian2_first_name")}
                    type="text"
                    name="guardian2_first_name"
                    className={
                      errors.guardian2_first_name ? "border-danger" : ""
                    }
                    placeholder="Second Guardian First name"
                    disabled
                  />
                  {errors.guardian2_first_name && (
                    <div className="mt-2 text-danger">
                      {typeof errors.guardian2_first_name.message ===
                        "string" && errors.guardian2_first_name.message}
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
                    placeholder="Second Guardian surname"
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
                    disabled
                    className={
                      errors.guardian2_last_name ? "border-danger" : ""
                    }
                    placeholder="Second Guardian Last name"
                  />
                  {errors.guardian2_last_name && (
                    <div className="mt-2 text-danger">
                      {typeof errors.guardian2_last_name.message === "string" &&
                        errors.guardian2_last_name.message}
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
                    placeholder="Second Guardian email"
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
                    placeholder="Second Guardian phone"
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
            <div className="col-span-12 sm:col-span-12 mt-3">
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
            </div>
          </form>
        </>
      ) : !profile && !dialog ? (
        <>
          <h2 className="mt-1 text-lg font-medium ">Learners</h2>
          {/* {message && success && (
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

          )} */}

          <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
            {is_admin() && (
              <>
                {" "}
                <Button
                  variant="primary"
                  className="mr-2 shadow-md"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setDialog(true);
                    setIsEditMode(false);
                  }}
                >
                  New Learner
                </Button>
                <Menu>
                  <Menu.Button as={Button} className="px-2 !box">
                    <span className="flex items-center justify-center w-5 h-5">
                      <Lucide icon="Plus" className="w-4 h-4" />
                    </span>
                  </Menu.Button>
                  <Menu.Items className="w-40">
                    <Menu.Item onClick={() => setUploadDialog(true)}>
                      <Lucide icon="Book" className="w-4 h-4 mr-2" /> Import
                      Data
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setExportDialog(true);
                      }}
                    >
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                      Template
                    </Menu.Item>
                    {/* <Menu.Item>
                   <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                   to PDF
                 </Menu.Item> */}
                  </Menu.Items>
                </Menu>
              </>
            )}
            <div className="hidden mx-auto md:block text-slate-500">
              Showing{" "}
              {pagination.current_page +
                " to " +
                pagination.total_pages +
                " of " +
                pagination.total}{" "}
              entries
            </div>
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <TomSelect
                value={grade}
                className="relative w-56 text-slate-500 "
                onChange={(event: any) => {
                  reset({ ...getValues(), grade: event, stream: "" });
                  setStream("");
                  // reset({ ...getValues(), grade: event });

                  setGrade(event);
                }}
              >
                <option value={""} selected>
                  All Grades
                </option>
                {grades.map((grade: any, key) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </TomSelect>
            </div>
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <FormSelect
                {...register("stream")}
                name="stream"
                onChange={(e: any) => {
                  setStream(e.target.value);
                }}
                className={errors.stream ? "border-danger" : ""}
                disabled={isEditMode}
              >
                <option value={""}>Select Stream</option>
                {streams.map((stream: any, key) => (
                  <option key={key} value={stream._id}>
                    {stream.name}
                  </option>
                ))}
              </FormSelect>
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
            <div className="col-span-12 overflow-auto  2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : learners.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  {/* <Search size={28} className="" /> */}
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
                  <Table className="border-spacing-y-[3px] border-separate mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap w-10">
                          No.
                        </Table.Th>

                        <Table.Th className="border-b-0 whitespace-nowrap w-24">
                          Name
                        </Table.Th>

                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Adm No
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Nemis
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Grade
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Stream
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-24">
                          Session
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-24">
                          Status
                        </Table.Th>

                        {/* <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Guardian Last Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Guardian Surname
                        </Table.Th> */}
                        {/* <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Guardian ID No
                        </Table.Th> */}
                        {/* <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Guardian Email
                        </Table.Th> */}
                        {/* <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Guardian Phone
                        </Table.Th> */}
                        <Table.Th className="border-b-0 whitespace-nowrap text-center w-20">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {learners.map((learner: any, key) => (
                        <Table.Tr key={key} className="">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-10">
                            <span className="font-medium whitespace-nowrap">
                              {limit * (page - 1) + key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="flex items-center">
                              <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + learner?.photo}
                                  alt="Learner"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div>
                              <div className="ml-4">
                                <a
                                  href="#"
                                  onClick={() => profileRecord(learner)}
                                  className="font-medium whitespace-nowrap"
                                >
                                  {learner?.first_name && learner?.first_name}
                                  {" " +
                                    learner?.surname +
                                    " " +
                                    learner?.last_name}
                                </a>
                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {learner?.stream?.grade?.name}{" "}
                                  {learner?.stream?.name}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.adm_no}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.nemis_no}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.grade?.name}{" "}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.stream?.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.current_session}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <div
                              className={
                                learner?.status == "L"
                                  ? "flex items-center text-primary"
                                  : learner?.status == "D"
                                  ? "flex items-center text-danger"
                                  : "flex items-center text-success"
                              }
                            >
                              {learner?.status == "L" ? "Left" : ""}
                              {learner?.status == "G" ? "Graduated" : ""}
                              {learner?.status == "P" ? "In Session" : ""}
                              {learner?.status == "D" ? "Disabled" : ""}
                            </div>
                          </Table.Td>
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.first_name}{" "}
                              {learner?.guardian?.last_name}{" "}
                              {learner?.guardian?.surname}
                            </span>
                          </Table.Td> */}
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.last_name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.surname}
                            </span>
                          </Table.Td> */}
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.id_no}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.email}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.guardian?.phone}
                            </span>
                          </Table.Td> */}
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0  before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                              <Menu className="inline-block mb-2 mr-1 box">
                                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                                  <Lucide
                                    icon="AlignJustify"
                                    className="w-4 h-4 mr-1"
                                  />{" "}
                                </Menu.Button>
                                <Menu.Items
                                  className="w-40"
                                  placement="bottom-end"
                                >
                                  <Menu.Item
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      profileRecord(learner);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  >
                                    <i className="icon-eye mr-2"></i> View
                                    Profile
                                  </Menu.Item>
                                  {is_admin() && (
                                    <>
                                      {" "}
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          editRecord(learner);
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      >
                                        <i className="icon-eye mr-2"></i> Edit
                                        Profile
                                      </Menu.Item>
                                      {(learner.status === "D" ||
                                        learner.status === "P") && (
                                        <Menu.Item
                                          onClick={(e: any) => {
                                            e.preventDefault();
                                            disableRecord(learner._id);
                                            // assuming you meant disableRecord instead of disbaleRecord
                                          }}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        >
                                          <i className="icon-eye mr-2"></i>
                                          {learner.status === "D"
                                            ? "Enable "
                                            : "Deactivate "}
                                        </Menu.Item>
                                      )}
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          setRecordId(learner._id);
                                          setViewMore(true);
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      >
                                        <i className="icon-eye mr-2"></i> Delete
                                      </Menu.Item>
                                    </>
                                  )}
                                </Menu.Items>
                              </Menu>
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
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}
        </>
      ) : profile ? (
        <div className="content">
          {/* Custom Back Button */}
          <a
            onClick={(event) => {
              event.preventDefault();
              cancel({ name: "" }); // Call the cancel function with desired parameters
              setDialog(false); // Assuming setDialog is defined in the parent component
              setProfile(false); // Assuming setProfile is defined in the parent component
            }}
            href="#"
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            Back
          </a>

          <div className="flex flex-wrap">
            {/* Profile Picture and Name Section */}
            <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
              <div className="bg-white shadow-md m-4 rounded-lg overflow-hidden ">
                <div className="p-6">
                  {/* <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + learner?.photo}
                                  alt="Learner"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div> */}
                  <img
                    src={c.IMG_URL + learner?.photo}
                    alt="photo"
                    className="rounded-full mx-auto"
                    style={{ width: "90%", height: "90%" }}
                    onError={(e) => (e.currentTarget.src = leanerImg)}
                  />
                  <h3 className="mt-3 text-lg font-semibold">
                    {`${learner.first_name} ${learner.surname}`}
                  </h3>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="w-full md:w-3/4 ">
              <div className="bg-white shadow-md rounded-lg  m-4">
                <div className="p-6">
                  <h4 className="font-bold">Learner's Information</h4>

                  {/* Tabs for Basic Info and Guardians */}
                  <ul className="flex border-b border-gray-200 mb-4">
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "basicInfo"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("basicInfo")}
                      >
                        Basic Info
                      </button>
                    </li>
                    {is_admin() && (
                      <>
                        <li className="mr-2">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "guardian1"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold`}
                            onClick={() => setActiveTab("guardian1")}
                          >
                            Guardian 1
                          </button>
                        </li>
                        <li className="mr-2">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "guardian2"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold`}
                            onClick={() => setActiveTab("guardian2")}
                          >
                            Guardian 2
                          </button>
                        </li>
                      </>
                    )}
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab4"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab4")}
                      >
                        Formartive Assessements
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab3"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab3")}
                      >
                        Summative Assessments
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab5"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab5")}
                      >
                        History
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Basic Info Tab */}

                    {activeTab === "basicInfo" && (
                      <div className="tab-pane active">
                        <h4 className="font-bold">Bascic Information</h4>

                        <table className="min-w-full border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.first_name} ${learner.surname}`}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                ADM NO
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.adm_no}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Class
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.grade.name}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Stream
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.stream?.name}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Year Admitted
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {new Date(learner?.createdAt).getFullYear()}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.email || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                NEMIS NO
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.nemis_no}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Current Session
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.current_session}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Status
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                <div
                                  className={
                                    learner?.status != "L"
                                      ? "flex items-center text-success"
                                      : "flex items-center text-danger"
                                  }
                                >
                                  {learner?.status == "L" ? "Left" : ""}
                                  {learner?.status == "G" ? "Graduated" : ""}
                                  {learner?.status == "P" ? "In Session" : ""}
                                </div>
                              </td>
                            </tr>
                            {learner?.status == "G" && (
                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Graduated On
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(learner?.grad_date, "DD-MM-YYYY")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Guardian 1 Tab */}
                    {activeTab === "guardian1" && (
                      <div className="tab-pane">
                        <h4 className="font-bold">Guardian 1 Information</h4>
                        <table className="min-w-full border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.first_name}{" "}
                                {learner?.guardian?.surname}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Relationship
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.relationship}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Contact
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.contact || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.email || "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Guardian 2 Tab */}
                    {activeTab === "guardian2" && (
                      <div className="tab-pane">
                        <h4 className="font-bold">Guardian 2 Information</h4>
                        <table className="min-w-full border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.first_name}{" "}
                                {learner?.guardian2?.surname || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Relationship
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.relationship || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Contact
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.contact || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.email || "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Tab 3 */}
                    {activeTab === "tab3" && (
                      <div className="tab-pane">
                        <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                          <h2 className="mr-auto text-base font-medium border-b p-2">
                            Learner Report
                          </h2>
                          <div className="grid grid-cols-6 gap-2 mt-10">
                            <div className="col-span-12 sm:col-span-2">
                              {/* {JSON.stringify(academicYear)} */}
                              <FormLabel htmlFor="modal-form-6">
                                Grade{" "}
                              </FormLabel>
                              <TomSelect
                                {...register("grade")}
                                value={selectedAcademicYear}
                                name="grade"
                                onChange={(event: any) => {
                                  setSelectedAcademicYear(event);
                                }}
                              >
                                <option value={""}>Select Grade</option>
                                {learner_grades?.map((grade: any, key: any) => (
                                  <option key={key} value={grade.to_session}>
                                    {grade?.to_grade?.name}
                                    {/* {grade?.to_stream?.name}- {grade.to_session} */}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                              <TomSelect
                                {...register("term")}
                                value={selectedTerm}
                                name="term"
                                onChange={(event: any) =>
                                  setSelectedTerm(event)
                                }
                              >
                                <option value={""}>Select Term</option>
                                {terms.map((term: any, key) => (
                                  <option key={key} value={term._id}>
                                    {term.name}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Test</FormLabel>
                              <TomSelect
                                {...register("test")}
                                value={test}
                                name="test"
                                onChange={(event: any) => setTest(event)}
                              >
                                <option value={""}>Select Test</option>
                                {tests.map((test: any, key: any) => (
                                  <option key={key} value={test._id}>
                                    {test.name}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>

                            {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
                          </div>
                          <div className="p-5 mt-3  text-right">
                            <Button
                              onClick={() => generateAssessmentSummative()}
                              variant="primary"
                              type="button"
                              className="w-50 text-white"
                            >
                              Generate Report
                              {loading && (
                                <LoadingIcon
                                  icon="spinning-circles"
                                  color="white"
                                  className="w-4 h-4 ml-2"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                    {activeTab === "tab4" && (
                      <div className="tab-pane">
                        <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                          <h2 className="mr-auto text-base font-medium border-b p-2">
                            Learner Report
                          </h2>
                          <div className="grid grid-cols-6 gap-2 mt-10">
                            <div className="col-span-12 sm:col-span-2">
                              {/* {JSON.stringify(academicYear)} */}
                              <FormLabel htmlFor="modal-form-6">
                                Grade{" "}
                              </FormLabel>
                              <TomSelect
                                {...register("grade")}
                                value={selectedAcademicYear}
                                name="grade"
                                onChange={(event: any) => {
                                  setSelectedAcademicYear(event);
                                }}
                              >
                                <option value={""}>Select Grade</option>
                                {learner_grades?.map((grade: any, key: any) => (
                                  <option key={key} value={grade.to_session}>
                                    {grade?.to_grade?.name}-
                                    {grade?.to_stream?.name}- {grade.to_session}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                              <TomSelect
                                {...register("term")}
                                value={selectedTerm}
                                name="term"
                                onChange={(event: any) =>
                                  setSelectedTerm(event)
                                }
                              >
                                <option value={""}>Select Term</option>
                                {terms.map((term: any, key) => (
                                  <option key={key} value={term._id}>
                                    {term.name}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>

                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">
                                Learning Area
                              </FormLabel>
                              <TomSelect
                                {...register("learning_area")}
                                value={selectedLeaningArea}
                                name="learning_area"
                                onChange={(event: any) =>
                                  setSelectedLearningArea(event)
                                }
                              >
                                <option>Select Learning Area</option>
                                {learningAreas?.map(
                                  (filteredArea: any, key) => (
                                    <option key={key} value={filteredArea?._id}>
                                      {filteredArea.name}
                                    </option>
                                  )
                                )}
                              </TomSelect>
                              {errors.learning_area && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.learning_area.message ===
                                    "string" && errors.learning_area.message}
                                </div>
                              )}
                            </div>

                            {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
                          </div>
                          <div className="px-5  mt-5 text-right">
                            <Button
                              onClick={() => generateAssessment()}
                              variant="primary"
                              type="button"
                              className="w-50 text-white"
                            >
                              Generate Report
                              {loading && (
                                <LoadingIcon
                                  icon="spinning-circles"
                                  color="white"
                                  className="w-4 h-4 ml-2"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                    {activeTab === "tab5" && (
                      <div className="tab-pane">
                        <h4 className="font-bold">Additional Information</h4>
                        <p>Comming soon...2</p>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <Dialog
        staticBackdrop
        size="lg"
        open={exportDialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <Dialog.Panel className="w-full max-w-screen-lg">
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              Download learners import Template
            </h2>
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setUploadDialog(false);
              }}
              className="absolute top-0 right-0 mt-3 mr-3"
              href="#"
            >
              <Lucide icon="X" className="w-8 h-8 text-slate-400" />
            </a>
          </Dialog.Title>
          <div className="grid grid-cols-12 gap-4 gap-y-3 p-4">
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <TomSelect
                value={grade}
                className=" w-full text-slate-500 "
                onChange={(event: any) => {
                  reset({ ...getValues(), grade: event });
                  setStream("");
                  setGrade(event);
                }}
              >
                <option value={""} selected>
                  All Grades
                </option>
                {grades.map((grade: any, key) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </TomSelect>
            </div>
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <FormSelect
                // {...register("stream")}
                // name="stream"
                value={stream}
                onChange={(e: any) => {
                  setStream(e.target.value);
                }}
                className={errors.stream ? "border-danger" : ""}
                disabled={isEditMode}
              >
                <option value={""}>Select Stream</option>
                {streams.map((stream: any, key) => (
                  <option key={key} value={stream._id}>
                    {stream.name}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <Dialog.Footer>
            <div className=" text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setExportDialog(false);
                }}
                className="w-24 mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => exportTemplate()}
                variant="primary"
                type="button"
                className="m-3 w-24"
                ref={deleteButtonRef}
              >
                Download
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <Dialog
        staticBackdrop
        size="lg"
        open={uploadDialog}
        onClose={() => {
          setUploadDialog(false);
        }}
      >
        <Dialog.Panel className="w-full max-w-screen-lg">
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Import Strands</h2>
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setUploadDialog(false);
              }}
              className="absolute top-0 right-0 mt-3 mr-3"
              href="#"
            >
              <Lucide icon="X" className="w-8 h-8 text-slate-400" />
            </a>
          </Dialog.Title>
          {/* <div className="p-5 text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
              </div> */}
          <div className="p-1">
            Choose the file to upload. <i>Type must be csv</i>
            <input
              id="file_input"
              type="file"
              onChange={handleFileChange}
              className="p-4 border border-gray-300 rounded-md items-center w-full rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>

          <Dialog.Footer>
            <div className=" text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setUploadDialog(false);
                }}
                className="w-24 mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => importData()}
                variant="primary"
                type="button"
                className="m-3 w-24"
                ref={deleteButtonRef}
              >
                Import
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
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
