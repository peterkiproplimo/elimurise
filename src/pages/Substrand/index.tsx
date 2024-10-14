import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
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
import { useForm, Controller } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import ClassicEditor from "../../base-components/Ckeditor/ClassicEditor";
import React from "react";
import { setValue } from "../../base-components/TomSelect/tom-select";
import "./substrand.css";
import Pagination from "../../base-components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/subs.jpeg";
import { Search } from "lucide-react";

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
  const [substrand, setSubstrand] = useState<any>({});
  const [learningAreas, setLearningAreas] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [dataInput, setDataInput] = useState("");
  const [rows, setRows] = useState<string[]>([]);
  const [is_child, setIs_child] = useState(false);
  const [activeTab, setActiveTab] = useState("outcome");
  const [selected, setSelected] = useState({
    indicator: [],
  });
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
  const location = useLocation();
  const navigate = useNavigate();
  const state_strand = location?.state?.data;
  const learning_area = location?.state?.learningArea;
  console.log(learning_area);
  const [selectedStrand, setSelectedStrand] = useState(
    state_strand?._id || "na"
  );
  const [strandFilter, setStrandFilter] = useState({
    grade: state_strand?.learning_area?.grade_id?._id || "na",
    learning_area: state_strand?.learning_area?._id || "na",
    term: state_strand?.term || "na",
  });

  const [learningOutcome, setLearningOutcome] = useState("na");
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      name: yup.string().required("Substrand name is required"),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    reset,
    setValue,
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
        setMessage("Substrand created successfully.");
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

    getStrands();
  }, []);
  const getStrands = async () => {};
  const getSubstrand = async () => {
    try {
      isLoading(true);
      let res = await ApiService.getSubstrandByStrand(
        {
          page: page,
          search: search,
          limit: limit,
        },
        selectedStrand
      );
      const pagination = res.pagination;
      setPagination({
        current_page: pagination.current_page,
        total: pagination.total,
        total_pages: pagination.total_pages,
        per_page: pagination.per_page,
      });
      setSubstrands(res.data);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
    }
  };
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
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
    console.log(strandFilter);

    setNumberOfFields(0);
    setSubstrand(record);
    console.log(record);
    setGroup(record.groups);
    console.log(strandFilter);
    reset(record);
    setDialog(true);
    console.log(record);
    setSelected({ indicator: record?.indicators });
    setSubstrand(record);
  };

  const cancel = (record: any) => {
    setNumberOfFields(1);
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };
  useEffect(() => {
    setSubstrands([]);
    setStrands([]);
    getStrands();
    // getSubstrand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strandFilter]);
  useEffect(() => {
    getSubstrand();
  }, [search, limit, page, selectedStrand]);
  const handleGradeChange = (event: any) => {
    // console.log("hello");
    // You might want to fetch filtered data here
  };

  const openStrand = (strand: any) => {
    console.log(learning_area);
    navigate("/home/Strands", {
      replace: true,
      state: { data: learning_area },
    });
  };

  const addRow = (event: React.MouseEvent) => {
    event.preventDefault();
    if (dataInput.trim() !== "") {
      setRows((prevRows) => [...prevRows, dataInput]);
      setDataInput("");
    }
  };
  const [showExtraFields, setShowExtraFields] = useState(true);
  const [numberOfFields, setNumberOfFields] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const handleAddField = () => {
    setNumberOfFields((prev) => prev + 1);
  };
  const handleRemoveField = (index: any) => {
    setNumberOfFields((prev) => prev - 1);
  };

  const renderExtraFields = (selected: any) => {
    const fields = [];
    fields.push(
      <>
        <div className="mb-4 border-b border-gray-200">
          <ul className="flex cursor-pointer w-full ">
            <li
              className={`mr-4 pb-2 font-bold  text-lg ${
                activeTab === "outcome"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("outcome")}
            >
              Specific Learning Outcomes
            </li>
            <li
              className={`mr-4 ml-8 pb-2 font-bold  text-lg ${
                activeTab === "indicators"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("indicators")}
            >
              Indicators
            </li>
          </ul>
        </div>

        {activeTab === "outcome" && (
          <div className="mt-3">
            <div
              className="font-medium inline-block richtext"
              style={{ listStyle: "auto" }}
              dangerouslySetInnerHTML={{
                __html: substrand.learning_outcome,
              }}
            ></div>
          </div>
        )}
      </>
    );

    selected.indicator.map((indicator: any, i: any) => {
      fields.push(
        <div className="p-5 bg-white">
          {/* <div className="mb-4 border-b border-gray-200">
        <ul className="flex cursor-pointer w-full ">
          <li
            className={`mr-4 pb-2 font-bold  text-lg ${activeTab === 'outcome' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('outcome')}
          >
            Specific Learning Outcomes
          </li>
          <li
            className={`mr-4 ml-8 pb-2 font-bold  text-lg ${activeTab === 'indicators' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('indicators')}
          >
            Indicators
          </li>
        </ul>
      </div> */}

          {/* {activeTab === 'outcome' && (
        <div className="mt-3">
          {i+1}.  <div className="font-medium inline-block richtext"
                style={{ listStyle: "auto" }}
                dangerouslySetInnerHTML={{
                __html: substrand.learning_outcome}}
              ></div>
         
        </div>
      )} */}

          {activeTab === "indicators" && (
            <div className="mt-3">
              <p className="text-gray-700 mt-2">
                {i + 1}. {indicator[0].description}
              </p>
              <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-gray-300 text-left text-sm font-semibold">
                      Score
                    </th>
                    <th className="py-2 px-4 border-gray-300 text-left text-sm font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      (a). Exceeding Expectation (4)
                    </td>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      {indicator[0].EE}{" "}
                      {/* Adjust these properties based on your actual data structure */}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      (b). Meeting Expectation (3)
                    </td>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      {indicator[0].ME}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      (c). Approaching Expectation (2)
                    </td>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      {indicator[0].AE}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      (d). Below Expectation (1)
                    </td>
                    <td className="py-1 px-4 border-b border-gray-200 text-gray-700">
                      {indicator[0].BE}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    });

    for (
      let i = selected.indicator.length;
      i < selected.indicator.length + numberOfFields;
      i++
    ) {
      fields.push(
        <div className="grid  gap-1 box mt-5 p-5" key={i}>
          <div className="col-span-3 sm:col-span-3">
            <FormLabel htmlFor="modal-form-6">Indicator</FormLabel>
            <FormTextarea
              {...register("indicators[" + i + "][0].description")}
              name={`indicators[${i}][0].description`}
              className={errors.indicator ? "border-danger" : ""}
              placeholder="Indicator Description"
            />
            {errors.role && (
              <div className="mt-2 text-danger">
                {typeof errors.role.message === "string" && errors.role.message}
              </div>
            )}
          </div>
          <div className="grid grid-cols-12 gap-1 gap-y-3 mt-3">
            <div className="col-span-3 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">E.E(4)</FormLabel>

              <FormTextarea
                {...register("indicators[" + i + "][0].EE")}
                name={`indicators[${i}][0].EE`}
                className={errors.indicator ? "border-danger" : ""}
                placeholder="Exceeding Expectation"
              />
              {errors.role && (
                <div className="mt-2 text-danger">
                  {typeof errors.role.message === "string" &&
                    errors.role.message}
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">M.E(3)</FormLabel>

              <FormTextarea
                {...register("indicators[" + i + "][0].ME")}
                name={`indicators[${i}][0].ME`}
                className={errors.indicator ? "border-danger" : ""}
                placeholder="Meeting Expectation"
              />
              {errors.role && (
                <div className="mt-2 text-danger">
                  {typeof errors.role.message === "string" &&
                    errors.role.message}
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">A.E(2)</FormLabel>

              <FormTextarea
                {...register("indicators[" + i + "][0].AE")}
                name={`indicators[${i}][0].AE`}
                className={errors.indicator ? "border-danger" : ""}
                placeholder="Approaching Expectation"
              />
              {errors.role && (
                <div className="mt-2 text-danger">
                  {typeof errors.role.message === "string" &&
                    errors.role.message}
                </div>
              )}
            </div>
            <div className="col-span-3 sm:col-span-3">
              <FormLabel htmlFor="modal-form-6">B.E(1)</FormLabel>
              <FormTextarea
                {...register("indicators[" + i + "][0].BE")}
                name={`indicators[${i}][0].BE`}
                className={errors.indicator ? "border-danger" : ""}
                placeholder="Below Expectation"
              />
              {errors.role && (
                <div className="mt-2 text-danger">
                  {typeof errors.role.message === "string" &&
                    errors.role.message}
                </div>
              )}
            </div>
            <div></div>
          </div>
        </div>
      );
    }
    return fields;
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
            <h2 className=" text-lg font-medium intro-y">
              <span
                className="font-medium whitespace-nowrap"
                dangerouslySetInnerHTML={{ __html: substrand.name }}
              ></span>
            </h2>
          </div>
          <br />
          <form className=" intro-y  validate-form" onSubmit={onSubmit}>
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

            <div className="grid grid-cols-12 gap-4 gap-y-3 box mt-5 p-5">
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Grade{}</FormLabel>
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
                  {/* substrand */}
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
                <FormInput
                  type="text"
                  value={learning_area?.name}
                  disabled
                ></FormInput>
                {/* <FormSelect
                  {...register("learning_area")}
                  name="learning_area"
                  value={strandFilter.learning_area}
                  disabled
                >
                  {learningAreas
                  
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
                )} */}
              </div>

              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Term</FormLabel>
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

              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Strand</FormLabel>

                <FormInput
                  type="text"
                  value={state_strand?.name}
                  disabled
                ></FormInput>
              </div>
            </div>

            <div className="">
              <div className="p-5 bg-white shadow rounded-lg mt-5">
                {showExtraFields && renderExtraFields(selected)}

                {showExtraFields && (
                  <div className="col-span-12 sm:col-span-3"></div>
                )}
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium intro-y flex flex-wrap">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                openStrand(strands);
              }}
              className=" mr-5 "
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 " />
            </a>
            <span className="ml-3">Substrands for strand :</span>{" "}
            <b>{state_strand.name}</b>{" "}
            <span className="ml-3">
              Learning Area:{" "}
              <b>
                {learning_area?.name} ({learning_area?.grade_id?.name})
              </b>
            </span>
          </h2>

          <div className="grid grid-cols-12 gap-6 mt-5">
            {/* BEGIN: Data List */}
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
              </div>
            ) : substrands.length === 0 ? (
              <div className="col-span-12 text-center items-center mt-10 bg-white p-8">
                {/* <Search size={28} className="" /> */}
                <p className="text-xl text-slate-500 ">No Substrands found</p>
              </div>
            ) : (
              <>
                {substrands.map((substrand: any, key) => (
                  <div className="col-span-12 intro-y md:col-span-6">
                    <div
                      className="box p-2 min-h-[100px]"
                      onClick={() => editRecord(substrand)}
                    >
                      <div className=" gap-4 p-5  ">
                        <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                          <div>
                            <img
                              alt="Midone Tailwind HTML Admin Template"
                              className="rounded-full w-14 h-14"
                              src={logo}
                            />
                          </div>
                          <div className="mt-3 ml-4 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                            <h2
                              className="font-bold text-xl"
                              dangerouslySetInnerHTML={{
                                __html: substrand.name,
                              }}
                            ></h2>
                            <div className="font-bold text  mt-0.5">
                              Strand: {state_strand?.name}
                            </div>
                            <div className="font-bold text  mt-0.5">
                              {" "}
                              {learning_area?.grade_id.name}
                            </div>
                            <div className="font-bold text  mt-0.5">
                              Term: {state_strand?.term}
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-4 lg:mt-0 lg:justify-end justify-center">
                          <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">
                            View SLOs
                          </button>
                          {/* <button className="transition duration-200 border shadow-sm inline-flex items-center justify-center rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 dark:border-darkmode-100/40 dark:text-slate-300 [&amp;:hover:not(:disabled)]:bg-secondary/20 [&amp;:hover:not(:disabled)]:dark:bg-darkmode-100/10 px-2 py-1">Profile</button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap tt">
                  <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap tt">
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
                          setPage(page < pagination.total_pages ? page + 1 : 1)
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
