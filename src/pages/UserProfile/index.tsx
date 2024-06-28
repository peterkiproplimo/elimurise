import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormSwitch } from "../../base-components/Form";
import Progress from "../../base-components/Progress";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import FileIcon from "../../base-components/FileIcon";
import { Menu, Tab } from "../../base-components/Headless";
import { Tab as HeadlessTab } from "@headlessui/react";
import logo from "../../assets/images/CONTACTS ICON.jpeg"
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import logoUrl from "../../assets/images/heros.png";
import { useState, useRef, useEffect } from "react";
import Notification, {
    NotificationElement,
  } from "../../base-components/Notification";
  import LoadingIcon from "../../base-components/LoadingIcon";
  import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import { useAuth } from "../../contexts/Auth";


function Main() {
  const auth = useAuth();
  const newProductsRef = useRef<TinySliderElement>();
  const newAuthorsRef = useRef<TinySliderElement>();
  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [user, setUser] = useState<any>({});
  const [selectGroup, setGroup] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, isLoading] = useState(false);
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
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
    
    })
    .required();

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
    getProfile();
    getRole();
  }, []);

  useEffect(() => {
    setUser(auth.authData && auth.authData?.user);
  }, [user]);
//   useEffect(() => {
//     getUsers();
//   }, [search, limit, page]);

//   const getUsers = async () => {
//     let res = await ApiService.getUsers({
//       page: page,
//       search: search,
//       limit: limit,
//     });

//     const pagination = res.pagination;
//     setPagination({
//       current_page: pagination.current_page,
//       total: pagination.total,
//       total_pages: pagination.total_pages,
//       per_page: pagination.per_page,
//     });
//     setUsers(res.data);
//   };
  const getProfile = async () => {
    let res = await ApiService.getProfile({ page: 1, search: "", limit: "" });
    console.log("......")
    console.log(res)
    setProfile(res.data);
  };
  const getRole = async () => {
    let res = await ApiService.getRole({ page: 1, search: "", limit: "" });
    setRoles(res.data?.roles);
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.createProfile(data);
        getProfile();
        await reset();
        isLoading(false);
        setDialog(false);
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


  const prevNewProducts = () => {
    newProductsRef.current?.tns.goTo("prev");
  };
  const nextNewProducts = () => {
    newProductsRef.current?.tns.goTo("next");
  };
  const prevNewAuthors = () => {
    newAuthorsRef.current?.tns.goTo("prev");
  };
  const nextNewAuthors = () => {
    newAuthorsRef.current?.tns.goTo("next");
  };

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium"> User Profile </h2>
      </div>
      <Tab.Group>
        {/* BEGIN: Profile Info */}
        <div className="px-5 pt-5 mt-5 intro-y box">
          <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
              <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="rounded-full"
                  src={logo}
                />
              </div>
              <div className="ml-5">
                <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                {user?.firstname + " " + user?.lastname}
                </div>
                {/* <div className="text-slate-500">{fakerData[0].jobs[0]}</div> */}
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Contact Details
              </div>
              <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                <div className="flex items-center truncate sm:whitespace-normal">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Instagram" className="w-4 h-4 mr-2" />
                  {user.phone}
                </div>
               
              </div>
            </div>
           
          </div>
          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="flex items-center py-4 cursor-pointer">
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </Tab.Button>
            </Tab>
            {/* <Tab fullWidth={false}>
              <Tab.Button className="flex items-center py-4 cursor-pointer">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Change Password
              </Tab.Button>
            </Tab> */}
          
          </Tab.List>
        </div>
        {/* END: Profile Info */}
        <Tab.Panels className="mt-5">
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6 ">
              <div className="col-span-12 intro-y box shadow-lg">
                <div className="flex items-center px-5 py-4 border-b border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-medium">Update Profile</h2>
                 
                </div>
                <div id="new-authors" className="py-5 tiny-slider">
                        <form className="validate-form" onSubmit={onSubmit}>
                        <div className=" p-5   grid grid-cols-12 gap-4 gap-y-3 rounded-xl">
                         
                          <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">Full Name </FormLabel>
                            <FormInput
                              type="text"
                              value={user?.firstname + " " + user?.lastname}
                              readOnly={true}
                              placeholder="+254 712 345 6789"
                            />
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">First Name</FormLabel>
                            <FormInput
                              {...register("firstname")}
                              type="text"
                              name="firstname"
                              className={errors.firstName ? "border-danger" : ""}
                              placeholder="John"
                            />
                            {errors.firstName && (
                              <div className="mt-2 text-danger">
                                {typeof errors.firstName.message === "string" &&
                                  errors.firstName.message}
                              </div>
                            )}
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">Last Name</FormLabel>
                            <FormInput
                              {...register("lastname")}
                              type="text"
                              name="lastname"
                              className={errors.lastName ? "border-danger" : ""}
                              placeholder="Doe"
                            />
                            {errors.lastName && (
                              <div className="mt-2 text-danger">
                                {typeof errors.lastName.message === "string" &&
                                  errors.lastName.message}
                              </div>
                            )}
                          </div>
                
                          <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">Phone Number</FormLabel>
                            <FormInput
                              {...register("phone")}
                              type="text"
                              name="phone"
                              placeholder="+254 712 345 6789"
                            />
                          </div>
                
                          {/* <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                              cancel({ name: "" });
                            }}
                            className="w-20 mr-1"
                          >
                            Cancel
                          </Button> */}
                          <Button variant="primary" type="submit" className="w-20 h-10 mt-7">
                            Save
                            {loading && (
                              <LoadingIcon
                                icon="spinning-circles"
                                color="white"
                                className="w-4 h-4 ml-2"
                              />
                            )}
                          </Button>
                        </div>
                      </form>
                
               
                </div>
              </div>
              {/* END: New Authors */}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default Main;
