import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";
import "./profile.css";
import logoUrl from "../../assets/images/heros.png";
import { useState, useRef, useEffect } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import logo from "../../assets/images/teenyicons_tick-circle-solid.png";

import { useLocation } from "react-router-dom";
import { formatCurrency } from "../../utils/helper";

function Users(props: any) {
  const location = useLocation();
  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<any>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loadings, setLoadings] = useState(false);
  const [noOfLearners, setNumberOfLearners] = useState(0);
  const [school, setSchool] = useState("");
  console.log(location.state);
  const [Package, setPackage] = useState<any>(location.state.package);
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
    getUsers();
  }, [search, limit, page]);

  // const handlePayment = () => {
  //   // Simulating payment process
  //   setLoadings(true);
  //   setTimeout(() => {
  //     setLoadings(false);
  //     setPaymentSuccess(true);
  //   }, 2000);
  // };

  const getUsers = async () => {
    // let res = await ApiService.getUsers({
    //   page: page,
    //   search: search,
    //   limit: limit,
    // });
    // const pagination = res.pagination;
    // setPagination({
    //   current_page: pagination.current_page,
    //   total: pagination.total,
    //   total_pages: pagination.total_pages,
    //   per_page: pagination.per_page,
    // });
    // setUsers(res.data);
  };
  const getProfile = async () => {
    let res = await ApiService.getProfile({ page: 1, search: "", limit: "" });
    setProfile(res.data);
  };

  const handlePayment = async () => {
    const data = {
      name: school,
      numberOfLearners: noOfLearners,
      packageId: Package._id,
    };
    if (!loading) {
      isLoading(true);
      try {
        let res = await ApiService.createSubscription(data);

        await reset();
        isLoading(false);
        setDialog(false);

        setPaymentSuccess(true);

        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        notify.current?.showToast();
      }
    }
  };

  const cancel = (record: any) => {
    setGroup([""]);
    reset(record);
    setDialog(false);
  };

  return (
    <>
      <div className=" min-h-[70vh]  grid divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl border border-gray-100  dark:border-gray-700 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2 mt-10">
        <div className="group relative  dark:bg-gray-800 transition h m-4 ">
          <form className="validate-form">
            <div className="  p-5  mt-10  rounded-xl">
              <h2 className=" text-3xl font-bold intro-x">Generate A Quote</h2>
              <h3 className=" text-2xl font-bold intro-x">
                You are about to subscribe to {Package.name}
              </h3>
              <p className="mt-5 text-xl">
                Please provide the following details:
              </p>
              <div className="col-span-12 sm:col-span-12 mt-5">
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  School Name
                </FormLabel>
                <FormInput
                  {...register("name")}
                  type="text"
                  name="name"
                  onChange={(e: any) => setSchool(e.target.value)}
                  className={errors.firstName ? "border-danger" : ""}
                  placeholder="St.Marys"
                />
                {errors.name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.name.message === "string" &&
                      errors.name.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-12 mt-5">
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Number of Learners
                </FormLabel>
                <FormInput
                  {...register("numberOfLearners")}
                  type="text"
                  onChange={(e: any) => {
                    setNumberOfLearners(e.target.value);
                  }}
                  name="numberOfLearners"
                  className={errors.lastName ? "border-danger" : ""}
                  placeholder="Number Of Learners"
                />
                {errors.lastName && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastName.message === "string" &&
                      errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="group relative dark:bg-gray-800 transition  m-4 bg-white  shadow-lg rounded-xl ">
          {!paymentSuccess ? (
            <div className="  p-5 mt-10 text-center  ">
              <div className="mt-10">
                <p className="col-span-12 sm:col-span-6 font-bold ">
                  Price Per Learner
                </p>
                <p>
                  <h3>Ksh: {formatCurrency(Package.pricePerLearner)}</h3>
                </p>
                <div className="mt-10">
                  <h2 className="col-span-12 sm:col-span-6 text-3xl ">
                    {" "}
                    KSH:
                    {formatCurrency(
                      Number(noOfLearners) * Number(Package.pricePerLearner)
                    )}
                  </h2>
                </div>

                <div className=" mt-10">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    Proceed to Payment
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
            </div>
          ) : (
            <div className="  p-10 mt-10 text-center  ">
              <div className="flex justify-center m-5 ">
                <img
                  alt="ACS"
                  className="xl:w-35  md:w-10 xl:w-auto"
                  src={logo}
                />
                {/* <img src="success_image_url"  className="w-48 h-36" alt="" /> */}
              </div>
              <p className="col-span-12 sm:col-span-6 font-bold mt-5 text-m text-green-500">
                Your payment is complete!
                <br /> Thank you for your support.
              </p>
              <div className=" mt-10 ">
                <Button variant="primary" type="submit" disabled={loading}>
                  Print Receipt
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
                <br />
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-2 p-6"
                  disabled={loading}
                >
                  <Link to="/">
                    Proceed
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
          )}
        </div>
      </div>

      <Notification
        getRef={(el) => {
          notify.current = el;
        }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Users;
