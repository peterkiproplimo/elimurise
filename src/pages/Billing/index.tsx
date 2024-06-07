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
import ReportPieChart from "../../components/ReportPieChart";
import ReportDonutChart from "../../components/ReportDonutChart";
import "./dashboard.css";
import logoUrl from "../../assets/images/paypal.svg";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Link, useNavigate } from "react-router-dom";

function Main() {
  const navigate=useNavigate()
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
  const [packages, setPackages] = useState([]);
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
  function generateRandomColor() {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct CSS color string
    const color = `rgb(${red}, ${blue}, ${red})`;

    return color;
  }
  const subscribe=async(data:any)=>{

    navigate("/subscription", {
      state: { package:data },
     
    });
  }
  const getDashboard = async () => {
    try {
      let res = await ApiService.getPackages({});
      setPackages(res.data);
    } catch (error) {
      console.log(error);
    }
    // setFeeds(res.feeds);
    // setEvents(res.events);
    // setQuestions(res.questions);
  };

  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <>
      <div className="price mt-5 ">
        <h2 className="text xl:text-xl sm:text-xl md:text-3xl text-left">
          Please select a pricing plan that works for you
        </h2>
        {packages.length > 0 ? (
          // <div className="mt-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-20 relative m-4">
          //   {packages.map((Package: any, key: any) => (
          //     <div
          //       key={key}
          //       className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col  min-h-[500px] min-h-[400px] text-white"
          //       style={{ backgroundColor: Package.color }}
          //     >
          //       <div>
          //         <h1 className="text-4xl pl-5 pt-8 font-bold mb-2">{Package.name}</h1>
          //         <div className=" mt-2 ">
          //            </div>
          //         <div
          //           className="text-xl  p-5 text-white"
          //           dangerouslySetInnerHTML={{ __html: Package.description }}
          //         />
          //       </div>
          //       <div className=" items-center">
          //         <h1 className="text-3xl  pl-5 pt-5 font-bold mt-2">
          //           Ksh. {Package.pricePerLearner}
          //         </h1>
          //         <p className="text-m  pl-5 text-white">(Per Learner Annually)</p>
          //       </div>
          //       <Button
          //     variant="primary"
          //     className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 m-5"
          //     onClick={()=>subscribe(Package)}
          //   >
             
          //       Buy Now
          //       {loading && (
          //         <LoadingIcon
          //           icon="spinning-circles"
          //           color="white"
          //           className="w-4 h-4 ml-2"
          //         />
          //       )}
             
          //   </Button>
                
          //     </div>
          //   ))}
          // </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 m-4">
  {packages.map((Package: any, key: any) => (
    <div style={{ backgroundColor: Package.color }} key={key} className=" rounded-xl shadow-md flex flex-col text-white">
      <div  className="p-5 rounded-t-xl  z-10 flex flex-col justify-between h-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{Package.name}</h1>
        <p className="text-base" dangerouslySetInnerHTML={{ __html: Package.description }}></p>
      </div>
      <div className="flex flex-col justify-between p-5">
        <div>
          <h2 className="text-lg font-bold">Ksh. {Package.pricePerLearner}</h2>
          <p className="text-sm">(Per Learner Annually)</p>
        </div>
        <Button
          variant="primary"
          className="w-full px-4 py-3 mt-3 xl:w-auto"
          onClick={() => subscribe(Package)}
        >
          Buy Now
          {loading && (
            <LoadingIcon
              icon="spinning-circles"
              color="white"
              className="w-4 h-4 ml-2"
            />
          )}
        </Button>
      </div>
    </div>
  ))}
</div>

        ) : (
          <div className="p-4 mt-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No packages available
            </p>
          </div>
        )}
        {/* <div className="buttons flex justify-center items-center mt-10">
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
        </div> */}
      </div>
    </>
  );
}

export default Main;
