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
import { useTour } from "../../TourContext";
import ContentLoader from "react-content-loader";
import CardLoader from "../UserProfile/loader";

function Main() {
  const { setRunTour } = useTour();
  const [pageLoading, setPageLoading] = useState(false);
  const { hasPermission } = useAuth();
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
    setRunTour(true);
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
    isLoading(false);
  };
  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <div className="w-full">
          <CardLoader />
        </div>
      ) : is_admin() ? (
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          <div className="col-span-12 2xl:col-span-9">
            <div className="grid gap-4 sm:gap-6">
              <div className="col-span-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <h2 className="mr-0 sm:mr-5 text-lg font-medium truncate mb-2 sm:mb-0">
                    Dashboard
                  </h2>
                </div>
                {hasPermission("dashboard", "view-stats") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-5">
                    <div className="col-span-1">
                      <div
                        className={clsx(["relative zoom-in"])}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/home/learners");
                        }}
                      >
                        <div className="p-4 sm:p-5 box">
                          <div className="flex flex-wrap items-center">
                            <Lucide
                              icon="Monitor"
                              className="w-6 h-6 sm:w-7 sm:h-7 text-warning mr-2"
                            />
                            <div className="ml-auto">
                              <Tippy
                                as="div"
                                className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                content="12% Higher than last month"
                              >
                                12%{" "}
                                <Lucide
                                  icon="ChevronUp"
                                  className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                                />
                              </Tippy>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                            {dashboards.totalLearners}
                          </div>
                          <div className="mt-1 text-sm sm:text-base text-slate-500">
                            Learners
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div
                        className={clsx(["relative zoom-in"])}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/home/teachers");
                        }}
                      >
                        <div className="p-4 sm:p-5 box">
                          <div className="flex flex-wrap items-center">
                            <Lucide
                              icon="ShoppingCart"
                              className="w-6 h-6 sm:w-7 sm:h-7 text-primary mr-2"
                            />
                            <div className="ml-auto">
                              <Tippy
                                as="div"
                                className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                content="Total Teachers"
                              >
                                <Lucide
                                  icon="ChevronUp"
                                  className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                                />
                              </Tippy>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                            {dashboards.totalTeachers}
                          </div>
                          <div className="mt-1 text-sm sm:text-base text-slate-500">
                            Teachers
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div
                        className={clsx(["relative zoom-in"])}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/home/parents");
                        }}
                      >
                        <div className="p-4 sm:p-5 box">
                          <div className="flex flex-wrap items-center">
                            <Lucide
                              icon="CreditCard"
                              className="w-6 h-6 sm:w-7 sm:h-7 text-pending mr-2"
                            />
                            <div className="ml-auto">
                              <Tippy
                                as="div"
                                className="cursor-pointer bg-danger py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                content="2% Lower than last month"
                              >
                                2%
                                <Lucide
                                  icon="ChevronDown"
                                  className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                                />
                              </Tippy>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                            {dashboards.totalParents}
                          </div>
                          <div className="mt-1 text-sm sm:text-base text-slate-500">
                            Parents
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div
                        className={clsx(["relative zoom-in"])}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/home/tests");
                        }}
                      >
                        <div className="p-4 sm:p-5 box">
                          <div className="flex flex-wrap items-center">
                            <Lucide
                              icon="ShoppingCart"
                              className="w-6 h-6 sm:w-7 sm:h-7 text-primary mr-2"
                            />
                            <div className="ml-auto">
                              <Tippy
                                as="div"
                                className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                content="Total Teachers"
                              >
                                <Lucide
                                  icon="ChevronUp"
                                  className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                                />
                              </Tippy>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                            {dashboards.totalTests}
                          </div>
                          <div className="mt-1 text-sm sm:text-base text-slate-500">
                            Tests
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative col-span-12 home-step-1">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6">
                  {/* Stacked Bar Chart */}
                  <div className="col-span-1 sm:col-span-4 box p-4 sm:p-6">
                    <div className="flex items-center justify-between h-10">
                      <h2 className="text-base sm:text-lg font-medium truncate">
                        Last Per Grade
                      </h2>
                    </div>
                    <div className="mt-6 sm:mt-8 overflow-auto lg:overflow-visible">
                      <StackedBarChart
                        height={250} // Reduced height for smaller screens
                        className="mt-4 -mb-6 w-full"
                        labels={dashboards?.learnerStreamWise?.labels}
                        data={dashboards?.learnerStreamWise?.values}
                      />
                    </div>
                  </div>

                  {/* Parents Section */}
                  <div className="relative col-span-1 sm:col-span-2">
                    <div className="flex items-center h-10">
                      <h2 className="text-base sm:text-lg font-medium truncate">
                        Last Added Parents
                      </h2>
                    </div>
                    <div className="mt-4 sm:mt-5 space-y-3">
                      {dashboards?.parents?.map((parent: any, key: any) => (
                        <div
                          onClick={(e: any) => {
                            navigate("/home/parents/" + parent._id);
                          }}
                          key={key}
                          className="flex items-center px-4 py-3 box zoom-in"
                        >
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                            <img
                              alt={`${parent?.first_name}'s profile`}
                              src={image}
                            />
                          </div>
                          <div className="ml-4 truncate">
                            <div className="font-medium truncate">
                              {parent?.first_name} {parent?.last_name}
                            </div>
                            <div className="text-slate-500 text-xs mt-0.5 truncate">
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
                        className="block w-full py-3 text-center bg-success text-white rounded-md hover:bg-success-dark transition text-sm"
                      >
                        See More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 2xl:col-span-3 home-step-2">
            <div className="2xl:border-l 2xl:pl-4 sm:pl-0">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 2xl:gap-x-0">
                <div className="col-span-1">
                  <div className="flex items-center h-10">
                    <h2 className="text-base sm:text-lg font-medium truncate">
                      Teachers
                    </h2>
                  </div>
                  <div className="mt-2 space-y-3">
                    {dashboards?.teachers?.map((teacher: any, key: any) => (
                      <div
                        key={key}
                        onClick={() => navigate("/home/teacher/" + teacher._id)}
                      >
                        <div className="flex items-center px-4 py-3 box zoom-in">
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                            <img
                              alt="Midone Tailwind HTML Admin Template"
                              src={logo}
                            />
                          </div>
                          <div className="ml-4 truncate">
                            <div className="font-medium truncate">
                              {teacher?.firstname} {teacher?.lastname}
                            </div>
                            <div className="text-slate-500 text-xs mt-0.5 truncate">
                              {teacher?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <a
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("/home/teachers");
                      }}
                      className="block w-full py-3 text-center border bg-success text-white rounded-md hover:bg-success-dark transition text-sm"
                    >
                      See More
                    </a>
                  </div>
                </div>
                <div className="col-span-1 home-step-3">
                  <div className="relative before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70">
                    <Tab.Group className="p-4 sm:p-5 box">
                      <Tab.Panels className="mt-4 sm:mt-6">
                        <Tab.Panel>
                          <div className="relative">
                            <ReportDonutChart
                              height={180} // Reduced height for smaller screens
                              className="mt-3 w-full"
                              learners={[
                                {
                                  value:
                                    dashboards.learners_capacity -
                                    dashboards.totalLearners,
                                  color: "#ff6347",
                                },
                                {
                                  value: dashboards.totalLearners,
                                  color: "#32cd32",
                                },
                              ]}
                            />
                            <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
                              <div className="text-xl sm:text-2xl font-medium text-primary">
                                {dashboards.totalLearners} /{" "}
                                {dashboards.learners_capacity}
                              </div>
                              <div className="text-slate-500 mt-0.5 text-xs sm:text-sm">
                                Learners Enrolled
                              </div>
                            </div>
                          </div>
                          <div className="mx-auto mt-4 sm:mt-5 w-full max-w-xs sm:max-w-sm">
                            <div className="flex items-center mb-2">
                              <div className="w-2 h-2 mr-2 sm:mr-3 rounded-full bg-primary"></div>
                              <span className="text-xs sm:text-sm font-semibold text-slate-600 truncate">
                                Total Learners
                              </span>
                              <span className="ml-auto font-medium text-xs sm:text-sm text-slate-600">
                                {dashboards.totalLearners} /{" "}
                                {dashboards.learners_capacity}
                              </span>
                            </div>
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <span className="text-xs sm:text-sm font-semibold text-slate-600">
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
                              <div className="flex h-2 mb-2 overflow-hidden rounded-lg bg-slate-100">
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
        <div className="col-span-12 mt-2 p-2 sm:p-4">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center h-10">
              <h2 className="mr-0 sm:mr-5 text-lg font-medium truncate mb-2 sm:mb-0">
                Dashboard
              </h2>
            </div>
            <div
              className={clsx(["relative zoom-in", "bg-blue-100 rounded-lg"])}
            >
              <div className="p-2 sm:p-4 xl:p-0">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-full sm:w-3/12 mb-4 sm:mb-0">
                    <img src={image1} alt="" className="w-full h-auto" />
                  </div>
                  <div className="w-full sm:w-9/12 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                      Hello {user?.first_name}, Welcome Back!
                    </h2>
                    <p className="text-gray-800 mb-0 text-base sm:text-lg">
                      Always stay updated in your Teachers portal!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-5">
              <div className="col-span-1">
                <div
                  className={clsx(["relative zoom-in"])}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/home/stream");
                  }}
                >
                  <div className="p-4 sm:p-5 box">
                    <div className="flex flex-wrap items-center">
                      <Lucide
                        icon="ShoppingCart"
                        className="w-6 h-6 sm:w-7 sm:h-7 text-primary mr-2"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="Total Teachers"
                        >
                          <Lucide
                            icon="ChevronUp"
                            className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                      {dashboards.no_streams}
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-slate-500">
                      Streams
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  className={clsx(["relative zoom-in"])}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/home/learners");
                  }}
                >
                  <div className="p-4 sm:p-5 box">
                    <div className="flex flex-wrap items-center">
                      <Lucide
                        icon="Monitor"
                        className="w-6 h-6 sm:w-7 sm:h-7 text-warning mr-2"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="12% Higher than last month"
                        >
                          12%{" "}
                          <Lucide
                            icon="ChevronUp"
                            className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                      {dashboards.totalLearners}
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-slate-500">
                      Learners
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div
                  className={clsx(["relative zoom-in"])}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/home/grade");
                  }}
                >
                  <div className="p-4 sm:p-5 box">
                    <div className="flex flex-wrap items-center">
                      <Lucide
                        icon="ShoppingCart"
                        className="w-6 h-6 sm:w-7 sm:h-7 text-primary mr-2"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-success py-1 sm:py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="Total Teachers"
                        >
                          <Lucide
                            icon="ChevronUp"
                            className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5"
                          />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-medium leading-8">
                      {dashboards.no_learning_areas}
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-slate-500">
                      Learning areas
                    </div>
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
