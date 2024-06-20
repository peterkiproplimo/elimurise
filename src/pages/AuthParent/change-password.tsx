import _ from "lodash";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import * as yup from "yup";
import { useRef, useState } from "react";
import * as ApiService from "../../services/auth";
import Notification, { NotificationElement } from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingIcon from "../../base-components/LoadingIcon";
import Lucide from "../../base-components/Lucide";
function ChangePassword() {
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      password: yup.string().required().min(8),
      confirm_password: yup.string().oneOf([yup.ref('password'), null], "Passwords do not match").required('Required')
    }).required();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.passwordReset(data);
        isLoading(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
      } catch (error) {
        isLoading(false);
        setSuccess(false);
        setMessage("Incorrect credetials.");
        notify.current?.showToast();
      }
    }

  };
  return (
    <div className="intro-y box lg:mt-5">
      <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
        <h2 className="mr-auto text-base font-medium">Change Password</h2>
      </div>
      <form className="validate-form" onSubmit={onSubmit}>
        <div className="p-5">
          <div>
            <FormLabel htmlFor="change-password-form-1">
              Old Password
            </FormLabel>
            <FormInput
              {...register("old_password")}
              type="password"
              name="old_password"
              id="old_password"
              className={errors.confirm_password ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger" : 'block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]'}
              placeholder="Old Password"
            />
          </div>
          <div>
            <FormLabel htmlFor="change-password-form-2">
              New Password
            </FormLabel>
            <FormInput
              {...register("password")}
              type="password"
              name="password"
              id="password"
              className={errors.password ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger" : 'block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]'}
              placeholder="Password"
            />
            {errors.password && (
              <div className="mt-2 text-danger">
                {typeof errors.password.message === "string" &&
                  errors.password.message}
              </div>
            )}
          </div>
          <div className="mt-3">
            <FormLabel htmlFor="change-password-form-3">
              Confirm New Passwords
            </FormLabel>
            <FormInput
              {...register("confirm_password")}
              type="password"
              name="confirm_password"
              id="confirm_password"
              className={errors.confirm_password ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger" : 'block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]'}
              placeholder="Confirm Password"
            />
            {errors.confirm_password && (
              <div className="mt-2 text-danger">
                {typeof errors.confirm_password.message === "string" &&
                  errors.confirm_password.message}
              </div>
            )}
          </div>
          <Button variant="primary" className="mt-4">
            Change Password
            {
              loading && <LoadingIcon
                icon="spinning-circles"
                color="white"
                className="w-4 h-4 ml-2"
              />
            }
          </Button>
        </div>
      </form>
      <Notification getRef={(el) => { notify.current = el; }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon={success ? "CheckCircle" : "XCircle"} className={success ? "text-success" : "text-danger"} />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">
            {message}
          </div>
        </div>
      </Notification>
    </div>
  );
}

export default ChangePassword;
