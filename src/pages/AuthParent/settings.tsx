import _ from "lodash";
import { useEffect, useState } from "react";
import {
  FormInput,
  FormLabel,
  FormSwitch,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { useLocation } from "react-router-dom";
import * as ApiService from "../../services/auth";
import Button from "../../base-components/Button";



import * as yup from "yup";
import { useRef } from "react";
import Notification, { NotificationElement } from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Link, useNavigate } from 'react-router-dom';










function Settings() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      let res = await ApiService.getUserData();
      setUser(res.user);
    } catch (error) {
      console.log("Error fetching user");
    }
  };


  
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
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
        console.log(data)
        let res = await ApiService.passwordReset(data);
        isLoading(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
        setTimeout(() => {
          navigate('/login',{
            replace: true ,
         
        });
        }, 1000);
      } catch (error) {
        isLoading(false);
        setSuccess(false);
        setMessage("Incorrect credetials.");
        notify.current?.showToast();
      }
    }

  };
  return (
    <div className="mt-5 intro-y box">
      <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
        <h2 className="mr-auto text-base font-medium">
          Settings
        </h2>
      </div>
      {user && <>
       
        <form className="validate-form" onSubmit={onSubmit}>
       


        <div className="intro-y box lg:mt-5">
            
            <div className="p-5">
         <div>
                <FormLabel htmlFor="change-password-form-1">
                quote_expiration_days
                </FormLabel>
                <FormInput
                  id="change-password-form-9"
                  type="double"
                  placeholder="e.g 10"
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
              Confirm New Password
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
            
          </div>
          </form>
          {/* END: Change Password */}
      </>
      }
    </div>
  );
}

export default Settings;
