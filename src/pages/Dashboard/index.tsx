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
  const [loading, isLoading] = useState(false);
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
   
      <div className="price mt-5 ">
        <h2 className="text xl:text-xl sm:text-xl md:text-xl text-left">Please select a pricing plan that works for you</h2>

        <div className=" mt-2 pricess grid grid-cols-1 divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl dark:border-gray-700 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 lg:divide-y-0 xl:grid-cols-3 ">
          <div className="tag1 p-2 m-4 mt-5 ">
            <h1 className="m-5 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold ">
              HERO System
            </h1>
            <p className="ml-5 font-bold"> You get access to:</p>
            <ul className="ml-10 text-sm">
              <li>Online Formative Assessment.</li>
              <li>Online SummativeAssessment.</li>
              <li>Chat features with parents/guardians.</li>
              <li>Branded Termly/AnnualPrintable Reports</li>
            </ul>
            <h1 className="ml-5 mt-5 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold ">1500Ksh</h1>
            <p className="ml-5 text-left text-sm"> (Per Learner Annually)</p>
          </div>
          <div className="tag2 p-2 m-4 mt-3">
            <h1 className="ml-5 mt-2 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold ">
              Evidence <br/>of Learning
            </h1>
            <h2 className="ml-5 mt-2 font-bold "> You get access to:</h2>
            <p className="ml-5">
              Hard copy assessment tool books for all grades with activities for
              all the sub strands plus: A scoring guide, and teacher's
              reflection.
            </p>
            <h2 className="ml-5 mt-2 "> Charges per book:</h2>
            <p className="text-sm ml-5 mb-0"> Pre School</p>
            <h1 className="ml-5  mt-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">250Ksh</h1>
            <p className="text-sm  ml-5"> Lower Primary</p>
            <h1 className="ml-5  mt-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">350Ksh</h1>
            <p className="text-sm  ml-5"> Upper Primary</p>
            <h1 className="ml-5  m-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">500Ksh</h1>
            <p className="text-sm  ml-5"> Junior Secondary</p>
            <h1 className="ml-5 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">600Ksh</h1>
          </div>
          <div className="tag3 p-2 m-4 ">
            <h1 className="mt-2 ml-8 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold">
              HERO<br/> All in One
            </h1>
            <h2 className="ml-8 xl:text-xl sm:text-xl md:text-xl"> (Recommended)</h2>
            <p className="ml-5 mt-5 font-bold"> You get access to:</p>
            <ul className="ml-10 text-sm">
              <li>Online Formative Assessment.</li>
              <li>Online SummativeAssessment.</li>
              <li>Chat features with parents/guardians.</li>
              <li>Branded Termly/AnnualPrintable Reports</li>
              <li>
                Hard copy assessment tool books for all grades with activities
                for all the substrands plus: A scoring guide, and teacher's
                reflection.
              </li>
            </ul>
            <h1 className="ml-5 mt-5 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold">3000Ksh</h1>
            <p className="ml-5 text-left text-sm"> (Per Learner Annually)</p>
          </div>
        </div>
        <div className="buttons flex justify-center items-center">
            <div className=" text-center intro-x  xl:text-left">
              <Button
                variant="primary"
                className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
              >
                <Link to="/register">
                 Get A Quote
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Link>
              </Button>
            </div>
            <div className=" text-center intro-x  xl:text-left">
              <Button
                variant="primary"
                className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
              >
                <Link to="/register">
                  View Demo
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Link>
              </Button>
            </div>
          </div>
      </div>
    
    </>
  );
}

export default Main;
