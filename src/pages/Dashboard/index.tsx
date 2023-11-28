import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import * as ApiService from "../../services/auth";
import { formatDate, timeAgo, formatCurrency } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import clsx from "clsx";
import Table from "../../base-components/Table";
import { Link } from "react-router-dom";
import ReportPieChart from "../../components/ReportPieChart";
import ReportDonutChart from "../../components/ReportDonutChart";
import "./dashboard.css";
import logoUrl from "../../assets/images/paypal.svg";
import LoadingIcon from "../../base-components/LoadingIcon";

function Main() {
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };

  const [feeds, setFeeds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setSats] = useState({
    houseLose: 0,
    houseLosses: 0,
    houseRevenue: 0,
    houseWins: 0,
    mpesaBalancepaybill: 0,
    mpesaBalanceb2cTotal: 0,
    totalplayers: 0,
    playersonline: 0,
    walletsTotal: 0,
    withholdingTax: 0,
  });
  useEffect(() => {
    // getDashboard();
  }, []);

  const getDashboard = async () => {
    let res = await ApiService.getDashboard();
    setSats({
      houseLose: res.houseLose.currentDay,
      houseLosses: res.houseLosses.monthlyTotal,
      houseRevenue: res.houseRevenue.currentDay,
      houseWins: res.houseWins.monthlyTotal,
      mpesaBalancepaybill: res.mpesaBalance.paybillTotal,
      mpesaBalanceb2cTotal: res.mpesaBalance.b2cTotal,
      totalplayers: res.players.total,
      playersonline: res.players.onlineToday,
      walletsTotal: res.walletsTotal.grandTotal,
      withholdingTax: res.withholdingTax.total,
    });
    // setFeeds(res.feeds);
    // setEvents(res.events);
    // setQuestions(res.questions);
  };

  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    getTotalUsers();
  }, []);

  const getTotalUsers = async () => {
    try {
      const page = 1; // Specify the page number or use a dynamic value
      const data = { page };
      const response = await ApiService.getLevels(data);
      if (response && response.users) {
        setTotalUsers(response.users.length);
      }
    } catch (error) {
      console.error("Error fetching total number of users:", error);
    }
  };

  return (
    <>
      {/* BEGIN: Important Notes */}
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y box1 ">
          <div className="">
            <Link to="">
              {/* <Link to="/attendees"> */}
              <div className="p-5 box">
                <div className="flex">
                  {/* <Lucide
                    icon="UserCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  /> */}
                  <h2>Schools Registered</h2>
                  <div className="ml-auto">
                    {/* <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy> */}
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  {/* {totalUsers} */}
                  {/* {totalUsers !== null ? totalUsers : "Loading..."} */}

                  <div>
                    <h1>{stats.houseRevenue}</h1>
                  </div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Need Approval{" "}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y box2">
          <div className="">
            <Link to="">
              {/* <Link to="/attendees"> */}

              <div className="p-5 box">
                <div className="flex">
                  {/* <Lucide
                    icon="FileCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  /> */}
                  <h2>Teachers</h2>
                  <div className="ml-auto">
                    {/* <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy> */}
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  <h3>{stats.mpesaBalanceb2cTotal}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">Active</div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y box3">
          <div className="">
            <Link to="">
              {/* <Link to="/attendees"> */}
              <div className="p-5 box">
                <div className="flex">
                  {/* <Lucide
                    icon="FileCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  /> */}
                  <h2>Learners</h2>
                  <div className="ml-auto">
                    {/* <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy> */}
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  {/* {totalUsers} */}
                  {/* {totalUsers !== null ? totalUsers : "Loading..."} */}

                  <div>
                    <h1>{stats.mpesaBalancepaybill}</h1>
                  </div>
                </div>
                <div className="mt-1 text-base text-slate-500">Registered</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: simcard stats */}
        <div className="col-span-8 intro-y money">
          <div className="img">
            <img alt="ACS" className="w-35" src={logoUrl} />
          </div>
          <div>
            <h2>PesaPal Payment</h2>
            <p>Your Account has been credited</p>
          </div>
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button>
              View Payment
              {
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              }
            </Button>
          </div>
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button>
              Mark as Read
              {
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              }
            </Button>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          {/* <div className="flex h-10 intro-y">
            <h2 className="mr-5 text-lg font-medium truncate">
              Players Statistics
            </h2>
          </div> */}
          {/* <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportDonutChart height={290} width={300} />
          </div> */}
        </div>

        {/* END: simcard stats */}
        {/* START: system users */}

        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          {/* <div className="flex h-10 intro-y">
            <h2 className="text-lg font-medium truncate">Games Statistics</h2>
          </div> */}
          {/* <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportPieChart height={290} width={300} />
          </div> */}
        </div>
        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          {/* <div className="flex h-10 intro-y">
            <h2 className="text-lg font-medium truncate">
              Games wins vs loss statistics
            </h2>
          </div> */}
          {/* <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportPieChart height={290} width={300} />
          </div> */}
        </div>
        {/* END: system users */}

        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          {/* <div className="h-12 flex intro-x">
            <h2 className="mr-auto text-lg font-medium truncate">
              Important Announcements
            </h2>
            <Button
              data-carousel=" important-notes"
              data-target="prev"
              className="px-2 mr-2 border-slate-300 text-slate-600 dark:text-slate-300"
              onClick={prevImportantNotes}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Button>
            <Button
              data-carousel="important-notes"
              data-target="next"
              className="px-2 mr-2 border-slate-300 text-slate-600 dark:text-slate-300"
              onClick={nextImportantNotes}
            >
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Button>
          </div> */}
          <div className="intro-x">
            <div className="mt-2 intro-x ">
              <div className=" box zoom-in">
                <div className=" slide ">
                  {feeds.length > 0 && (
                    <TinySlider
                      getRef={(el) => {
                        importantNotesRef.current = el;
                      }}
                    >
                      {feeds.map((feed: any, key) => (
                        <div className="p-5" key={key}>
                          <div className="text-base font-medium truncate">
                            {feed.feed}
                          </div>
                          <div className="mt-1 text-slate-400">
                            {timeAgo(feed.createdAt)}
                          </div>
                          <div
                            className="mt-1 text-justify text-slate-500"
                            dangerouslySetInnerHTML={{
                              __html: feed.description,
                            }}
                          />
                        </div>
                      ))}
                    </TinySlider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BEGIN: Recent Activities */}
        <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6">
          {/* <div className="flex h-10 intro-x">
            <h2 className="mr-5 text-lg font-medium truncate">
              Recent Questions
            </h2>
          </div> */}
          <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
            {questions.map((question: any, key) => (
              <div
                key={key}
                className="relative flex items-center mb-3 intro-x"
              >
                <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                  <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                    <img
                      alt=""
                      src={question.userId && question.userId.profileImage}
                    />
                  </div>
                </div>
                <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                  <div className="flex items-center">
                    <div className="font-medium">{question.eventId?.name}</div>
                    <div className="ml-auto text-xs text-slate-500">
                      {timeAgo(question.createdAt)}
                    </div>
                  </div>
                  <div className="mt-1 text-slate-500">{question.question}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* END: Recent Activities */}
        {/* BEGIN: Events */}
        <div className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-6">
          {/* <div className="flex h-10 intro-x">
            <h2 className="mr-5 text-lg font-medium truncate">
              Upcoming Events
            </h2>

            <Link to="/events"> Show More</Link>
          </div> */}
          <Table className="border-spacing-y-[10px] border-separate mt-1 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
            <Table.Tbody>
              {events &&
                events.map((event: any, key) => (
                  <Table.Tr key={key} className="intro-x">
                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <Link
                        to="/event"
                        state={{ event: event }}
                        className="font-medium "
                      >
                        {event.name}
                      </Link>
                      <div className="text-slate-500  mt-3">
                        <b>Venue</b> {event.venue} <b>Date</b>{" "}
                        {formatDate(event.startTime, "DD MMM YYYY hh:mmA") +
                          " - " +
                          formatDate(event.endTime, "DD MMM YYYY hh:mmA")}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Events */}
      </div>
    </>
  );
}

export default Main;
