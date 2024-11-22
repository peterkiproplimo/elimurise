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
import { useNavigate } from "react-router-dom";
import leanerImg from "../../assets/images/learner.jpeg";
import { is_admin } from "../../utils/helper";
import image1 from "../../assets/images/custom.svg";
import StackedBarChart from "../../components/VerticalBarChart";

function Main() {
  interface Learner {
    first_name: string;
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
  const [loading, isLoading] = useState(true);
  const [dashboards, setDashboards] = useState<any>({});
  const [chartData, setChartData] = useState({
    data: [],
    labels: [],
  });

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
    setDashboards({ ...res.data });
    // console.log(grading);
    isLoading(false);
  };
  const navigate = useNavigate();

  return (
    <>
      {is_admin() ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 2xl:col-span-9">
            <div className="grid  gap-6">
              <div className="col-span-12  xl:col-span-12">
                <div className="flex items-center  ">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Dashboard
                  </h2>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5">
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 ">
                    <div
                      className={clsx(["relative zoom-in"])}
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default anchor behavior
                        navigate("/home/learners"); // Navigate using your custom function
                      }}
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
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 ">
                    <div
                      className={clsx(["relative zoom-in"])}
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default anchor behavior
                        navigate("/home/teachers"); // Navigate using your custom function
                      }}
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
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 ">
                    <div
                      className={clsx(["relative zoom-in"])}
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default anchor behavior
                        navigate("/home/parents"); // Navigate using your custom function
                      }}
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
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 ">
                    <div
                      className={clsx(["relative zoom-in"])}
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default anchor behavior
                        navigate("/home/tests"); // Navigate using your custom function
                      }}
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
                          Tests
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative col-span-12">
                <div className="grid grid-cols-6 gap-4">
                  {/* Stacked Bar Chart */}
                  <div className="relative col-span-4 box p-6">
                    <div className="flex items-center justify-between h-10">
                      <h2 className="text-lg font-medium truncate">
                        Last Per Grade
                      </h2>
                    </div>
                    <div className="mt-8 overflow-auto lg:overflow-visible">
                      <StackedBarChart
                        height={325}
                        className="mt-4 -mb-6"
                        labels={dashboards?.learnerStreamWise?.labels}
                        data={dashboards?.learnerStreamWise?.values}
                      />
                    </div>
                  </div>

                  {/* Parents Section */}
                  <div className="relative col-span-2 ">
                    <div className="flex items-center h-10">
                      <h2 className="text-lg font-medium truncate">
                        Last Added Parents
                      </h2>
                    </div>
                    <div className="mt-5">
                      {dashboards?.parents?.map((parent: any, key: any) => (
                        <div
                          key={key}
                          className="flex items-center px-5 py-3 mb-3 box zoom-in"
                        >
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                            <img
                              alt={`${parent?.first_name}'s profile`}
                              src={image}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">
                              {parent?.first_name} {parent?.last_name}
                            </div>
                            <div className="text-slate-500 text-xs mt-0.5">
                              {parent?.email}
                            </div>
                          </div>
                        </div>
                      ))}
                      <a
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/home/parents");
                        }}
                        className="block w-full py-3 text-center bg-success text-white rounded-md hover:bg-success-dark transition"
                      >
                        See More
                      </a>
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
                  <div className="flex items-center h-10 ">
                    <h2 className=" text-lg font-medium truncate">Teachers</h2>
                  </div>
                  <div className="mt-2">
                    {dashboards?.teachers?.map((teacher: any, key: any) => (
                      <div key={key} className="">
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
                        </div>
                      </div>
                    ))}
                    <a
                      href="#" // The href attribute can be kept for accessibility but won't affect navigation
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default anchor behavior
                        navigate("/home/teachers"); // Navigate using your custom function
                      }}
                      className="block cursor-pointer w-full py-3 text-center border bg-success text-white rounded-md  border-slate-400 dark:border-darkmode-300 text-slate-500"
                    >
                      See More
                    </a>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                  <div className="relative before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70">
                    <Tab.Group className="p-5 box">
                      <Tab.Panels className="mt-6">
                        <Tab.Panel>
                          <div className="relative">
                            {/* Donut Chart with Custom Colors */}
                            <ReportDonutChart
                              height={208}
                              className="mt-3"
                              learners={[
                                {
                                  value:
                                    dashboards.learners_capacity -
                                    dashboards.totalLearners,
                                  color: "#ff6347", // Tomato red for remaining capacity
                                },
                                {
                                  value: dashboards.totalLearners,
                                  color: "#32cd32", // Lime green for current learners
                                },
                              ]}
                            />
                            <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
                              <div className="text-2xl font-medium text-primary">
                                {dashboards.totalLearners} /{" "}
                                {dashboards.learners_capacity}
                              </div>
                              <div className="text-slate-500 mt-0.5 text-sm">
                                Learners Enrolled
                              </div>
                            </div>
                          </div>

                          {/* Learner Status and Capacity Information */}
                          <div className="mx-auto mt-5 w-52 sm:w-auto">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                              <span className="text-sm font-semibold text-slate-600">
                                Total Learners
                              </span>
                              <span className="ml-auto font-medium text-slate-600">
                                {dashboards.totalLearners} /{" "}
                                {dashboards.learners_capacity}
                              </span>
                            </div>

                            {/* Progress Bar with Color Change */}
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">
                                  Progress
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                  {(
                                    (dashboards.totalLearners /
                                      dashboards.learners_capacity) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </div>
                              <div className="flex h-2 mb-2 overflow-hidden mb-4 rounded-lg bg-slate-100">
                                <div
                                  className="flex flex-col justify-center bg-green-500 transition-all text-primary"
                                  style={{
                                    width: `${
                                      (dashboards.totalLearners /
                                        dashboards.learners_capacity) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
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
      ) : (
        <div className="col-span-12 mt-2 lg:col-span-12 xl:col-span-12 p-4">
          <div>
            <div className="flex items-center h-10 ">
              <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
            </div>
            <div
              className={clsx(["relative zoom-in ", "bg-blue-100 rounded-lg "])}
            >
              <div className="p-0 xl:p-0">
                <div className="flex flex-wrap items-center">
                  <div className="w-full lg:w-3/12">
                    <img src={image1} alt="" />
                  </div>
                  <div className="w-full lg:w-9/12">
                    <h2 className="text-3xl  font-bold">
                      Hello {user?.first_name}, Welcome Back!
                    </h2>
                    <p className="text-gray-800 mb-0 text-lg">
                      Always stay updated in your Teachers portal!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
