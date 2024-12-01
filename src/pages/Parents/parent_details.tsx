import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";
import { Search } from "lucide-react";
import { formatDate } from "../../utils/helper";
import Tippy from "../../base-components/Tippy";
import avarter from "../../assets/images/parent.jpeg";
import { useParams } from "react-router-dom";
import * as c from "../../utils/constants";
import leanerImg from "../../assets/images/learner.jpeg";
import { useNavigate } from "react-router-dom";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const data = useParams();
  const parent_id = data?.id;
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info

  const [learners, setLearners] = useState([]);
  const [parent, setParent] = useState<any>({});
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup.object({}).required();

  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getParents();
  }, [search, page, limit]);

  const getParents = async () => {
    isLoading(true);

    try {
      const response = await ApiService.getParentsById(parent_id);
      setParent(response.parent);
      setLearners(response.learners);
      isLoading(false);
    } catch (error: any) {
      setMessage("Ooops failed to load");
      isLoading(false);
    }
  };

  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record.groups);
    reset(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };

  return (
    <>
      {dialog ? (
        <>
          <div className="flex items-center mt-8 ">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                reset({ name: "" });
                setDialog(false);
                setIsEditMode(false);
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">
              {isEditMode ? "Edit Parent" : "Add Parent"}
            </h2>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium ">Parents</h2>
          <div className="content">
            {/* Custom Back Button */}
            <a
              onClick={(event) => {
                event.preventDefault();
                navigate(-1); // Navigate to the previous page
              }}
              href="#"
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
              Back
            </a>

            <div className="flex flex-wrap">
              {/* Profile Picture and Name Section */}
              <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
                <div className="bg-white shadow-md m-4 rounded-lg overflow-hidden ">
                  <div className="p-6">
                    {/* <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + parent?.photo}
                                  alt="parent"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div> */}
                    <img
                      src={c.IMG_URL + parent?.photo}
                      alt="photo"
                      className="rounded-full mx-auto"
                      style={{ width: "90%", height: "90%" }}
                      onError={(e) => (e.currentTarget.src = leanerImg)}
                    />
                    <h3 className="mt-3 text-lg font-semibold">
                      {`${parent?.first_name} ${parent?.surname}`}
                    </h3>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="w-full md:w-3/4 ">
                <div className="bg-white shadow-md rounded-lg  m-4">
                  <div className="p-6">
                    <h4 className="font-bold">Parent's Profile</h4>

                    {/* Tabs for Basic Info and Guardians */}
                    <ul className="flex border-b border-gray-200 mb-4">
                      <li className="mr-2">
                        <button
                          className={`inline-block py-2 px-4 ${
                            activeTab === "basicInfo"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-600 hover:text-blue-600"
                          } font-semibold`}
                          onClick={() => setActiveTab("basicInfo")}
                        >
                          Basic Info
                        </button>
                      </li>

                      <>
                        <li className="mr-2">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "learners"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold`}
                            onClick={() => setActiveTab("learners")}
                          >
                            Learners
                          </button>
                        </li>
                      </>
                    </ul>

                    {/* Tab Content */}
                    <div className="tab-content">
                      {/* Basic Info Tab */}

                      {activeTab === "basicInfo" && (
                        <div className="tab-pane active">
                          <h4 className="font-bold">Bascic Information</h4>

                          <table className="min-w-full border border-gray-200">
                            <tbody>
                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Name
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {`${parent?.first_name} ${parent?.last_name}`}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Email
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {parent?.email || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Phone
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {parent?.phone || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  ID NO
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {parent?.id_no || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  School Code
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {parent?.schoolCode || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Status
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  <div
                                    className={
                                      parent?.status === 0
                                        ? "flex items-center text-danger"
                                        : "flex items-center text-success"
                                    }
                                  >
                                    {parent?.status === 0
                                      ? "Inactive"
                                      : "Active"}
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Created At
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(parent?.createdAt, "DD-MM-YYYY")}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Updated At
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(parent?.updatedAt, "DD-MM-YYYY")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Guardian 1 Tab */}
                      {activeTab === "learners" && (
                        <div className="tab-pane">
                          <h4 className="font-bold">Learners </h4>
                          <Table className="border-spacing-y-[3px] border-separate mt-2">
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap w-10">
                                  No.
                                </Table.Th>

                                <Table.Th className="border-b-0 whitespace-nowrap w-24">
                                  Name
                                </Table.Th>

                                <Table.Th className="border-b-0 whitespace-nowrap w-20">
                                  Adm No
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap w-20">
                                  Nemis
                                </Table.Th>

                                <Table.Th className="border-b-0 whitespace-nowrap w-24">
                                  Session
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap w-24">
                                  Status
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {learners.map((learner: any, key) => (
                                <Table.Tr key={key} className="">
                                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-10">
                                    <span className="font-medium whitespace-nowrap">
                                      {limit * (page - 1) + key + 1}
                                    </span>
                                  </Table.Td>
                                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                    <div className="flex items-center">
                                      <div className="w-9 h-9 ">
                                        <img
                                          src={c.IMG_URL + learner?.photo}
                                          alt="Learner"
                                          className="w-9 h-9 rounded-lg border shadow-md"
                                          onError={(e) =>
                                            (e.currentTarget.src = leanerImg)
                                          }
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <a
                                          href="#"
                                          onClick={() => profileRecord(learner)}
                                          className="font-medium whitespace-nowrap"
                                        >
                                          {learner?.first_name &&
                                            learner?.first_name}
                                          {" " +
                                            learner?.surname +
                                            " " +
                                            learner?.last_name}
                                        </a>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                          {learner?.stream?.grade?.name}{" "}
                                          {learner?.stream?.name}
                                        </div>
                                      </div>
                                    </div>
                                  </Table.Td>

                                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                                    <span className="font-medium whitespace-nowrap">
                                      {learner?.adm_no}
                                    </span>
                                  </Table.Td>
                                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                                    <span className="font-medium whitespace-nowrap">
                                      {learner?.nemis_no}
                                    </span>
                                  </Table.Td>

                                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                                    <span className="font-medium whitespace-nowrap">
                                      {learner?.current_session}
                                    </span>
                                  </Table.Td>
                                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                                    <div
                                      className={
                                        learner?.status == "L"
                                          ? "flex items-center text-primary"
                                          : learner?.status == "D"
                                          ? "flex items-center text-danger"
                                          : "flex items-center text-success"
                                      }
                                    >
                                      {learner?.status == "L" ? "Left" : ""}
                                      {learner?.status == "G"
                                        ? "Graduated"
                                        : ""}
                                      {learner?.status == "P"
                                        ? "In Session"
                                        : ""}
                                      {learner?.status == "D" ? "Disabled" : ""}
                                    </div>
                                  </Table.Td>
                                </Table.Tr>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </div>
                      )}

                      {/* Guardian 2 Tab */}

                      {/* Tab 3 */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* END: Delete Confirmation Modal */}
        </>
      )}
      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed "}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
