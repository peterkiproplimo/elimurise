import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck, FormSelect } from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/Elimurises.png";
import icon from "../../assets/images/Arrow_Right_MD.png";

import users from "../../assets/images/Users_Group.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";
import FooterComponent from "../../webapp/footer";
import NavbarMenu from "../../webapp/NavBarMenu";

const Cookies = () => {
  const schema = yup
    .object({
      email: yup.string().required().email(),
      password: yup.string().required().min(4),
    })
    .required();
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0">
        <NavbarMenu />
        <div className="xl:mx-auto  max-w-[1500px] p-5">
          <h1 className="xl:text-3xl text-2xl  text-center font-semibold   w-full">
            COOKIE POLICY
          </h1>

          <h1 className="xl:text-5xl text-2xl mt-5 text-center font-semibold  text-primary w-full">
            Elimurise Learning
          </h1>

          <div className="xl:p-5  p-5">
            <h1 className="xl:text-2xl text-xl font-semibold w-full">
              In this policy, we, Elimurise Learning Edge Ltd., use the term
              "cookies" to refer to cookies and similar technologies used on our
              website, along with your preferences and choices related to them.{" "}
            </h1>
            <h1 className="xl:text-2xl text-xl font-semibold mt-2 w-full">
              What a Cookie Is
            </h1>
            <div className="mt-2  xl:text-2xl">
              <p>
                A cookie is a small piece of data that a website asks your
                browser to store on your computer or mobile device. The cookie
                allows the website to "remember" your actions or preferences
                over time. Most Internet browsers support cookies; however,
                users can set their browsers to decline certain types of cookies
                or specific cookies. Further, users can delete cookies at any
                time
              </p>
            </div>

            <h1 className="xl:text-2xl mt-8 text-xl font-semibold w-full">
              Why We Use Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
                We use cookies to understand how you interact with our content
                and to improve your experience when visiting our website(s). For
                example:
              </p>
              <ul className="list-disc pl-5 mt-5">
                <li>
                  Some cookies remember your language preferences so that you do
                  not have to select them each time you visit one of our
                  websites.
                </li>
                <li>
                  We also use cookies for geolocation tracking to display our
                  office locations
                </li>
                <li>
                  Additionally, cookies allow us to present specific content,
                  such as videos, on our website(s).
                </li>
                <li>
                  We may also use insights gained from your behavior on our
                  website(s) to deliver targeted advertisements on third-party
                  websites, aiming to "re-market" our products and services to
                  you.
                </li>
              </ul>
              <p className="mt-5">
                We will not sell or distribute cookie information without your
                prior consent. If you are concerned about your data, you have
                the right to require us to correct any inaccuracies in your data
                free of charge
              </p>
            </div>  
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              The Types of Cookies We Use:
            </h1>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              First-Party and Third-Party Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
                We may also collect non-personal information about your use of
                our website, such as:
              </p>
              <ul className="list-disc pl-5 mt-5">
                <li>
                  First-party cookies are cookies set by the website domain you
                  are visiting. They are typically used to remember preferences
                  such as language and location settings or to enable basic site
                  functionality.
                </li>
                <li>
                  Third-party cookies belong to and are managed by other parties
                  or service providers. These cookies may be required to render
                  certain forms, such as the submission of a job application, or
                  to allow for some advertising outside of the Elimurise Learning
                  Edge Ltd. website.
                </li>
              </ul>
            </div>
            </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl  text-xl font-semibold w-full">
              Session Cookies
            </h1>

            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                  Session cookies are temporary cookies that are used to
                  remember you during the course of your visit to the website,
                  and they expire when you close the web browser.
                </li>
              </ul>
            </div>
            </div>


          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              First-Party and Third-Party Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                  Persistent cookies are used to remember your preferences
                  within the website and remain on your desktop or mobile device
                  even after you close your browser or restart your computer. We
                  use these cookies to analyze user behavior to establish visit
                  patterns so that we can improve our website functionality for
                  you and others who visit our website(s). These cookies also
                  allow us to serve you with targeted advertising and measure
                  the effectiveness of our site functionality and advertising.
                </li>
              </ul>
            </div>
            </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              Performance Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                  These are cookies used specifically for gathering data on how
                  you use our website, e.g., which pages of the website are
                  visited most often, or if you get error messages on web pages.
                  These cookies monitor only the performance of the site as the
                  user interacts with it. These cookies don’t collect
                  identifiable information on visitors, which means all the data
                  collected is anonymous and only used to improve the
                  functionality of a website
                </li>
              </ul>
            </div>
          </div>
          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              Functionality Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                  Functionality cookies allow our website to remember the user’s
                  site preferences and choices they make on the site including
                  username, region, and language. This allows the website to
                  provide personalized features/ products if you share your
                  location. They are anonymous and don’t track browsing activity
                  across other websites.
                </li>
              </ul>
            </div>
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              How Cookies are Used for Advertising Purposes
            </h1>
            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                  Cookies and advertising technologies allow us to serve you
                  more relevant ads by tracking your interests and behavior.
                  They help us collect aggregated data for reporting, research,
                  and performance analysis for advertisers. Some ad technologies
                  enable us to optimize ad delivery and understand when specific
                  ads have been shown to you.
                </li>
                <li>
                  Since your browser may request ads directly from ad network
                  servers, these networks can set, view, or modify their own
                  cookies, just as if you had visited their website directly
                </li>
                <li>
                  Although we do not use cookies to create a profile of your
                  browsing behavior on third-party sites, we do use aggregate
                  data from third parties to show you relevant, interest-based
                  advertising. We do not provide any personal information that
                  we collect to advertisers
                </li>
                <li>
                  You can opt out of off-site and third-party-informed
                  advertising by adjusting your cookie settings. Opting out will
                  not remove advertising from the pages you visit, but instead,
                  opting out will result in the ads you see not being matched to
                  your interests. This implies that the ad(s) you see will not
                  be matched to your interests by those specific cookies.
                </li>
              </ul>
            </div>
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              How Third-Party Cookies Are Used
            </h1>
            <div className="mt-2 xl:text-2xl">
              <ul className="list-disc ml-5 mt-5">
                <li>
                Some functions on our websites rely on third-party suppliers. For example, when you visit a page with videos embedded from or links to YouTube, these videos or links (along with any other content from third-party suppliers) may include third-party cookies. We encourage you to review the privacy policies of these third-party vendors on their websites to learn more about how they use cookies
                </li>
              </ul>
            </div>
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            How to Manage Cookies
            </h1>
            <div className="mt-2 xl:text-2xl">
            <ul className="list-disc ml-5 mt-5">
                <li>
                You can manage your cookie preferences and choose to reject or block all or specific cookies set during your visit to our website by clicking on the cookie preferences tool available on our website(s).
                </li>
                <li>
                You can also modify your cookie settings for our website and/or third-party websites through your browser settings. Please note that most browsers are set to accept cookies by default. Therefore, if you do not wish to allow cookies, you will need to actively delete or block them
                </li>
                <li>
                While rejecting cookies will not prevent you from visiting our website, some features may not work as intended. By continuing to use our website without deleting or rejecting cookies, you consent to the use of the cookies you have not blocked or deleted.
                </li>
              
              </ul>
            </div>
          </div>
        
        </div>

        <FooterComponent />
      </div>
    </>
  );
};

export default Cookies;
