import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Table from "../../base-components/Table";

import { useState, useRef, useEffect } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import { Dialog, Menu } from "../../base-components/Headless";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import Dropzone from "../../base-components/Dropzone";

function Users() {
  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
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
      // tenant: yup.string().required("Conference is required"),
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      email: yup
        .string()
        .required("Email is required")
        .email("Email must be a valid"),
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
    getRole();
  }, []);
  useEffect(() => {
    getUsers();
  }, [search, limit, page]);

  const getUsers = async () => {
    let res = await ApiService.getUsers({
      page: page,
      search: search,
      limit: limit,
    });

    const pagination = res.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setUsers(res.data);
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
        let res = await ApiService.createUsers(data);
        getUsers();
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
  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record.groups);
    console.log(record);
    reset(record);
    setDialog(true);
  };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteUsers(userId);
      getUsers();
      isLoading(false);
      setConfirmDelete(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const cancel = (record: any) => {
    setGroup([""]);
    reset({});
    setDialog(false);
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Profile</h2>

      <form className="validate-form" onSubmit={onSubmit}>
        <div className=" bg-white p-5  mt-10 grid grid-cols-12 gap-4 gap-y-3 shadow-lg rounded-xl">
          <div className=" col-span-12 relative flex-none w-20 h-20 mx-auto sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit ">
            <img
              alt="Midone Tailwind HTML Admin Template"
              className="rounded-full"
              src={
                "https://w7.pngwing.com/pngs/236/917/png-transparent-computer-icons-avatar-woman-user-profile-avatar-face-heroes-head.png"
              }
            />
            <div className="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
              <Lucide icon="Camera" className="w-4 h-4 text-white" />
            </div>
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
            <FormLabel htmlFor="modal-form-6">Role</FormLabel>
            <FormSelect {...register("role_id")} name="role_id">
              {roles.map((role: any, key) => (
                <option key={key} value={role._id}>
                  {role.name}
                </option>
              ))}
            </FormSelect>
            {errors.role && (
              <div className="mt-2 text-danger">
                {typeof errors.role.message === "string" && errors.role.message}
              </div>
            )}
          </div>
          {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">Country</FormLabel>
                <FormSelect
                  {...register("country")}
                  name="country"
                  value={"Kenya"}
                >
                  {countries.map((country, key) => (
                    <option key={key} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </FormSelect>
              </div> */}
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">Phone Number</FormLabel>
            <FormInput
              {...register("phone")}
              type="text"
              name="phone"
              placeholder="+254 712 345 6789"
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">Email</FormLabel>
            <FormInput
              {...register("email")}
              type="email"
              name="email"
              className={errors.email ? "border-danger" : ""}
              placeholder="info@example.com"
            />
            {errors.email && (
              <div className="mt-2 text-danger">
                {typeof errors.email.message === "string" &&
                  errors.email.message}
              </div>
            )}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">Password</FormLabel>
            <FormInput
              {...register("password")}
              type="password"
              name="password"
              placeholder="password"
            />
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              cancel({ name: "" });
            }}
            className="w-20 mr-1"
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="w-20">
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

      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete this record? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setConfirmDelete(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteRecord()}
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
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
