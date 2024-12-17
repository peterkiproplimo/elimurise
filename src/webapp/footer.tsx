import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FormInput, FormCheck } from "../base-components/Form";
import Button from "../base-components/Button";
import LoadingIcon from "../base-components/LoadingIcon";

// Import your images

import email from "../assets/images/social.png";
import phone from "../assets/images/social (1).png";

import youtube from "../assets/images/instagram.png";
import linked from "../assets/images/linkedin.png";
import facebook from "../assets/images/Vector (1).png";

const FooterComponent = () => {   
    const [loading, isLoading] = useState(false);

  return (
    <div className="bg-primary">
      <div className="grid mt-10 xl:mx-auto xl:w-[80%] overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
        <div className="group p-10 xl:ml-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          <h1 className="xl:text-3xl text-2xl font-semibold mt-5 text-white w-full">
            Hero Learning
          </h1>

          <div className="text-white flex gap-5 xl:mt-8">
            <Link to="/policy" className="xl:px-3 xl:py-3 hover:text-blue-800 hover:scale-105 xl:text-lg">
              Privacy Policy
            </Link>
            <Link to="/terms" className="xl:px-3 xl:py-3 hover:text-blue-800 hover:scale-105 xl:text-lg">
              Terms of Use
            </Link>
            <Link to="/contact" className="xl:px-3 xl:py-3 hover:text-blue-800 hover:scale-105 xl:text-lg">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="group p-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 -m-5 justify-center align-center">
          <h1 className="xl:text-2xl font-medium xl:p-10 text-white w-full">
            Subscribe to stay tuned for new web design and latest updates. Let's do it!
          </h1>

          <form className="validate-form mt-5">
            <div className="flex gap-5 xl:pl-10">
              <div className="input-form">
                <FormInput
                  id="validation-form-2"
                  type="text"
                  name="email"
                  placeholder="Enter Your Email Address"
                  className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none"
                />
              </div>
              <div className="text-center">
                <Button className="w-full bg-white h-[45px] xl:min-w-[150px] rounded-none text-lg">
                  Subscribe
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
          </form>
        </div>
      </div>

      <div className="border-b border-white xl:mx-auto xl:w-[80%] w-full mt-8"></div>
      
      <div className="xl:mx-auto xl:w-[80%] flex justify-between">
        <div className="m-5 text-white">
          <p>© 2024 All Rights Reserved</p>
        </div>
        <div className="text-white flex p-2">
          <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg">
            <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={facebook} />
          </Link>
          <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg">
            <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={email} />
          </Link>
          <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg">
            <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={phone} />
          </Link>
          <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg">
            <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={youtube} />
          </Link>
          <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg">
            <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={linked} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
