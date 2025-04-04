import _ from "lodash";
import clsx from "clsx";
import { useRef, useEffect, useState } from "react";
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
import { IMG_URL } from "../../utils/constants";

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
  }

  const [transfers, setTransfers] = useState([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, isLoading] = useState(true);
  const [approveTransfer, setApproveTransfer] = useState<any>({
    id: "",
    phone: "",
  });
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
  const navigate = useNavigate();

  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const getParentNotifications = async () => {
    try {
      const type = localStorage.getItem("type");
      const response =
        type === "parent"
          ? await ApiService.getParentNotifications({ page: 1 })
          : await ApiService.getSchoolNotifications({ page: 1 });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    getParentNotifications();
  }, []);

  useEffect(() => {
    getLearners();
  }, []);

  const getLearners = async () => {
    try {
      const response = await ApiService.parentDashboard();
      setLearners(response.learners);
    } catch (error) {
      console.error("Error fetching learners:", error);
    }
  };

  useEffect(() => {
    getTransfers();
  }, [search, page, limit]);

  const getTransfers = async () => {
    isLoading(true);
    try {
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
    } catch (error) {
      console.error("Error fetching transfers:", error);
    } finally {
      isLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {/* BEGIN: Notification */}
            <div className="col-span-12 mt-6 -mb-6"></div>
            {/* END: Notification */}
            {/* BEGIN: General Report */}
            <div className="col-span-12 mt-2 lg:col-span-12 xl:col-span-12">
              <div>
                <div className="flex items-center h-10">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Dashboard
                  </h2>
                </div>
                <div
                  className={clsx([
                    "relative zoom-out",
                    "bg-blue-100 rounded-md",
                  ])}
                >
                  <div className="p-0 xl:p-0">
                    <div className="flex flex-wrap items-center">
                      <div className="w-full lg:w-3/12">
                        <img src={image} alt="" />
                      </div>
                      <div className="w-full lg:w-9/12">
                        <h2 className="text-3xl font-bold">
                          Hello {learner?.first_name}, Welcome Back!
                        </h2>
                        <p className="text-gray-800 mb-0 text-lg">
                          Always stay updated on your child's academic progress!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-center h-10">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    General Report
                  </h2>
                </div>
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
                        className="relative cursor-pointer bg-white-100 rounded-lg box overflow-hidden flex items-center max-h-[150px]"
                      >
                        <div className="flex-1 p-4">
                          <h4 className="mt-10 mb-1 text-xl font-semibold truncate">
                            {learner?.first_name} {learner?.surname}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            {learner?.stream?.grade?.name}{" "}
                            {learner?.stream?.name}
                          </p>
                          <p
                            className={
                              learner?.status !== "D"
                                ? "flex items-center text-success"
                                : "flex items-center text-danger"
                            }
                          >
                            {learner?.status === "D" ? "Deactivated" : "Active"}
                          </p>
                        </div>
                        <div className="w-32 h-full flex items-center justify-center">
                          <img
                            src={IMG_URL + learner.photo}
                            alt={`${learner?.first_name} ${learner?.surname}`}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* END: General Report */}
            {/* BEGIN: Student Transfers */}
            <div className="col-span-12">
              <div className="items-center block h-10 sm:flex">
                <h2 className="mr-5 ml-2 text-lg font-medium truncate">
                  Student Transfers
                </h2>
              </div>
              <div className="mt-5 overflow-auto lg:overflow-visible sm:mt-0">
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
                    {transfers.map((transfer: any, key) => (
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
                                {transfer?.learner?.first_name &&
                                  transfer?.learner?.first_name}
                                {" " +
                                  transfer?.learner?.surname +
                                  " " +
                                  transfer?.learner?.last_name}
                              </a>
                              <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                {transfer?.stream?.grade?.name}{" "}
                                {transfer?.stream?.name}
                              </div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {transfer?.learner?.adm_no}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {transfer?.transferCode}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            <div className="ml-0">
                              {transfer?.oldSchool?.name}
                            </div>
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span
                            className={clsx([
                              "font-medium whitespace-nowrap",
                              transfer?.paymentStatus === "pending"
                                ? "text-green-500"
                                : "text-red-500",
                            ])}
                          >
                            {transfer?.paymentStatus}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span
                            className={clsx([
                              "font-medium whitespace-nowrap",
                              transfer?.approvalStatus === "pending"
                                ? "text-green-500"
                                : "text-red-500",
                            ])}
                          >
                            {transfer?.approvalStatus}
                          </span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                          <span className="font-medium whitespace-nowrap">
                            {transfer?.reason}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
            {/* END: Student Transfers */}
          </div>
        </div>
        <div className="col-span-12 2xl:col-span-3">
          <div className="pb-10 -mb-10 2xl:border-l">
            <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
              {/* BEGIN: Notifications */}
              <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto">
                <div className="flex items-center h-10">
                  <h2 className="mr-5 text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                </div>
                <div className="box p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.slice(0, 3).map((notification: any) => (
                        <div
                          key={notification._id}
                          className="p-4 mb-3 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-600"
                          onClick={() => setSelectedNotification(notification)}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                              {notification.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                      {notifications.length > 3 && (
                        <div className="mt-4 text-center">
                          <Link to="/parent/noticeboard">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                              View More
                            </Button>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                      No notifications available
                    </p>
                  )}
                </div>
              </div>
              {/* END: Notifications */}
              {/* BEGIN: Learners Chart */}
              <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="relative before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70">
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
                            </span>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
              {/* END: Learners Chart */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
