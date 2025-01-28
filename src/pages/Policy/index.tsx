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
import logo from "../../assets/images/heros.png";
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

const Policy = () => {
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
            PRIVACY POLICY
          </h1>
          <h1 className="xl:text-5xl text-2xl mt-5 text-center font-semibold  text-primary w-full">
            Hero Learning
          </h1>

          <div className="xl:p-5  p-5">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              Privacy Policy
            </h1>
            <div className="mt-2  xl:text-2xl">
              <p>
                Thank you for visiting the website of Hero Learning Edge Ltd.
                Your privacy is important to us. This Privacy Policy explains
                how we handle and treat your data when you engage with us to use
                the products or services provided by Hero Learning Edge Ltd (our
                "Services"). It also includes information about individuals
                whose personal information we may process as a result of
                providing the Services to third parties
              </p>

              <p>
                Please read this Privacy Policy carefully before using our
                website or providing any personal information to us. By
                accessing or using our website, you signify your acceptance of
                this Privacy Policy. If you do not agree with the terms of this
                Privacy Policy, please do not use our website.
              </p>
            </div>

            <h1 className="xl:text-2xl mt-8 text-xl font-semibold w-full">
              1. Information We Collect
            </h1>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              1.1 Personal Information
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
                We may collect personal information during the course of our
                business, when you contact us, request information, or engage
                our Services. This includes:
              </p>
              <ul className="list-disc pl-5 mt-5">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <p className="mt-5">
                When we require personal information to fulfill statutory or
                contractual requirements, we will inform you of the consequences
                of failing to provide such information.
              </p>
            </div>

            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              1.2 Non-Personal Information
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
                We may also collect non-personal information about your use of
                our website, such as:
              </p>
              <ul className="list-disc pl-5 mt-5">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Referring website</li>
              </ul>
              <p className="mt-5">
                This information is used to analyze trends, administer the
                website, track user movements, and gather demographic
                information for aggregate use
              </p>
            </div>

            <h1 className="xl:text-2xl mt-8 text-xl font-semibold w-full">
              2. Use of Information
            </h1>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              2.1 Personal Information
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>We may use your personal information to:</p>
              <ul className="list-disc ml-5 mt-5">
                <li>Provide the information or services you have requested</li>
                <li>Respond to your inquiries and communicate with you</li>
                <li>Verify your identity</li>
                <li>
                  Send newsletters, updates, or promotional materials (unless
                  you opt out)
                </li>
                <li>Improve our website, services, and user experience</li>
                <li>
                  Enforce our legal rights and protect against potential fraud
                  or unauthorized access
                </li>
              </ul>
              <p className="mt-5">
                When we require personal information to fulfill statutory or
                contractual requirements, we will inform you of the consequences
                of failing to provide such information.
              </p>
            </div>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              2.2 Non-Personal Information
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>Non-personal information may be used for:</p>
              <ul className="list-disc ml-5 mt-5">
                <li>Website analytics</li>
                <li>Improving our website</li>
                <li>Enhancing our services</li>
              </ul>
              <p className="mt-5">
                When we require personal information to fulfill statutory or
                contractual requirements, we will inform you of the consequences
                of failing to provide such information.
              </p>
            </div>
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
              3. Retention of Information
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
                We will retain your personal data only as long as necessary to
                fulfill the purposes for which it was collected, including to
                satisfy legal, regulatory, tax, accounting, or reporting
                requirements. Retention periods may vary depending on:
              </p>
              <ul className="list-disc ml-5 mt-5">
                <li>The nature and sensitivity of the personal data</li>
                <li>The potential risks from unauthorized use or disclosure</li>
                <li>Applicable legal, regulatory, or other requirements</li>
              </ul>
              <p className="mt-5">
                Applicable legal, regulatory, or other requirements.
              </p>
            </div>
          </div>

          <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            4. Disclosure of Information
            </h1>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            4.1 Service Providers
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
              We may share personal information with third-party service providers, such as:
              </p>
              <ul className="list-disc ml-5 mt-5">
                <li>Document processing and translation services</li>
                <li>IT systems or software providers</li>
                <li>Confidential waste disposal providers</li>
                <li>IT support and information storage providers</li>
              </ul>
              <p className="mt-5">
              All subcontractors and data processors are vetted and bound by contracts to process information securely and in compliance with legal obligations.
              </p>
            </div>
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            4.2 Legal Requirements
            </h1>
            <div className="mt-2 xl:text-2xl">
            <p className="mt-5">
            We may disclose personal information to comply with legal obligations, protect our rights, or investigate illegal activities, fraud, or threats to safety. </p>
          </div>
        </div>

        <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            5.  Data Security
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
              We are committed to protecting your data through:
              </p>
              <ul className="list-disc ml-5 mt-5">
                <li>Information security policies and rules</li>
                <li>Technical measures to prevent unauthorized access, misuse, or disclosure</li>
              </ul>
              <p className="mt-5">
              While we strive to ensure the security of your data, no transmission over the Internet is completely secure. All employees, partners, and contractors are obligated to maintain confidentiality.   </p>
            </div>
        </div>

        <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            6.  Third-Party Websites
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. We encourage you to review their privacy policies before providing any personal information.
              </p>
         </div>
         
        </div>

        <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            7. Children’s Privacy
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
              Our website is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe your child has provided information to us, please contact us, and we will promptly delete such data.    </p>
         </div>
         
        </div>
        <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            8. Changes to this Privacy Policy
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
            

We may update this Privacy Policy periodically to reflect changes in practices, legal requirements, or regulations. Material changes will be communicated through notices on the website or via email. We encourage you to review this policy periodically </p>
         </div>
         
        </div>

        <div className="xl:p-5  p-2">
            <h1 className="xl:text-2xl mt-2 text-xl font-semibold  w-full">
            9. Contact Us
            </h1>
            <div className="mt-2 xl:text-2xl">
              <p>
            
              For questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
            
              Hero Learning Edge Ltd. </p>

              <ul className="  mt-5">
                <li className="font-bold">Address: 51318-00200, Nairobi</li>
                <li className="font-bold">Email: <span className="text-danger">info@herolearning.co.ke</span></li>
                <li className="font-bold">Phone: <span className="text-danger">+254 722 424 273</span></li>
              </ul>
              <p>
            
           
By using our website or providing your personal information, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your personal information as described herein.</p>
         </div>
         
        </div>

        </div>

        <FooterComponent />
      </div>
    </>
  );
};

export default Policy;
