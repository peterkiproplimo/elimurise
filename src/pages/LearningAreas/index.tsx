import _, { upperCase } from "lodash";
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
import logoUrl from "../../assets/images/edit.png";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Books.jpeg";
import { Search } from "lucide-react";
import BookCover from "./book";
import { useLocation } from "react-router-dom";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const [learningAreas, setLearningAreas] = useState([]);
  const [grades, setGrades] = useState([]);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [gradeId, setGradeId] = useState("");
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [grade, setGrade] = useState<any>({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
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
        await ApiService.createLearningArea(data);
        await getLearningAreas();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Level created successfully.");
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
    getLearningAreas();
  }, [search, page, limit, gradeId]);
  useEffect(() => {
    const grade = location?.state?.data;
    setGrade(grade);
    console.log("grade", grade);

    if (grade) {
      setGradeId(grade._id);
    }
  }, []);
  const getLearningAreas = async () => {
    isLoading(true);
    if (gradeId) {
      const response = await ApiService.getLearningAreas({
        page: page,
        limit: limit,
        search: search,
        gradeId: gradeId,
      });
      setLearningAreas(response.data);
      const pagination = response.pagination;
      setPagination({
        current_page: pagination.current_page,
        total: pagination.total,
        total_pages: pagination.total_pages,
        per_page: pagination.per_page,
      });
      isLoading(false);
    }
  };
  //ss

  const openStrand = (learningArea: any) => {
    navigate("/home/Strands", {
      replace: true,
      state: { data: learningArea },
    });
  };

  // const cancel = (record: any) => {
  //   setGroup([""]);
  //   setPermission([""]);
  //   reset(record);
  //   setDialog(false);
  // };

  return (
    <>
      {dialog ? (
        <></>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium  flex flex-wrap">
            <a
              onClick={(e: any) =>
                navigate("/home/grade", {
                  replace: true,
                })
              }
              className=" mr-5 "
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 " />
            </a>
            Learning Areas for({grade?.name})
          </h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
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
          </div>

          {/* <div className="hidden mx-auto md:block text-slate-500"></div> */}
          {/* </div> */}

          <div>
            {loading ? (
              <div className="fixed inset-0 flex items-center justify-center">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
              </div>
            ) : learningAreas.length === 0 ? (
              <div className="flex flex-col items-center mt-10 bg-white w-full p-8">
                {/* <Search size={28} className="" /> */}
                <p className="text-xl text-slate-500 ">No records found</p>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-5 mt-5">
                {learningAreas.map((learningArea: any, key) => (
                  <div
                    key={key}
                    className="col-span-12  cursor-pointer sm:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-2 flex flex-col items-center gap-4 hover:bg-gray-100 rounded-lg  transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={(e: any) => openStrand(learningArea)}
                  >
                    {/* Book Cover */}
                    <div className="w-full flex justify-center mb-4">
                      <BookCover
                        bookName={learningArea.name}
                        author={learningArea?.grade_id?.name}
                      />
                    </div>
                    {/* Learning Area Details */}
                    {/* <div className="text-center">
                      <h1 className="text-xl font-semibold mb-1 truncate">
                        {learningArea.name}
                      </h1>
                      <h2 className="text-lg font-medium text-gray-600">
                        {learningArea?.grade_id?.name}
                      </h2>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
          {!loading && learningAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap w-100 items-center col-span-12  sm:flex-row sm:flex-nowrap">
              <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap">
                <Pagination className="w-full sm:w-auto sm:mr-auto">
                  <button
                    onClick={() => setPage(page - 1)}
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
                    onClick={() => setPage(page + 1)}
                    className="py-2 px-4 rounded-md"
                  >
                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                  </button>
                </Pagination>
                <div className="text-slate-500">
                  <span className="mr-3">Total {pagination.total}</span>
                  <FormSelect
                    className="w-30 mt-3 !box sm:mt-0"
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={12}>12/page</option>
                    <option value={24}>24/page</option>
                    <option value={44}>44/page</option>
                    <option value={88}>88/page</option>
                  </FormSelect>
                </div>
              </div>
            </div>
          )}
          {/* </div> */}

          <div>{/* END: Pagination */}</div>

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
