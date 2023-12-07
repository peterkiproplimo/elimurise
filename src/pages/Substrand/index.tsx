// import _ from "lodash";
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

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);

  const [grades, setGrades] = useState([]);
  const [strands, setStrands] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [dataInput, setDataInput] = useState("");
  const [rows, setRows] = useState<string[]>([]);
  const [hasTheme, setHasTheme] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState("na");
  const [strandFilter, setStrandFilter] = useState({
    grade: "na",
    learning_area: "na",
    term: "1",
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
      grade: yup.string().required("Level is required"),
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
        console.log(data);
        await ApiService.createSubstrand(data);
        await getSubstrand();
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
    getSubstrand();
    getLearningAreas();
    getStrands();
  }, []);
  const getStrands = async () => {
    const response = await ApiService.allStrands({ page: 1 }, strandFilter);
    setStrands(response.data);
  };
  const getSubstrand = async () => {
    const response = await ApiService.getSubstrand({ page: 1 });
    setSubstrands(response.data);
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
      let res = await ApiService.deleteSubstrand(recordId);
      getSubstrand();
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
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };
  useEffect(() => {
    setSubstrands([]);
    getSubstrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strandFilter]);

  const handleGradeChange = (event: any) => {
    // console.log("hello");
    const selectedValue = event.target.value;
    setStrandFilter({
      ...strandFilter,
      grade: selectedValue,
    });

    // You might want to fetch filtered data here
  };
  const handleLearningAreaChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
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
    await setStrandFilter({
      ...strandFilter,
      term: selectedValue,
    });
    // You might want to fetch filtered data here
  };
  const handleStrandChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    await setSelectedStrand(selectedValue);

    ///call substrands for this strand
    let res = await ApiService.getSubstrandByStrand(selectedValue);
    setSubstrands([]);
    setSubstrands(res.data);
    // You might want to fetch filtered data here
  };

  const addRow = (event: React.MouseEvent) => {
    event.preventDefault();
    if (dataInput.trim() !== "") {
      setRows((prevRows) => [...prevRows, dataInput]);
      setDataInput("");
    }
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
            <h2 className="mr-auto text-lg font-medium">New Substrand</h2>
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
                <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
                <FormSelect {...register("grade")} name="grade" disabled>
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
                  disabled
                >
                  {learningAreas
                    .filter(
                      (area: any) => area?.grade?._id === strandFilter.grade
                    )
                    .map((filteredArea: any, key) => (
                      <option key={key} value={filteredArea?._id}>
                        {filteredArea?.name}
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
                <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                <FormSelect {...register("term")} name="term" disabled>
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

              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Strand</FormLabel>
                <FormSelect {...register("strand")} name="strand" disabled>
                  {strands.map((strand: any, key) => (
                    <option key={key} value={strand._id}>
                      {strand.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.theme && (
                  <div className="mt-2 text-danger">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Substrand</FormLabel>
                <FormInput
                  {...register("substrand")}
                  type="text"
                  name="substrand"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="substrand"
                />
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-12 sm:col-span-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("grade")}
                      name="strands"
                      className="mr-2"
                    />
                    <span>Has multiple Substrands</span>
                  </div>
                  {errors.grade && (
                    <div className="mt-2 text-danger">
                      {typeof errors.grade.message === "string" &&
                        errors.grade.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
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

            <div className="grid grid-cols-12 gap-1 gap-y-3">
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Learning Outcome</FormLabel>
                <textarea
                  {...register("learning_outcome")}
                  name="learning_outcome"
                  className="border rounded-md w-full p-2"
                  placeholder="Enter learning outcome..."
                />
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
            </div>
          </form>
          <br />
          <div className="mt-5 p-5 intro-y box validate-form">
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <Button
                variant="primary"
                className="mr-2 shadow-md"
                onClick={addRow}
              >
                +
              </Button>
              <Table
                id="myTable"
                className="border-spacing-y-[20px] border-separate -mt-2"
              >
                <thead>
                  <tr>
                    <th className="border-b-0 whitespace-nowrap">Indicator</th>
                    <th className="border-b-0 whitespace-nowrap">
                      {" "}
                      Exceeding Expectation
                    </th>
                    <th className="border-b-0 whitespace-nowrap">
                      {" "}
                      Meeting Expectation
                    </th>
                    <th className="border-b-0 whitespace-nowrap">
                      {" "}
                      Approaching Expectation
                    </th>
                    <th className="border-b-0 whitespace-nowrap">
                      {" "}
                      Below Expectation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rowData, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{rowData}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <input
                type="text"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="Enter data"
              />
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
        </>
      ) : (
        <>
          <h2 className="mt-10 text-lg font-medium intro-y">Substrand</h2>

          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
              <FormSelect
                {...register("grade")}
                name="grade"
                onChange={(event) => handleGradeChange(event)}
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
                onChange={(event) => handleLearningAreaChange(event)}
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
              <FormLabel htmlFor="modal-form-6">Term</FormLabel>
              <FormSelect
                {...register("term")}
                name="term"
                onChange={(event) => handleTermChange(event)}
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

            <div className="col-span-12 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">Strand</FormLabel>
              <FormSelect
                {...register("strand")}
                name="strand"
                onChange={(event) => handleStrandChange(event)}
              >
                {strands.map((strand: any, key) => (
                  <option key={key} value={strand._id}>
                    {strand.name}
                  </option>
                ))}
              </FormSelect>
              {errors.theme && (
                <div className="mt-2 text-danger">
                  {typeof errors.theme.message === "string" &&
                    errors.theme.message}
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
                New Substrand
              </Button>

              <div className="hidden mx-auto md:block text-slate-500"></div>
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
                      Substrand
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Grade
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Term
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Learning Area
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Action
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {substrands.map((substrand: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {key + 1}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {substrand.name}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {substrand.grade}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {substrand.term}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="font-medium whitespace-nowrap">
                          {substrand.learning_area}
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
                                <Menu.Item
                                  onClick={() => editRecord(substrand)}
                                >
                                  <Lucide
                                    icon="Edit"
                                    className="w-4 h-4 mr-2"
                                  />{" "}
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() => {
                                    setRecordId(substrand._id),
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
              <div className="font-medium">
                {success ? "Success" : "Failed"}
              </div>
              <div className="mt-1 text-slate-500">{message}</div>
            </div>
          </Notification>
        </>
      )}
    </>
  );
}

export default Main;
