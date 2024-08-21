import { useEffect, useState, useRef } from "react";
import {
  MoreHorizontal,
  FileText,
  Printer,
  Settings,
  Plus,
} from "lucide-react";

import Lucide from "../../base-components/Lucide";
import Pagination from "../../base-components/Pagination";
import studentUrl from "../../assets/images/image.jpeg";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../base-components/Table";
import Tippy from "../../base-components/Tippy";
import clsx from "clsx";
import dayjs from "dayjs";
import image from "../../assets/images/custom.svg";
import student1 from "../../assets/images/st-1.svg";
import student2 from "../../assets/images/st-2.svg";
import student3 from "../../assets/images/st-3.svg";
import student4 from "../../assets/images/st-4.svg";

function Dashboard() {
  interface Learner {
    first_name: string;
    // Add other properties if needed
  }
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [displayMonth, setDisplayMonth] = useState(
    currentDate.format("MMMM YYYY")
  );

  useEffect(() => {
    setDisplayMonth(currentDate.format("MMMM YYYY"));
  }, [currentDate]);

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
  return (
    <main className="flex-1 overflow-y-auto bg-gray-10">
      {/* <div className="container mx-auto px-6 py-8"> */}
      {/* <div className=" rounded-lg shadow-lg p-6">
        <div className= "box flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl font-semibold text-gray-800">
              {currentDate}
            </div>
            <div className="mt-2 text-4xl font-bold text-gray-900">
              Welcome back, {learner?.first_name}
            </div>
            <div className="text-gray-600">
              Always stay updated in your learner's portal
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={studentUrl}
              alt="Welcome Image"
              className="w-24 h-24 rounded-full"
            />
          </div>
        </div>
        <div className="mt-6"> 
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Your Learners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {learners.map((learner: any) => (
              <div
                onClick={() => {
                  localStorage.setItem("learner", JSON.stringify(learner));
                  navigate("/parent/profile", {});
                }}
                key={learner._id}
                className="bg-white rounded-lg overflow-hidden p-5 shadow-lg cursor-pointer"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={studentUrl}
                      alt="Learner Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4 flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-1">
                        {learner?.stream?.grade?.name} {learner?.stream?.name}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {learner?.learner?.first_name}{" "}
                        {learner?.learner?.surname}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className="flex flex-wrap ">
        <div className="w-full xl:w-9/12">
          <div className="flex items-center h-10 intro-y">
            <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
          </div>
          <div
            className={clsx(["relative zoom-in", "bg-blue-100 rounded-lg "])}
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
          <div className="flex m-2 justify-between items-center px-0 border-b-0">
            <h4 className="text-lg font-semibold">Your Courses</h4>
          </div>

          <div className="flex p-2 gap-3">
          
            <div className="w-full md:w-6/12 xl:w-4/12">
            {learners.map((learner: any) => (
              <div>
              <div
                onClick={() => {
                  localStorage.setItem("learner", JSON.stringify(learner));
                  navigate("/v1/profile", {});
                }}
                key={learner._id}
                className={clsx([
                  "relative zoom-in",
                  "bg-purple-100  rounded-lg",
                ])}
                style={{
                  backgroundImage: `url(${student2})`,
                  backgroundPosition: "right bottom",
                  backgroundRepeat: "no-repeat",
                }}
              >
              <div
      
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <span className="badge bg-primary rounded-lg p-2 text-white">
                        Active
                      </span>
                      <span className="badge bg-blue-500 text-white">
                        <i className="fa fa-lock"></i>
                      </span>
                      <span className="badge bg-blue-500 text-white">
                        <i className="fa fa-clock-o"></i>
                      </span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={toggleDropdown}
                        className="text-gray-500 px-2 pt-1 focus:outline-none"
                      >
                        <MoreHorizontal size={24} />
                      </button>
                      {isOpen && (
                        <div className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg">
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <FileText className="mr-2" size={20} /> Import
                          </a>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <FileText className="mr-2" size={20} /> Export
                          </a>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <Printer className="mr-2" size={20} /> Print
                          </a>
                          <div className="dropdown-divider border-t my-2"></div>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <Settings className="mr-2" size={20} /> Settings
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="mt-6 mb-1 text-lg font-semibold">
                        {learner?.learner?.first_name}{" "}
                        {learner?.learner?.surname}
                  </h4>
                  <p className="text-gray-500 text-xs">
                  {learner?.stream?.grade?.name} {learner?.stream?.name}
                  </p>
                </div>
              </div>
            </div>

            </div>
             ))}
            {/* <div className="w-full md:w-6/12 xl:w-4/12">
              <div
                className={clsx([
                  "relative zoom-in",
                  "bg-purple-200  rounded-lg",
                ])}
                style={{
                  backgroundImage: `url(${student3})`,
                  backgroundPosition: "right bottom",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <span className="badge bg-primary rounded-lg p-2 text-white">
                        Active
                      </span>
                      <span className="badge bg-blue-500 text-white">
                        <i className="fa fa-lock"></i>
                      </span>
                      <span className="badge bg-blue-500 text-white">
                        <i className="fa fa-clock-o"></i>
                      </span>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={toggleDropdown}
                        className="text-gray-500 px-2 pt-1 focus:outline-none"
                      >
                        <MoreHorizontal size={24} />
                      </button>
                      {isOpen && (
                        <div className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg">
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <FileText className="mr-2" size={20} /> Import
                          </a>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <FileText className="mr-2" size={20} /> Export
                          </a>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <Printer className="mr-2" size={20} /> Print
                          </a>
                          <div className="dropdown-divider border-t my-2"></div>
                          <a
                            className="dropdown-item p-2 hover:bg-gray-100 flex items-center"
                            href="#"
                          >
                            <Settings className="mr-2" size={20} /> Settings
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="mt-6 mb-1 text-lg font-semibold">
                    IT &amp; Software
                  </h4>
                  <p className="text-gray-500 text-xs">45 Days Left</p>
                </div>
              </div>
            </div> */}
            
            {/* <div className="w-full md:w-6/12 xl:w-3/12">
  <div
    className={clsx([
      "relative zoom-in",
      "bg-purple-100  rounded-lg" ])}
    style={{
      backgroundImage:  `url(${student4})`,
      backgroundPosition: "right bottom",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="badge bg-primary rounded-lg p-2 text-white">Active</span>
          <span className="badge bg-blue-500 text-white">
            <i className="fa fa-lock"></i>
          </span>
          <span className="badge bg-blue-500 text-white">
            <i className="fa fa-clock-o"></i>
          </span>
        </div>
        <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-500 px-2 pt-1 focus:outline-none"
      >
        <MoreHorizontal size={24} />
      </button>
      {isOpen && (
        <div className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg">
          <a className="dropdown-item p-2 hover:bg-gray-100 flex items-center" href="#">
            <FileText className="mr-2" size={20} /> Import
          </a>
          <a className="dropdown-item p-2 hover:bg-gray-100 flex items-center" href="#">
            <FileText className="mr-2" size={20} /> Export
          </a>
          <a className="dropdown-item p-2 hover:bg-gray-100 flex items-center" href="#">
            <Printer className="mr-2" size={20} /> Print
          </a>
          <div className="dropdown-divider border-t my-2"></div>
          <a className="dropdown-item p-2 hover:bg-gray-100 flex items-center" href="#">
            <Settings className="mr-2" size={20} /> Settings
          </a>
        </div>
      )}
    </div>

      </div>
      <h4 className="mt-6 mb-1 text-lg font-semibold">IT &amp; Software</h4>
      <p className="text-gray-500 text-xs">45 Days Left</p>
    </div>
  </div>
</div> */}</div>
          </div>
        </div>

        <div className="w-full xl:w-3/12">
          <div className="ml-4 p-4 relative border border-gray-200 bg-white rounded-lg w-full h-[490px]">
            <div className="relative">
              <div className="flex justify-center gap-10 mb-4">
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
                  className={`p-4 ${day ? "bg-gray-50" : "bg-transparent"} ${
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
      </div>

      <div className="col-span-12 2xl:col-span-9">
        <div className="grid  gap-6">
          {/* <div className="col-span-12 mt-8 xl:col-span-12">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
              </div>
              <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div
                    className={clsx([
                      "relative zoom-in",
                      "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                    ])}
                  >
                    <div className="p-5 box">
                      <div className="flex">
                        <Lucide
                          icon="Monitor"
                          className="w-[28px] h-[28px] text-warning"
                        />
                        <div className="ml-auto">
                          <Tippy
                            as="div"
                            className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                            content="12% Higher than last month"
                          >
                            12%{" "}
                            <Lucide
                              icon="ChevronUp"
                              className="w-4 h-4 ml-0.5"
                            />
                          </Tippy>
                        </div>
                      </div>
                      <div className="mt-6 text-3xl font-medium leading-8">
                        {dashboard.totalLearners}
                      </div>
                      <div className="mt-1 text-base text-slate-500">
                        Learners
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div
                    className={clsx([
                      "relative zoom-in",
                      "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                    ])}
                  >
                    <div className="p-5 box">
                      <div className="flex">
                        <Lucide
                          icon="ShoppingCart"
                          className="w-[28px] h-[28px] text-primary"
                        />
                        <div className="ml-auto">
                          <Tippy
                            as="div"
                            className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                            content="Total Teachers"
                          >
                            <Lucide
                              icon="ChevronUp"
                              className="w-4 h-4 ml-0.5"
                            />
                          </Tippy>
                        </div>
                      </div>
                      <div className="mt-6 text-3xl font-medium leading-8">
                        {dashboard.totalTeachers}
                      </div>
                      <div className="mt-1 text-base text-slate-500">
                        Teachers
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div
                    className={clsx([
                      "relative zoom-in",
                      "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                    ])}
                  >
                    <div className="p-5 box">
                      <div className="flex">
                        <Lucide
                          icon="CreditCard"
                          className="w-[28px] h-[28px] text-pending"
                        />
                        <div className="ml-auto">
                          <Tippy
                            as="div"
                            className="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                            content="2% Lower than last month"
                          >
                            2%
                            <Lucide
                              icon="ChevronDown"
                              className="w-4 h-4 ml-0.5"
                            />
                          </Tippy>
                        </div>
                      </div>
                      <div className="mt-6 text-3xl font-medium leading-8">
                        {dashboard.totalParents}
                      </div>
                      <div className="mt-1 text-base text-slate-500">
                        Parents
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <div
                    className={clsx([
                      "relative zoom-in",
                      "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                    ])}
                  >
                    <div className="p-5 box">
                      <div className="flex">
                        <Lucide
                          icon="ShoppingCart"
                          className="w-[28px] h-[28px] text-primary"
                        />
                        <div className="ml-auto">
                          <Tippy
                            as="div"
                            className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                            content="Total Teachers"
                          >
                            <Lucide
                              icon="ChevronUp"
                              className="w-4 h-4 ml-0.5"
                            />
                          </Tippy>
                        </div>
                      </div>
                      <div className="mt-6 text-3xl font-medium leading-8">
                        {dashboard.totalTeachers}
                      </div>
                      <div className="mt-1 text-base text-slate-500">Exams</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          <div className="relative col-span-12 2xl:col-span-9">
            <div className="grid grid-cols-12 gap-6">
              <div className="relative col-span-12 2xl:col-span-12">
                <div className="items-center block h-10 intro-y sm:flex">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Last Added Learners
                  </h2>
                  <div className="flex items-center mt-3 sm:ml-auto sm:mt-0">
                    {/* <Button className="flex items-center !box text-slate-600 dark:text-slate-300">
                        <Lucide
                          icon="FileText"
                          className="hidden w-4 h-4 mr-2 sm:block"
                        />
                        Export to Excel
                      </Button>
                      <Button className="flex items-center ml-3 !box text-slate-600 dark:text-slate-300">
                        <Lucide
                          icon="FileText"
                          className="hidden w-4 h-4 mr-2 sm:block"
                        />
                        Export to PDF
                      </Button> */}
                  </div>
                </div>
                <div className="mt-8 overflow-auto intro-y lg:overflow-visible sm:mt-0">
                  <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          IMAGES
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          STUDENT NAME
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          ADM NO.
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          NEMIS NO.
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          STATUS
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          CREATED AT
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {dashboard?.learners?.map((learner: any, key: any) => (
                        <Table.Tr key={key} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="flex">
                              <div className="w-10 h-10 image-fit zoom-in">
                                <Tippy
                                  as="img"
                                  alt="Midone Tailwind HTML Admin Template"
                                  className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                  // src={
                                  //   learner?.photo
                                  //     ? c.IMG_URL + learner?.photo
                                  //     : logo
                                  // }
                                  content={`Uploaded at ${learner?.dates}`}
                                />
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <a
                              href="/learners"
                              className="font-medium whitespace-nowrap"
                            >
                              {learner?.first_name} {learner?.last_name}
                            </a>
                            {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            {learner.adm_no}
                          </div> */}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {learner.adm_no}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {learner.nemis_no}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div
                              className={clsx([
                                "flex items-center justify-center",
                                { "text-success": learner?.status },
                                { "text-danger": !learner?.status },
                              ])}
                            >
                              <Lucide
                                icon="CheckSquare"
                                className="w-4 h-4 mr-2"
                              />
                              {learner?.status ? "Active" : "Inactive"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                              <span className="font-medium whitespace-nowrap">
                                {new Date(learner?.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    timeZone: "Africa/Nairobi", // Set to the Kenyan time zone
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    // hour: "2-digit",
                                    // minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}

export default Dashboard;
