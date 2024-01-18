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
  const [levels, setLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [hasTheme, setHasTheme] = useState(false);
  const [strands, setStrands] = useState([]);
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
    grade: "na",
    learning_area: "na",
    term: "na",
  });
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      name: yup.string().required("Level is required"),
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
        await ApiService.createStrand(data);
        await getStrands();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Strand created successfully.");
        notify.current?.showToast();
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

  useEffect(() => {
    getGrades();
    getLevels();
    getLearningAreas();
  }, []);
  const getStrands = async () => {
    const response = await ApiService.getStrands(
      {
        page: page,
        search: search,
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
    setStrands(response.data);
  };
  const getLevels = async () => {
    const response = await ApiService.getLevels({ page: 1 });
    setLevels(response.data);
  };
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({ page: 1 });
    setLearningAreas(response.data);
  };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteStrand(recordId);
      getStrands();
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
  useEffect(() => {
    getStrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strandFilter, search, page, limit]);

  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    console.log(learningAreas);
    setStrands([]);
    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: selectedValue,
    });

    // You might want to fetch filtered data here
  };
  const handleLearningAreaChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStrands([]);
    await setStrandFilter({
      ...strandFilter,
      learning_area: selectedValue,
    });
    // You might want to fetch filtered data here
  };

  const handleTermChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStrands([]);
    await setStrandFilter({
      ...strandFilter,
      term: selectedValue,
    });
    // You might want to fetch filtered data here
  };
  const handleHasThemeChange = async (event: any) => {
    const isChecked = event.target.checked;
    setStrands([]);
    setHasTheme(isChecked);
    // You might want to fetch filtered data here
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
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Select Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  value={strandFilter.grade}
                  disabled
                >
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

              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Learning Area</FormLabel>
                <FormSelect
                  {...register("learning_area")}
                  name="learning_area"
                  value={strandFilter.learning_area}
                  disabled
                >
                  {learningAreas
                    .filter(
                      (area: any) => area?.grade_id?._id === strandFilter?.grade
                    )
                    .map((filteredArea: any, key) => (
                      <option key={key} value={filteredArea?._id}>
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
                <FormLabel htmlFor="modal-form-6">Select Term</FormLabel>
                <FormSelect
                  {...register("term")}
                  name="term"
                  value={strandFilter.term}
                  disabled
                >
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
            </div>{" "}
            <div className="grid grid-cols-12 gap-4 gap-y-3 mt-5 m-auto">
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Strand </FormLabel>
                <FormTextarea
                  {...register("name")}
                  name="name"
                  className="mr-2"
                />
                {/* <FormInput {...register("name")} name="name" type="text" /> */}
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-3">
                <FormCheck.Input
                  {...register("grade")}
                  id="checkbox-switch-7"
                  type="checkbox"
                  className="mr-2"
                  name="grade"
                  onChange={(e: any) => handleHasThemeChange(e)}
                />

                {/* <FormInput
                  type="checkbox"
                  checked={false}
                  className="m-5 w-5 h-5 border-gray-400 rounded-md focus:ring-indigo-500"
                /> */}

                <FormLabel htmlFor="modal-form-6"> Theme</FormLabel>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              {hasTheme ? (
                <div className="col-span-12 sm:col-span-3">
                  <FormLabel htmlFor="modal-form-6">Theme</FormLabel>
                  <FormTextarea {...register("theme")} name="theme" />
                  {errors.theme && (
                    <div className="mt-2 text-danger">
                      {typeof errors.theme.message === "string" &&
                        errors.theme.message}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
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
          <h2 className="mt-10 text-lg font-medium intro-y">Strand</h2>

          <div className="grid grid-cols-12 gap-6 mt-5">
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
            </div>

            <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select Learning Area</FormLabel>
              <FormSelect
                {...register("learning_area")}
                name="learning_area"
                value={strandFilter.learning_area}
                onChange={(event) => handleLearningAreaChange(event)}
              >
                <option>Select Learning Area</option>
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
            </div>

            <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Select Term</FormLabel>
              <FormSelect
                {...register("term")}
                name="term"
                value={strandFilter.term}
                onChange={(event) => handleTermChange(event)}
              >
                <option>Select Term</option>
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

            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
              <Button
                variant="primary"
                className="mr-2 shadow-md"
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(true);
                }}
              >
                New Strand
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
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      No.
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Strand
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Learning Area
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Theme
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Term
                    </Table.Th>

                    {/* <Table.Th className="border-b-0 whitespace-nowrap">
                      Status
                    </Table.Th> */}
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      ACTION
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {strands.map((strand: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {strand?.name}
                        </span>
                      </Table.Td>

                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {strand?.learning_area?.name}
                          {" - "}
                          {strand?.learning_area?.grade_id?.name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {strand?.theme}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {strand?.term}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center justify-center">
                          {true && (
                            <Menu>
                              <Menu.Button as={Button} className="px-2 !box">
                                <span className="flex items-center justify-center w-5 h-5">
                                  <Lucide
                                    icon="MoreVertical"
                                    className="w-4 h-4"
                                  />
                                </span>
                              </Menu.Button>
                              <Menu.Items>
                                <Menu.Item onClick={() => editRecord(strand)}>
                                  <Lucide
                                    icon="Edit"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    setRecordId(strand._id),
                                      setConfirmDelete(true);
                                  }}
                                >
                                  <Lucide
                                    icon="Trash"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Delete
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          )}
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
