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
import TomSelect from "../../base-components/TomSelect";
import Pagination from "../../base-components/Pagination";
import { formatDate } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [filteredLearningAreas, setFilteredLearningAreas] = useState([]);
  const [grades, setGrades] = useState([]);
  const initialState = {
    grade: "",
    learning_area: "",
    term: "",
  };
  const [strandFilter, updateStrandFilter] = useState(initialState);
  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };
  useEffect(() => {
    setFilteredLearningAreas([]);
    const lerning_areas = learningAreas.filter(
      (area: any) => area?.grade_id?._id === strandFilter.grade
    );
    const data = getValues();

    reset();
    reset({ user: data.user, grade: strandFilter.grade });
    setFilteredLearningAreas(lerning_areas);
  }, [strandFilter.grade]);
  const navigate = useNavigate();

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
      firstname: yup.string().required("First Name is required"),
      lastname: yup.string().required("Last Name is required"),
      email: yup.string().required(" Email is required"),
      surname: yup.string().required("Surname is required"),
      phone: yup.string().required("Phone  Number is required"),
      // .min(11, "Phone number must be at least 11 characters long")
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
  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;

    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: selectedValue,
    });

    // You might want to fetch filtered data here
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        const response = await ApiService.createTeachers(data);
        if (!data._id) {
          navigate("/teacher/" + response._id);
        }
        await getTeachers();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Teacher added successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the term."
        );
        notify.current?.showToast();
      }
    }
  };

  useEffect(() => {
    getTeachers();
  }, [search, page, limit]);
  useEffect(() => {
    // getAcademicYear();
  }, []);
  const getTeachers = async () => {
    isLoading(true);
    const response = await ApiService.getTeachers({
      page: 1,
    });
    setTeachers(response.data);
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    isLoading(false);
  };
  useEffect(() => {
    getLearningAreas();
    getGrades();
  }, []);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({
      page: 1,
      limit: 100000,
    });
    setLearningAreas(response.data);
  };
  // const getAcademicYear = async () => {
  //   const response = await ApiService.getAcademic({ page: 1 });
  //   setAcademic(response.data);
  // };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteTeachers(recordId);
      getTeachers();
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
    reset(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
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
              {isEditMode ? "Edit Teacher" : "Add Teacher"}
            </h2>
          </div>

          <form
            className="mt-5 p-5 intro-y  box validate-form"
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
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  First Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("firstname")}
                  type="text"
                  name="firstname"
                  className={errors.firstname ? "border-danger" : ""}
                  placeholder="first name"
                />
                {errors.firstname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.firstname.message === "string" &&
                      errors.firstname.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Last Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("lastname")}
                  type="text"
                  name="lastname"
                  className={errors.lastname ? "border-danger" : ""}
                  placeholder="last name"
                />
                {errors.lastname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastname.message === "string" &&
                      errors.lastname.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
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
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Phone Number<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("phone", {
                    pattern: {
                      value: /^.{11,}$/,
                      message:
                        "Phone number must be at least 11 characters long",
                    },
                  })}
                  type="text"
                  name="phone"
                  className={errors.phone ? "border-danger" : ""}
                  placeholder="phone"
                />
                {errors.phone && (
                  <div className="mt-2 text-danger">
                    {typeof errors.phone.message === "string" &&
                      errors.phone.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Email <span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.email ? "border-danger" : ""}
                  placeholder="email"
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">Select Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  value={strandFilter.grade}
                  onChange={(event) => handleGradeChange(event)}
                >
                  <option value={""}>Select Grade</option>
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

              {/*   <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  Select Learning Area
                </FormLabel>
              <FormSelect
                  {...register("learning_area")}
                  name="learning_area"
                  value={strandFilter.learning_area}
                  onChange={(event) => handleLearningAreaChange(event)}
                >
                  <option value={""}>Select Learning Area</option>
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
              </div> */}
              <Table className="w-100 ">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      <FormInput
                        type="checkbox"
                        className="w-5 h-5 border-gray-400 rounded-md focus:ring-indigo-500"
                        // checked={selectAll}
                        // onChange={handleSelectAll}
                      />
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Learning Area
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredLearningAreas.map((filteredArea: any, key) => (
                    <Table.Tr key={key} className="">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 ">
                        <span className="font-medium whitespace-nowrap">
                          <FormInput
                            type="checkbox"
                            {...register(`lerningArea[${key}].selected`)}
                            name={`lerningArea[${key}].selected`}
                            className=" w-5 h-5 border-gray-400 rounded-md focus:ring-indigo-500"
                          />
                          <FormInput
                            type="hidden"
                            {...register(`lerningArea[${key}].id`)}
                            name={`lerningArea[${key}].id`}
                            defaultValue={filteredArea?._id} // Use defaultValue instead of value
                            className="w-5 h-5 border-gray-400 rounded-md focus:ring-indigo-500"
                          />
                        </span>
                      </Table.Td>

                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600">
                        <span className="font-medium whitespace-nowrap">
                          {filteredArea.name}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
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
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-10 text-lg font-medium intro-y">Teachers</h2>
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
                Add Teacher
              </Button>
              {/* <Menu>
                <Menu.Button as={Button} className="px-2 !box">
                  <span className="flex items-center justify-center w-5 h-5">
                    <Lucide icon="Plus" className="w-4 h-4" />
                  </span>
                </Menu.Button>
                <Menu.Items className="w-40">
                  <Menu.Item>
                    <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    to Excel
                  </Menu.Item>
                  <Menu.Item>
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    to PDF
                  </Menu.Item>
                </Menu.Items>
              </Menu> */}
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
            <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
              <Table className="border-spacing-y-[3px] border-separate mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      No.
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      First Name
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      Last Name
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      Surname
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      Phone Number
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                      Email
                    </Table.Th>
                    <Table.Th className="py-0 border-b-0 whitespace-nowrap text-center">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {teachers.map((teacher: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td
                        onClick={() => navigate("/teacher/" + teacher?._id)}
                        className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                      >
                        <span className="font-medium whitespace-nowrap">
                          {teacher.firstname}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {teacher.lastname}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {teacher.surname}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {teacher.phone}
                        </span>
                      </Table.Td>
                      <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {teacher.email}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-3 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center justify-center">
                          <a
                            className="flex items-center mr-3 text-success"
                            href="#"
                            onClick={() => editRecord(teacher)}
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
                              setRecordId(teacher._id), setConfirmDelete(true);
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
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : (
                <>
                  {teachers.length === 0 && (
                    <div className="flex flex-col items-center mt-10 bg-white p-8">
                      {/* <Search size={28} className="" /> */}
                      <p className="text-xl text-slate-500 ">
                        No records found
                      </p>
                    </div>
                  )}
                </>
              )}
              {loading === false && teachers.length > 0 && (
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
              )}
            </div>

            {/* END: Pagination */}
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
