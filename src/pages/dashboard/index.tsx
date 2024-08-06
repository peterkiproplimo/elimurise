import _ from "lodash";
import clsx from "clsx";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import ReportDonutChart from "../../components/ReportDonutChart";
import LeafletMap from "../../components/LeafletMap";
import { Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import studentUrl from "../../assets/images/woman.jpeg";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { useState, useRef, useEffect } from "react";
import * as c from "../../utils/constants";
import logo from "../../assets/images/teacher.jpeg";
import image from "../../assets/images/parent.jpeg";

function Main() {
  interface Learner {
    firstname: string;
    // Add other properties if needed
  }
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const auth = useAuth();
  const user = auth?.authData?.user as Learner;
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [dashboards, setDashboards] = useState<any>({});
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    isLoading(true);
    let res = await ApiService.schoolDashboard();

    isLoading(false);

    const pagination = res.pagination;
    setPagination({
      current_page: pagination?.current_page,
      total: pagination?.total,
      total_pages: pagination?.total_pages,
      per_page: pagination?.per_page,
    });
    setDashboards(res.data);
    // console.log(grading);
    isLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
          <div className="grid  gap-6">
            <div className="col-span-12 mt-8 xl:col-span-12">
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
                        {dashboards.totalLearners}
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
                        {dashboards.totalTeachers}
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
                        {dashboards.totalParents}
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
                        {dashboards.totalTeachers}
                      </div>
                      <div className="mt-1 text-base text-slate-500">Exams</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="mt-5 intro-y">
                <div className="bg-white p-6 shadow-md rounded-lg flex items-center justify-between ">
                  <div>
                    <div className="text-xl text-gray-500"></div>
                    <div className="mt-2 text-4xl  text-gray-800">
                      Welcome back, {user?.firstname}
                    </div>
                    <div className="text-gray-500 text-xl font-bold">
                      Always stay updated with the current status
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={studentUrl}
                      alt="Welcome Image"
                      className="w-64  "
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="relative col-span-12 2xl:col-span-9">
              <div className="grid grid-cols-12 gap-6">
                <div className="relative col-span-12 2xl:col-span-12">
                  <div className="items-center block h-10 intro-y sm:flex">
                    <h2 className="mr-5 text-lg font-medium truncate">
                      Last Added Leaners
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
                        {dashboards?.learners?.map((learner: any, key: any) => (
                          <Table.Tr key={key} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="flex">
                                <div className="w-10 h-10 image-fit zoom-in">
                                  <Tippy
                                    as="img"
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                    src={
                                      learner?.photo
                                        ? c.IMG_URL + learner?.photo
                                        : logo
                                    }
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
        <div className="col-span-12 2xl:col-span-3 ">
          <div className=" 2xl:border-l">
            <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
              <div className="col-span-12 mt-3 mr-5 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="flex items-center h-10 intro-x">
                  <h2 className=" text-lg font-medium truncate">Teachers</h2>
                </div>
                <div className="mt-2">
                  {dashboards?.teachers?.map((teacher: any, key: any) => (
                    <div key={key} className="intro-x">
                      <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={logo}
                          />
                        </div>
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">
                            {teacher?.firstname} {teacher?.lastname}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {teacher?.email}
                          </div>
                        </div>
                        <div
                          className={clsx({
                            "text-success": teacher?.status,
                            "text-danger": !teacher?.status,
                          })}
                        >
                          {teacher?.status ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    href=""
                    className="block w-full py-3 text-center border bg-success text-white rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                  >
                    See More
                  </a>
                </div>
              </div>

              <div className="col-span-12 mt-2  mr-5 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="flex items-center h-10 intro-x">
                  <h2 className="mr-5 text-lg font-medium truncate">Parents</h2>
                </div>
                <div className="mt-5">
                  {dashboards?.parents?.map((parent: any, key: any) => (
                    <div key={key} className="intro-x">
                      <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={image}
                          />
                        </div>
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">
                            {parent?.first_name} {parent?.last_name}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {parent?.email}
                          </div>
                        </div>
                        <div
                          className={clsx({
                            "text-success": parent?.status,
                            "text-danger": !parent?.status,
                          })}
                        >
                          {parent?.status ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    href=""
                    className="block w-full py-3 text-center border bg-success text-white rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                  >
                    See More
                  </a>
                </div>
              </div>
              {/* <div className="col-span-12 mr-5">
                <div className="mt-5 before:hidden xl:before:block intro-y">
                  <div className="p-5 box">
                    <div className="mt-3">
                      <ReportDonutChart height={196} />
                    </div>
                    <div className="mx-auto mt-8 w-52 sm:w-auto">
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                        <span className="truncate">Ongoing</span>
                        <span className="ml-auto font-medium">60%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                        <span className="truncate">Upcoming</span>
                        <span className="ml-auto font-medium">15%</span>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                        <span className="truncate">Completed</span>
                        <span className="ml-auto font-medium">15%</span>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="w-2 h-2 mr-3 rounded-full bg-danger"></div>
                        <span className="truncate">Out of time</span>
                        <span className="ml-auto font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
