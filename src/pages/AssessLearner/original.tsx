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

function Profile() {
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
  return (
    <div className="mt-5 intro-y box">
      <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
        <h2 className="mr-auto text-base font-medium">
          Personal Information
        </h2>
      </div>
      {user && <>
        <div className="px-5 pt-5 mt-5 flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
          <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
            <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
              <img
                alt=""
                className="rounded-full"
                src={user.photo}
              />
              <div className="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
                <Lucide icon="Camera" className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-5">
              <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                {user.firstname + " " + user.lastname}
              </div>
              <div className="text-slate-500">{user.gender}</div>
              <div className="text-slate-500">{user.occupation}</div>
            </div>
          </div>
         
        </div>
        <div className="p-5">
          <div className="grid grid-cols-12 gap-x-5">
            <div className="col-span-12 xl:col-span-6">
              <div>
                <FormLabel htmlFor="update-profile-form-6">Email</FormLabel>
                <FormInput
                  id="update-profile-form-6"
                  type="text"
                  placeholder="Input text"
                  value={user.email}
                  disabled
                />
              </div>
              <div className="mt-3">
                <FormLabel htmlFor="update-profile-form-9">
                  Country
                </FormLabel>
                <FormInput
                  id="update-profile-form-9"
                  type="text"
                  placeholder=""
                  value={user.nationality}
                  disabled
                />
              </div>
            </div>
            <div className="col-span-12 xl:col-span-6">
              <div className="mt-3 xl:mt-0">
                <FormLabel htmlFor="update-profile-form-10">
                  Gender
                </FormLabel>
                <FormInput
                  id="update-profile-form-10"
                  type="text"
                  placeholder="Male"
                  value={user.gender}
                  disabled
                />
              </div>
              <div className="mt-3">
                <FormLabel htmlFor="update-profile-form-11">
                  County
                </FormLabel>
                <FormInput
                  id="update-profile-form-11"
                  type="text"
                  placeholder="City"
                  value={user.county}
                  disabled
                />
              </div>

            </div>
          </div>
        </div>
        <div className="p-5">
          
{/*          
          <div className="flex items-center mt-5">
          
            <FormSwitch className="ml-auto">
              <FormSwitch.Input type="checkbox" checked={user.occupation} />
            </FormSwitch>
          </div> */}
        </div>
     
      </>
      }
    </div>
  );
}

export default Profile;
