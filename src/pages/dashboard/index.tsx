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

// Define interfaces for timetable data
interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  isFixed?: boolean;
  name?: string;
}

interface Period {
  type: "learning_area" | "special" | "Free";
  learning_area?: { name: string };
  specialPeriod?: { name: string };
  stream?: { name: string; grade: string };
}

interface TimetableDay {
  [day: string]: Array<{ timeSlot: TimeSlot; period: Period }>;
}

interface Timetable {
  timetable: TimetableDay;
}

interface UpcomingClass {
  day: string;
  timeSlot: TimeSlot;
  period: Period;
}

function Main() {
  const { setRunTour } = useTour();
  const [pageLoading, setPageLoading] = useState(false);
  const { hasPermission, authData } = useAuth();
  interface Learner {
    first_name: string;
  }
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const user = authData?.user as Learner;
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [dashboards, setDashboards] = useState<any>({});
  const [chartData, setChartData] = useState({
    data: [],
    labels: [],
  });
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setRunTour(true);
    getDashboard();
    if (!is_admin()) {
      fetchUpcomingClasses();
    }
  }, []);

  const getDashboard = async () => {
    isLoading(true);
    try {
      const res = await ApiService.schoolDashboard();
      const pagination = res.pagination;
      setPagination({
        current_page: pagination?.current_page,
        total: pagination?.total,
        total_pages: pagination?.total_pages,
        per_page: pagination?.per_page,
      });
      setDashboards({ ...res.data });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      isLoading(false);
    }
  };

  const fetchUpcomingClasses = async () => {
    setTimetableLoading(true);
    try {
      const response = await ApiService.getTimetableTeacher({});
      const timetables: Timetable[] = response.timetables || [];
      const days: string[] = response.days || [];

      // Get current day and time
      const now = new Date();
      const currentDay = now.toLocaleString("en-US", { weekday: "long" });
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      // Filter upcoming classes
      let upcoming: UpcomingClass[] = [];
      const maxClasses = 3; // Show up to 3 upcoming classes

      // First, try to find classes for today after the current time
      if (days.includes(currentDay)) {
        const todayClasses = timetables
          .flatMap(({ timetable }) =>
            timetable[currentDay]
              ?.filter(
                (slot) =>
                  slot.period.type !== "Free" &&
                  slot.timeSlot.startTime > currentTime
              )
              .map((slot) => ({
                day: currentDay,
                timeSlot: slot.timeSlot,
                period: slot.period,
              }))
          )
          .sort((a, b) =>
            a.timeSlot.startTime.localeCompare(b.timeSlot.startTime)
          );

        upcoming = todayClasses.slice(0, maxClasses);
      }

      // If no classes today or need more, look for the next day's classes
      if (upcoming.length < maxClasses) {
        const nextDayIndex =
          days.indexOf(currentDay) + 1 < days.length
            ? days.indexOf(currentDay) + 1
            : 0;
        const nextDay = days[nextDayIndex];

        if (nextDay) {
          const nextDayClasses = timetables
            .flatMap(({ timetable }) =>
              timetable[nextDay]
                ?.filter((slot) => slot.period.type !== "Free")
                .map((slot) => ({
                  day: nextDay,
                  timeSlot: slot.timeSlot,
                  period: slot.period,
                }))
            )
            .sort((a, b) =>
              a.timeSlot.startTime.localeCompare(b.timeSlot.startTime)
            );

          upcoming = [
            ...upcoming,
            ...nextDayClasses.slice(0, maxClasses - upcoming.length),
          ];
        }
      }

      setUpcomingClasses(upcoming);
    } catch (error) {
      console.error("Error fetching upcoming classes:", error);
    } finally {
      setTimetableLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full">
          <CardLoader />
        </div>
      ) : is_admin() ? (
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Admin dashboard content remains unchanged */}
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
                            Unpublished Tests
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Other admin cards remain unchanged */}
                  </div>
                )}
              </div>
              <div className="relative col-span-12 home-step-1">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6">
                  <div className="col-span-1 sm:col-span-4 box p-4 sm:p-6">
                    <div className="flex items-center justify-between h-10">
                      <h2 className="text-base sm:text-lg font-medium truncate">
                        Last Per Grade
                      </h2>
                    </div>
                    <div className="mt-6 sm:mt-8 overflow-auto lg:overflow-visible">
                      <StackedBarChart
                        height={250}
                        className="mt-4 -mb-6 w-full"
                        labels={dashboards?.learnerStreamWise?.labels}
                        data={dashboards?.learnerStreamWise?.values}
                      />
                    </div>
                  </div>
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
                              height={180}
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
                          content="Total Streams"
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
                          content="Total Learning Areas"
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
                      Learning Areas
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* New Upcoming Classes Section */}
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center h-10">
                <h2 className="text-base sm:text-lg font-medium truncate">
                  Upcoming Classes
                </h2>
              </div>
              <div className="mt-4 sm:mt-5 box p-4 sm:p-5">
                {timetableLoading ? (
                  <div className="text-center text-gray-500">
                    Loading classes...
                  </div>
                ) : upcomingClasses.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingClasses.map((classItem, index) => (
                      <Tippy
                        key={index}
                        as="div"
                        className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        content={`Grade: ${
                          classItem.period.stream?.grade || "N/A"
                        }, Stream: ${classItem.period.stream?.name || "N/A"}`}
                        onClick={() => navigate("/home/timetable-teacher")} // Navigate to full timetable
                      >
                        <div className="flex-none w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <Lucide
                            icon="Clock"
                            className="w-5 h-5 text-teal-600"
                          />
                        </div>
                        <div className="ml-4 flex-1 truncate">
                          <div className="font-medium text-gray-800 truncate">
                            {classItem.period.type === "learning_area"
                              ? classItem.period.learning_area?.name
                              : classItem.period.specialPeriod?.name || "Class"}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {classItem.day}, {classItem.timeSlot.startTime} -{" "}
                            {classItem.timeSlot.endTime}
                          </div>
                        </div>
                        <Lucide
                          icon="ChevronRight"
                          className="w-5 h-5 text-gray-500 ml-2"
                        />
                      </Tippy>
                    ))}
                    <a
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("/home/timetable-teacher");
                      }}
                      className="block w-full py-3 text-center bg-teal-500 text-white rounded-md hover:bg-teal-600 transition text-sm"
                    >
                      View Full Timetable
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    No upcoming classes scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
