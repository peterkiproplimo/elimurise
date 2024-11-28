import _ from "lodash";
import clsx from "clsx";
import { useRef } from "react";
import { useEffect, useState } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Alert from "../../base-components/Alert";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import ReportDonutChart from "../../components/ReportDonutChart";
import ReportBarChart from "../../components/ReportBarChart";
import LeafletMap from "../../components/LeafletMap";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import womanIllustrationUrl from "../../assets/images/woman-illustration.svg";
import phoneIllustrationUrl from "../../assets/images/phone-illustration.svg";
import {
  MoreHorizontal,
  FileText,
  Printer,
  Settings,
  Plus,
} from "lucide-react";
import studentUrl from "../../assets/images/image.jpeg";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import image from "../../assets/images/custom.svg";
import student1 from "../../assets/images/st-1.svg";
import student2 from "../../assets/images/st-2.svg";
import student3 from "../../assets/images/st-3.svg";
import student4 from "../../assets/images/st-4.svg";

function Main() {
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };
  interface Learner {
    first_name: string;
    // Add other properties if needed
  }
  const [tranfers, setTransfers] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, isLoading] = useState(true);
  const [approveTranfer, setApproveTranfer] = useState<any>({
    id: "",
    phone: "",
  });
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [displayMonth, setDisplayMonth] = useState(
    currentDate.format("MMMM YYYY")
  );

  useEffect(() => {
    setDisplayMonth(currentDate.format("MMMM YYYY"));
  }, [currentDate]);

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      //   setIsOpen(false);
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();

  const month = currentDate.format("MMMM YYYY");

  const [dashboard, setDashboard] = useState<any>({
    learners: [],
  });
  const [learners, setLearners] = useState<any>([]);
  const totalLearners = learners.length;
  const [approveDialog, setApproveDialog] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const auth = useAuth();
  const learner = auth?.authData?.user as Learner;
  const [page, setPage] = useState(1);
  const cDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getDaysArray = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const daysArray = getDaysArray();

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };
  useEffect(() => {
    getLeaners();
  }, []);
  const getLeaners = async () => {
    const response = await ApiService.parentDashboard();

    setLearners(response.learners);
  };
  useEffect(() => {
    getTransfers();
  }, [search, page, limit]);

  const getTransfers = async () => {
    isLoading(true);
    const response = await ApiService.getLearnersTransfers({
      page: page,
      limit: limit,
    });
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setTransfers(response.data);
    isLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {/* BEGIN: Notification */}
            <div className="col-span-12 mt-6 -mb-6 ">
              {/* <Alert
                variant="primary"
                dismissible
                className="flex items-center mb-6 box dark:border-darkmode-600"
              >
                {({ dismiss }) => (
                  <>
                    <span>
                      Introducing new dashboard! Download now at
                      <a
                        href="https://themeforest.net/item/midone-jquery-tailwindcss-html-admin-template/26366820"
                        className="ml-1 underline"
                        target="blank"
                      >
                        themeforest.net
                      </a>
                      .
                    </span>
                    <Alert.DismissButton
                      className="text-white"
                      onClick={dismiss}
                    >
                      <Lucide icon="X" className="w-4 h-4" />
                    </Alert.DismissButton>
                  </>
                )}
              </Alert> */}
            </div>
            {/* BEGIN: Notification */}
            {/* BEGIN: General Report */}
            <div className="col-span-12 mt-2 lg:col-span-12 xl:col-span-12">
              <div>
                <div className="flex items-center h-10 ">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Dashboard
                  </h2>
                </div>
                <div
                  className={clsx([
                    "relative zoom-out",
                    "bg-blue-100 rounded-md ",
                  ])}
                >
                  <div className="p-0 xl:p-0">
                    <div className="flex flex-wrap items-center">
                      <div className="w-full lg:w-3/12">
                        <img src={image} alt="" />
                      </div>
                      <div className="w-full lg:w-9/12">
                        <h2 className="text-3xl  font-bold">
                          Hello {learner?.first_name}, Welcome Back!
                        </h2>
                        <p className="text-gray-800 mb-0 text-lg">
                          Always stay updated in your learner's portal!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h2 className="text-lg font-medium truncate">General Report</h2>
                <div className="flex flex-wrap -mx-2 mt-2">
                  {learners.map((learner: any) => (
                    <div
                      key={learner._id}
                      className="w-full md:w-6/12 xl:w-4/12 p-2"
                    >
                      <div
                        onClick={() => {
                          localStorage.setItem(
                            "learner",
                            JSON.stringify(learner)
                          );
                          navigate("/parent/profile", {});
                        }}
                        className="relative box cursor-pointer  bg-white-100 min-h-[150px] rounded-lg"
                        style={{
                          backgroundImage: `url(${student2})`,
                          backgroundPosition: "right bottom",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        <div className="p-4">
                          <h4 className="mt-10 mb-1 text-xl font-semibold">
                            {learner?.first_name} {learner?.surname}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {learner?.stream?.grade?.name}{" "}
                            {learner?.stream?.name}
                          </p>
                          <p
                            className={
                              learner?.status != "D"
                                ? "flex items-center text-success"
                                : "flex items-center text-danger"
                            }
                          >
                            {learner?.status == "D" ? "Deactivated" : "Active"}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="items-center block h-10  sm:flex">
                <h2 className="mr-5 ml-2 text-lg font-medium truncate">
                  Student Transfers
                </h2>
              </div>
              <div className="mt-5 overflow-auto  lg:overflow-visible sm:mt-0">
                <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap w-10">
                        NO.
                      </Table.Th>

                      <Table.Th className="border-b-0 whitespace-nowrap w-24">
                        NAME
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        ADM No
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        TRANSFER CODE
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        OLD SCHOOL
                      </Table.Th>

                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        PAYMENT STATUS
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        APPROVAL STATUS
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-20">
                        REASON
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {tranfers.map((tranfer: any, key) => (
                      <Table.Tr key={key} className="">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-10">
                          <span className="font-medium whitespace-nowrap">
                            {key + 1}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="flex items-center">
                            <div>
                              <a
                                href="#"
                                className="font-medium whitespace-nowrap"
                              >
                                {tranfer?.learner?.first_name &&
                                  tranfer?.learner?.first_name}
                                {" " +
                                  tranfer?.learner?.surname +
                                  " " +
                                  tranfer?.learner?.last_name}
                              </a>
                              <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                {tranfer?.stream?.grade?.name}{" "}
                                {tranfer?.stream?.name}
                              </div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {tranfer?.learner?.adm_no}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {tranfer?.transferCode}{" "}
                          </span>
                        </Table.Td>

                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            <div className="ml-0">
                              {tranfer?.oldSchool?.name}
                            </div>
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span
                            className={clsx([
                              "font-medium whitespace-nowrap",
                              tranfer?.paymentStatus === "pending"
                                ? "text-green-500"
                                : "text-red-500",
                            ])}
                          >
                            {tranfer?.paymentStatus}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span
                            className={clsx([
                              "font-medium whitespace-nowrap",
                              tranfer?.approvalStatus === "pending"
                                ? "text-green-500"
                                : "text-red-500",
                            ])}
                          >
                            {tranfer?.approvalStatus}
                          </span>
                        </Table.Td>

                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {tranfer?.reason}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            {/* END: Weekly Top Products */}
          </div>
        </div>
        <div className="col-span-12 2xl:col-span-3">
          <div className="pb-10 -mb-10 2xl:border-l">
            <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
              <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto">
                <div className="flex items-center h-10 ">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Calendar
                  </h2>
                </div>
                <div className=" box p-2">
                  <div className="relative">
                    <div className="flex p-4 pb-0">
                      <h2 className="text-xl font-semibold">{displayMonth}</h2>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2">
                      <button
                        onClick={handlePrevMonth}
                        className="bg-blue-500 text-white px-2 py-1 h-8 rounded-l-lg hover:bg-blue-600 text-2xl flex items-center justify-center"
                      >
                        &lt;
                      </button>

                      <button
                        onClick={handleNextMonth}
                        className="bg-blue-500 text-white px-2 py-1 h-8 rounded-r-lg hover:bg-blue-600 text-2xl flex items-center justify-center"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mt-10 h-[calc(100%-16rem)]">
                    <div className="p-2 font-semibold">Sun</div>
                    <div className="p-2 font-semibold">Mon</div>
                    <div className="p-2 font-semibold">Tue</div>
                    <div className="p-2 font-semibold">Wed</div>
                    <div className="p-2 font-semibold">Thu</div>
                    <div className="p-2 font-semibold">Fri</div>
                    <div className="p-2 font-semibold">Sat</div>

                    {daysArray.map((day, index) => (
                      <div
                        key={index}
                        className={`p-4 ${
                          day ? "bg-gray-50" : "bg-transparent"
                        } ${
                          day === dayjs().date() &&
                          currentDate.isSame(dayjs(), "month")
                            ? "bg-blue-200"
                            : ""
                        }`}
                      >
                        {day || ""}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-12  md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="  relative before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70">
                  <Tab.Group className="p-5 box">
                    <Tab.Panels className="mt-6">
                      <Tab.Panel>
                        <div className="relative">
                          <ReportDonutChart
                            height={208}
                            className="mt-3"
                            learners={[
                              { value: totalLearners, color: "#3399ff" },
                            ]}
                          />
                          <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
                            <div className="text-2xl font-medium">
                              {totalLearners}
                            </div>
                            <div className="text-slate-500 mt-0.5">
                              Number of Learners
                            </div>
                          </div>
                        </div>
                        <div className="mx-auto mt-5 w-52 sm:w-auto">
                          <div className="flex items-center">
                            <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                            <span className="truncate">Total Learners</span>
                            <span className="ml-auto font-medium">
                              {totalLearners}
                            </span>{" "}
                            {/* Indicate total number */}
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
