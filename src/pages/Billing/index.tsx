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
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Menu from "../../base-components/Headless/Menu";

function Main() {
  const navigate = useNavigate();
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };
  const [pdfUrl, setPdfUrl] = useState("");

  const [loading, isLoading] = useState(true);
  const [feeds, setFeeds] = useState([]);
  const [success, setSuccess] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [invoices, setSubscription] = useState([]);
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
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

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
  const subscribe = async (data: any) => {
    navigate("/home/subscription", {
      state: { package: data },
    });
  };
  const getSubscriptions = async () => {
    isLoading(true);
    try {
      let res = await ApiService.getSubscriptions({});
      setSubscription(res.invoices);
    } catch (error) {
      console.log(error);
    }
    isLoading(false);
    // setFeeds(res.feeds);
    // setEvents(res.events);
    // setQuestions(res.questions);
  };

  useEffect(() => {
    getSubscriptions();
  }, []);
  const generateInvoicePrint = async (data: any) => {
    isLoading(true);

    isLoading(true);
    try {
      let res = await ApiService.getPrintSubscription(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      setPdfUrl(url);
      // setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      // setMessage(error.message);
      // notify.current?.showToast();
    }
  };
  const generateInvoice = async (data: any) => {
    isLoading(true);

    isLoading(true);
    try {
      let res = await ApiService.getPrintSubscription(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "Elimurise invoice.pdf"; // Set the download name

      // Programmatically trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Free up memory

      setPdfUrl(url);
      // setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      // setMessage(error.message);
      // notify.current?.showToast();
    }
  };

  return (
    <>
      <div className="price mt-5 ">
        <h2 className="text xl:text-xl sm:text-xl md:text-3xl text-left ml-5 ">
          Invoices
        </h2>
        {loading ? (
          <div className="flex flex-col items-center mt-5">
            <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
          </div>
        ) : invoices?.length > 0 ? (
          <div className="col-span-12 overflow-x-auto overflow-y-visible  2xl:overflow-visible">
            <Table className="border-spacing-y-[3px] border-separate mt-2 ">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    No.
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Invoice ID
                  </Table.Th>

                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Invoice Period
                  </Table.Th>

                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Invoice Amount
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Outstanding Amount
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Invoice Due Date
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Status
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((invoice: any, key) => (
                  <Table.Tr key={key} className="">
                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        {(page - 1) * limit + key + 1}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        {invoice.erpnext_invoice_id}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        {new Date(
                          invoice.invoice_period_start_date
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          invoice.invoice_period_end_date
                        ).toLocaleDateString()}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        KES{" "}
                        {formatCurrency(invoice.invoice_amount.$numberDecimal)}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        KES{" "}
                        {formatCurrency(
                          invoice.outstanding_amount.$numberDecimal
                        )}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="font-medium whitespace-nowrap">
                        {new Date(invoice.invoice_due_ts).toLocaleDateString()}
                      </span>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <div
                        className={
                          invoice.outstanding_amount.$numberDecimal === "0" // Assuming paid invoices have outstanding amount 0
                            ? "flex items-center text-success"
                            : "flex items-center text-danger"
                        }
                      >
                        {invoice.outstanding_amount.$numberDecimal === "0"
                          ? "Paid"
                          : "Un Paid"}
                      </div>
                    </Table.Td>

                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                      <div className="flex items-center justify-center">
                        <Menu className="flex items-center justify-center">
                          <Menu.Item
                            onClick={() => generateInvoicePrint(invoice)}
                          >
                            <Lucide icon="Printer" className="w-4 h-4 mr-2" />{" "}
                          </Menu.Item>
                          <Menu.Item onClick={() => generateInvoice(invoice)}>
                            <Lucide icon="Download" className="w-4 h-4 mr-2" />{" "}
                          </Menu.Item>
                        </Menu>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : (
          <div className="p-4 mt-5 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-lg text-gray-700 dark:text-gray-300 ">
              No Invoices available
            </p>
          </div>
        )}
        {/* <div className="buttons flex justify-center items-center mt-10">
          <div className=" text-center   xl:text-left">
            <Button
              variant="primary"
              className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
            >
              <Link to="/auth/register">
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
          <div className=" text-center   xl:text-left">
            <Button
              variant="primary"
              className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
            >
              <Link to="/auth/register">
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
