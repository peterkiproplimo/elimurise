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
import Alert from "../../base-components/Alert";
import Tippy from "../../base-components/Tippy";
import avarter from "../../assets/images/woman.jpeg";
function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [grades, setGrades] = useState([]);

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

  useEffect(() => {
    getGrades();
  }, [search, page, limit]);

  const getGrades = async () => {
    isLoading(true);
    try {
      const response = await ApiService.getGrades({ page, limit, search });
      setGrades(response.data);
      const pagination = response.pagination;
      setPagination({
        current_page: pagination.current_page,
        total: pagination.total,
        total_pages: pagination.total_pages,
        per_page: pagination.per_page,
      });
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
    }
  };

  // const getAcademicYear = async () => {
  //   const response = await ApiService.getAcademic({ page: 1 });
  //   setAcademic(response.data);
  // };

  const openLearningArea = (grade_id: any) => {
    navigate("/home/learning_areas/", {
      replace: true,
      state: { data: grade_id },
    });
  };

  return (
    <>
      {dialog ? (
        <></>
      ) : (
        <>
          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
            <h2 className="mt-1 text-lg font-medium intro-y">Grades</h2>
            {message && success && (
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
          <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
            {/* BEGIN: Data List */}
            {loading ? (
              <div className="flex flex-col items-center mt-5">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
              </div>
            ) : grades.length === 0 ? (
              <div className="flex flex-col   items-center mt-10 bg-white p-8">
                {/* <Search size={28} className="" /> */}
                <p className="text-xl items-center text-slate-500 ">
                  No records found
                </p>
              </div>
            ) : (
              <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
                <Table className="border-spacing-y-[3px] border-separate mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                        No.
                      </Table.Th>
                      <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                        Name
                      </Table.Th>
                      <Table.Th className="py-0 border-b-0 whitespace-nowrap">
                        Levels
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {grades.map((grade: any, key) => (
                      <Table.Tr key={key} className="intro-x">
                        <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <span className="font-medium whitespace-nowrap">
                            {limit * (page - 1) + key + 1}
                          </span>
                        </Table.Td>
                        <Table.Td
                          className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                          onClick={(e: any) => openLearningArea(grade)}
                        >
                          <div className="flex items-center">
                            <div className="w-9 h-9 image-fit zoom-in">
                              <Tippy
                                as="img"
                                alt=""
                                className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                src={avarter}
                                content={grade.name}
                              />
                            </div>
                            <div className="ml-4">
                              <a
                                href="#"
                                // onClick={() =>
                                //   navigate("/home/learning_areas/" + grade?._id)
                                // }
                                className="font-medium whitespace-nowrap"
                              >
                                {grade.name}
                              </a>
                              {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {teacher.phone}
                            </div> */}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="py-0 first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <span className="font-medium whitespace-nowrap">
                            {grade?.level_id?.name}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
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
                {loading ? (
                  <div className="flex flex-col items-center mt-5">
                    <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                  </div>
                ) : (
                  <>
                    {grades.length === 0 && (
                      <div className="flex flex-col items-center mt-10 bg-white p-8">
                        {/* <Search size={28} className="" /> */}
                        <p className="text-xl text-slate-500 ">
                          No records found
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* END: Pagination */}
          </div>
        </>
      )}
    </>
  );
}

export default Main;
