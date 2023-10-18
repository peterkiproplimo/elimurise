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
    getDashboard();
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
      const response = await ApiService.getUsers(data);
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
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/attendees"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="UserCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  {/* {totalUsers} */}
                  {/* {totalUsers !== null ? totalUsers : "Loading..."} */}

                  <div>
                    <h1>Ksh {stats.houseRevenue}</h1>
                  </div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Daily House Revenue{" "}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/attendees"> */}

              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="FileCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  <h3>{stats.mpesaBalanceb2cTotal}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Mpesa Balance
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/attendees"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="FileCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.attendees} */}
                  {/* {totalUsers} */}
                  {/* {totalUsers !== null ? totalUsers : "Loading..."} */}

                  <div>
                    <h1>Ksh {stats.mpesaBalancepaybill}</h1>
                  </div>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Paybill Total
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/speakers"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Volume2"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto ">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.speakers} */}
                  <h1>{stats.totalplayers}</h1>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Total Players
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/vendors"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Volume2"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.vendors} */}
                  <h3>{stats.playersonline}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Players Online
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/exhibitors"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="UserCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.exhibitors} */}
                  <h3>Ksh {stats.withholdingTax}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Withholding Tax Total
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/vendors"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="UserCheck"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.vendors} */}
                  <h3>Ksh {stats.walletsTotal.toFixed(2)}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Wallet Total
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/vendors"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Briefcase"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.vendors} */}
                  <h3>{stats.houseWins}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">House Wins</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-3 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-black before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-blue-800/70",
            ])}
          >
            <Link to="">
              {/* <Link to="/vendors"> */}
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Briefcase"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content=""
                    >
                      <Lucide icon="ChevronRight" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {/* {stats.vendors} */}
                  <h3>Ksh {stats.houseLosses}</h3>
                </div>
                <div className="mt-1 text-base text-slate-500">House Loses</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: simcard stats */}

        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          <div className="flex h-10 intro-y">
            <h2 className="mr-5 text-lg font-medium truncate">
              Players Statistics
            </h2>
          </div>
          <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportDonutChart height={290} width={300} />
          </div>
        </div>

        {/* END: simcard stats */}
        {/* START: system users */}

        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          <div className="flex h-10 intro-y">
            <h2 className="text-lg font-medium truncate">Games Statistics</h2>
          </div>
          <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportPieChart height={290} width={300} />
          </div>
        </div>
        <div className="col-span-12 sm:col-span-4 md:col-span-4 lg:col-span-4">
          <div className="flex h-10 intro-y">
            <h2 className="text-lg font-medium truncate">
              Games wins vs loss statistics
            </h2>
          </div>
          <div className="p-5 mt-4 intro-y box padding-top:23 flex justify-center">
            <ReportPieChart height={290} width={300} />
          </div>
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
