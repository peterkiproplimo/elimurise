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

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");

  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [learners, setLearners] = useState([]);
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

  // const handleGradeChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedValue = event.target.value;
  //   console.log(schools);
  //   setLearners([]);
  //   await setStrandFilter({
  //     school: "na",
  //     stream: "na",
  //     grade: selectedValue,
  //   });
  // };
  // const handleSchoolChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedValue = event.target.value;
  //   setLearners([]);
  //   await setStrandFilter({
  //     ...strandFilter,
  //     school: selectedValue,
  //   });

  // };

  // const handleTermChange = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedValue = event.target.value;
  //   setLearners([]);
  //   await setStrandFilter({
  //     ...strandFilter,
  //     stream: selectedValue,
  //   });
  //   // You might want to fetch filtered data here
  // };
  // const handleHasThemeChange = async (event: any) => {
  //   const isChecked = event.target.checked;
  //   setLearners([]);
  //   setHasTheme(isChecked);
  //   // You might want to fetch filtered data here
  // };
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
              {isEditMode ? "Edit Learner" : "New Learner"}
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
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel htmlFor="modal-form-6">
                    Grade<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormSelect
                    {...register("grade")}
                    name="grade"
                    value={grade}
                    onChange={(event) => setGrade(event.target.value)}
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
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <FormLabel htmlFor="modal-form-6">
                    Select Stream<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormSelect {...register("stream")} name="stream">
                    {streams.map((stream: any, key) => (
                      <option key={key} value={stream._id}>
                        {stream.name}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              </div>
            </fieldset>
            <fieldset className="mt-5 p-5 intro-y box validate-form">
              <legend className="text-lg font-semibold">
                Guardian Details
              </legend>
              <div className="grid grid-cols-12 gap-4 gap-y-3">
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
          <h2 className="mt-10 text-lg font-medium intro-y">Learners</h2>
          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
            <Button
              variant="primary"
              className="mr-2 shadow-md"
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setDialog(true);
              }}
            >
              New Learner
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

          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select School</FormLabel>
              <FormSelect
                {...register("learning_area")}
                name="learning_area"
                value={strandFilter.school}
                onChange={(event) => handleSchoolChange(event)}
              >
                <option>Select School</option>
                {schools
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

            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <Table className="border-spacing-y-[3px] border-separate mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      No.
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      First Name
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Last Name
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Surname
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Adm No
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Nemis No
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian First Name
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian Last Name
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian Surname
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian ID No
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian Email
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Guardian Phone
                    </Table.Th>
                    {/* <Table.Th className="border-b-0 whitespace-nowrap">
                      Created At
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Updated At
                    </Table.Th> */}
                    <Table.Th className="border-b-0 whitespace-nowrap text-center">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {learners.map((learner: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.first_name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.last_name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.surname}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.adm_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.nemis_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_first_name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_last_name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_surname}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_id_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_email}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {learner?.guardian_phone}
                        </span>
                      </Table.Td>
                      {/* <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {new Date(learner?.createdAt).toLocaleString(
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
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {new Date(learner?.updatedAt).toLocaleString(
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
                      </Table.Td> */}
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center justify-center">
                          <a
                            className="flex items-center mr-3 text-success"
                            href="#"
                            onClick={() => editRecord(learner)}
                          >
                            <Lucide
                              icon="CheckSquare"
                              className="w-4 h-4 mr-1"
                            />{" "}
                            Edit
                          </a>
                          <a
                            className="flex items-center text-danger"
                            href="#"
                            onClick={() => {
                              setRecordId(learner._id), setConfirmDelete(true);
                            }}
                          >
                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                            Delete
                          </a>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>

            {/* END: Data List */}
            <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
              <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
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
                      setPage(page < pagination.total_pages ? page - 1 : 1)
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
