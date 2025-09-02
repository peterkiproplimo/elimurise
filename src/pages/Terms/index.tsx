import React, { useState, useRef } from "react";
import * as yup from "yup";
import FooterComponent from "../../webapp/footer";
import NavbarMenu from "../../webapp/NavBarMenu";

const Terms = () => {
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
            TERMS OF USE
          </h1>
          <h1 className="xl:text-5xl text-2xl mt-5 text-center font-semibold  text-primary w-full">
            Elimurise Learning
          </h1>

          <h1 className="xl:text-3xl text-2xl p-5 mt-10 font-semibold   w-full">
            GENERAL TERMS AND CONDITIONS OF Elimurise LEARNING EDGE LTD. SOFTWARE
            SUBSCRIPTION
          </h1>
          <h1 className="xl:text-3xl text-2xl p-5 font-semibold  w-full">
            Please read these Terms and Conditions carefully before activating
            the Software Subscription.
          </h1>

          <div className="xl:p-10  p-5">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              1. General Provisions
            </h1>
            <div className="mt-2  xl:text-2xl">
              <ol>
                <li className="flex">
                  <div className="mr-2">1.</div>
                  <div>
                    These General Terms and Conditions of Software Subscription
                    of Elimurise Learning Edge Ltd. (the Company), as amended from
                    time to time (the Terms and Conditions), shall govern and
                    apply to the subscription, license, and use of the Software
                    and any Services (as defined below) which the Company or any
                    of its entities controlling, controlled by or under control
                    by or with the Company (Affiliates) may provide in
                    connection therewith to all the Company’s customers, as
                    subscribers and licensees (the Customer). For purposes of
                    these Terms and Conditions, the term Company shall include
                    all its Affiliates. Reference to these Terms and Conditions
                    shall include the Company’s Data Privacy Policy (as defined
                    below), the applicable ordering document according to which
                    the Customer orders and subscribes for the Software
                    (together with any renewal thereof) (the Order Form). In
                    case of conflict between the documents comprising these
                    Terms and Conditions, the Order Form shall prevail.
                  </div>
                </li>

                <li className="flex">
                  <div className="mr-2">2.</div>
                  <div>
                    By downloading, activating, and using the Software the
                    Customer acknowledges that it has read and understood the
                    Terms and Conditions and agrees to be legally bound by these
                    Terms and Conditions. If the Customer does not agree to the
                    terms stipulated in these Terms and Conditions, it should
                    not install, activate, and/or use the Software and, if
                    presented with the option to "agree" or "disagree" to the
                    Terms and Conditions, select "disagree".
                  </div>
                </li>
              </ol>
            </div>

            <h1 className="xl:text-3xl mt-8 text-xl font-semibold  w-full">
              2. Software Subscription
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Subject to full payment of the applicable Fees the Company
                  grants to the Customer a revocable, non-exclusive,
                  non-transferable, non-sublicensed, renewable fixed and limited
                  license to:
                  <ul>
                    <li>
                      {" "}
                      download, install, activate, access to and use any of the
                      Company’s integrated system comprised of hardware-bound
                      algorithms, software application, cloud-based services and
                      solutions, computer programs in object form provided,
                      connected and/or associated to a Company’s branded
                      instrument or any of the above provided on a standalone as
                      described under the Order Form (the Software) in
                      Customer’s normal course of business in one (1) or
                      multiple hardware devices owned or otherwise controlled by
                      the Customer strictly in accordance with these Terms and
                      Conditions. The Customer’s user account shall be at all
                      times associated with the Company’s branded equipment
                      referred to in the respective Order Form; and
                    </li>
                    <li>
                      access, stream, download, and use on or through the
                      Software the data and content made available in or
                      otherwise accessible through the Software and storage of
                      such data in the cloud platform together with any Services
                      provided by the Company connected thereto, strictly in
                      accordance with these Terms and Conditions (the Software
                      Subscription).
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  For purposes of these Terms and Conditions, Software means the
                  initial version subscribed by the Customer together with
                  certain periodic updates and upgrades which may not
                  necessarily include all existing features or new features that
                  the Company releases for newer or other models or any new
                  releases of a Software or products or any additional
                  functionality for which the Company, in its sole discretion,
                  generally charges or might charge customers of the Software in
                  addition (collectively Updates).
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  The Software together with any third-party software,
                  documentation, interfaces, content, fonts and any data
                  accompanying the Software whether preinstalled on the
                  Company’s branded hardware, on disk, in read only memory, on
                  any other media or in any other form are an integral part of
                  the Software and are provided to the Customer by the Company
                  for use only under these Terms and Conditions{" "}
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The Software may be delivered to the Customer by data media or
                  by electronic means via data networks such as the Internet, or
                  third parties’ platforms. The Company offers no guarantee for
                  the availability of such networks or platforms nor for the
                  correct transfer and download of the Software.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  The Company reserves the right to, at any time and at its sole
                  discretion, discontinue the Software and consequently cease
                  the provision of Updates and/or Maintenances and Support
                  Services and consequently cancel and terminate the Software
                  Subscription without reason. In such case, the Company will
                  use reasonable efforts to notify the Customer at least six (6)
                  months prior and any Fees which have been already paid for the
                  remainder of the Subscription Period will be returned to the
                  Customer on a pro-rata basis from date of discontinuation
                  until expiry of the Subscription Period.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">6.</div>
                <div>
                  In the event of the Company releasing an alternative software
                  product that substantially incorporates the functionality of
                  the Software version the Customer has subscribed for, the
                  Company may, but shall not be obliged to, make such new
                  release available to the Customer. In such case different fees
                  may apply.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">7.</div>
                <div>
                  The Customer agrees that these Terms and Conditions will apply
                  to any software product that may be preinstalled on the
                  purchased hardware, unless such product is accompanied by a
                  separate agreement, in which case the Customer agrees that the
                  terms of that agreement will govern its use of that product.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">8.</div>
                <div>
                  The Software may be used to access and use various products
                  and services of the Company (Services). All access to and use
                  of such Services by means of the Software, including any
                  charges for such access and use, will be governed by the terms
                  applicable to the relevant Services.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              3. Use of the Software
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Customer acknowledges and agrees that the Software shall
                  be used in connection with the Company’s branded hardware
                  specified in the respective Order Form that meets specified
                  system requirements as indicated by the Company and that the
                  use of and access to certain features of the Software and
                  certain Services may require the Customer to apply for a
                  unique username and password combination.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Any offering made hereunder by the Company does not include
                  access to the Internet or any other network or to any
                  communications services or any hardware, software, storage,
                  security or other resources necessary for accessing or using
                  the Software. The Customer and other suppliers and service
                  providers are responsible for acquiring all such items and for
                  their reliability, security, and performance. Installation of
                  all the hardware and supporting software necessary to ensure
                  that minimum configuration requirements for installation and
                  operation of the Software are satisfactorily met as well as
                  the installation and operation of the Software itself is the
                  sole responsibility of the Customer.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  The Customer shall be solely responsible for:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      {" "}
                      installing any Updates and ensuring that the Software, in
                      particular the display unit and firmware, are up to date;
                    </li>
                    <li>
                      ensuring the compatibility, capability and appropriateness
                      of all devices and operation systems used in connection
                      with the Software and that any such devices meet the
                      minimum requirements for the intended use of the Software;
                    </li>
                    <li>
                      {" "}
                      providing and maintaining, to the extent deemed required
                      during the use of the Software the necessary Internet
                      access for its use of the Software, and connection to the
                      Company’s cloud to store and manage its data;
                    </li>
                    <li>
                      safeguarding, preventing, and securing its device and the
                      Software from any unauthorized access and use which
                      violate or may violate any of the provisions set forth
                      herein, including without limitation application of
                      cybersecurity measures required to best ensure security
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The Customer shall be solely responsible for:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      copy the Software, except as expressly permitted by these
                      Terms and Conditions;
                    </li>
                    <li>
                      modify, translate, adapt, or otherwise create derivative
                      works or improvements, whether or not patentable, of the
                      Software;
                    </li>
                    <li>
                      reverse-engineer, disassemble, decompile, decode, or
                      otherwise attempt to derive or gain access to the source
                      or binary code of the Software or any part thereof;;
                    </li>
                    <li>
                      transfer the Software to a different programming language
                      or to another operating system or cloud platform, adapt or
                      make error corrections, or incorporate the software, in
                      whole or in part, in any other program;
                    </li>
                    <li>
                      remove, delete, alter, or obscure any trademarks or any
                      copyright, trademark, patent, or other intellectual
                      property or proprietary rights notices from the Software,
                      including any copy thereof
                    </li>
                    <li>
                      rent, lease, lend, sell, sub-license, assign, distribute,
                      publish, transfer, or otherwise make available the
                      Software, or any features or functionality of the
                      Software, to any third party for any reason;
                    </li>
                    <li>
                      remove, disable, circumvent, or otherwise create or
                      implement any workaround to any copy protection, rights
                      management, or security features in or protecting the
                      Software;
                    </li>
                    <li>
                      use the Software in any manner which does not comply with
                      any indication or specification provided by the Company
                      with regards to the relevant equipment and/or of the
                      Software;
                    </li>
                    <li>
                      reproduce all or any portion of the Software (except as
                      expressly permitted herein) or any accompanying
                      documentation, or modify, translate or otherwise create
                      derivative works of the Software.
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  Upon request and subject to the Company’s prior written
                  approval, the Customer may be permitted to sub-license the
                  Software in cases of rental of the Company’s branded hardware
                  described in the Order Form and associated with the Software
                  Subscription. In such case, the Customer shall enter into a
                  separate agreement with the Company. The Company reserves all
                  right to, at its entire discretion, prohibit any such
                  sub-licensing. In such cases and for the avoidance of doubt,
                  the Customer shall remain at all times fully liable for the
                  appropriate use of the Software and compliance with these
                  Terms and Conditions.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">6.</div>
                <div>
                  Customer agrees to notify its employees, representatives, and
                  agents who may have access to Software of the restrictions
                  contained herein and to ensure their compliance at all times
                  with these restrictions.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">7.</div>
                <div>
                  Except as expressly permitted herein, Customer agrees that it
                  shall make no use of the Software, the documentation, or any
                  other related materials without Company’s prior written
                  consent. Any and all goodwill associated with such rights
                  shall enure directly and exclusively to the benefit of the
                  Company.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">8.</div>
                <div>
                  The Customer agrees that outputs from the Software will not,
                  under any circumstances, be considered legal or professional
                  advice and are not meant to replace the experience and sound
                  professional judgment of professional advisors in full
                  knowledge of the circumstances and details of any matter on
                  which advice is sought.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">9.</div>
                <div>
                  The Company shall have the right to perform or have performed
                  on its behalf periodic vulnerability tests of the Software or
                  Services{" "}
                </div>
              </li>
            </div>
          </div>
          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              4. Ownership and Intellectual Property Rights
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Customer hereby acknowledges and agrees that the Company
                  and/or Affiliates, its assignees, if any, have and shall
                  retain the entire right, title, and interest in and to the
                  Software and to any Updates and derivative works thereto,
                  including but not limited to any and all copyrights, patents,
                  trademarks, know-how, and other intellectual property rights
                  in, deriving or relating thereto. The Company reserves any and
                  all rights not expressly granted to the Customer hereunder.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Customer acknowledges and agrees that it does not acquire any
                  ownership interest in and to the Software, or any other rights
                  thereto other than to use the Software in accordance with the
                  Software Subscription granted, and subject to all terms,
                  conditions, and restrictions, under these Terms and
                  Conditions.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  At all times during the Subscription Period and at any time
                  thereafter, Customer covenants and agrees not to take any
                  action, either directly or indirectly, to (a) challenge,
                  question, or attempt to invalidate any of the ownership rights
                  of the Company in connection with the Software; or (b) assert
                  any intellectual property or other rights in or to the
                  Software, other than the limited license granted to Customer
                  according to the Software Subscription.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  Title and intellectual property rights in and to any content
                  displayed by or accessed through the Software by the Customer
                  belongs to the respective content owner. Such content may be
                  protected by copyright or other intellectual property laws and
                  treaties and may be subject to terms of use of the third party
                  providing such content. Except as otherwise provided herein,
                  the Software Subscription does not grant the Customer any
                  rights to use such content nor does it guarantee that such
                  content will continue to be available to the Customer.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  Customer hereby grants to the Company the limited right to use
                  its name, logo, and/or trademark, as applicable, for
                  advertising and promotional purposes, including reference to
                  the Customer in marketing documentation and activities
                  relating to the use of the Software provided that such use is
                  in accordance with all terms, conditions, and restrictions,
                  under these Terms and Conditions, good business practice, and
                  in goodwill.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              5. Updates to the Software
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Company may, at its discretion, make available future
                  Updates to the Software for the Customer’s compatible
                  Company-branded devices. These Terms and Conditions will
                  govern any Software Updates provided by the Company to the
                  original Software product, unless such Update is accompanied
                  by a separate agreement in which case the Customer agrees that
                  the terms of that agreement will govern such Updates
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Certain Updates may modify or delete in whole or in part
                  certain features and functionalities of the Software. The
                  Customer acknowledges and agrees that the Company has no
                  obligation to make any Updates available nor to continue,
                  provide, or enable any particular feature or functionality.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  Updates, if any, will be made available to Customer based on
                  Customer’s settings, and when its device is connected to the
                  Internet either:
                  <ul>
                    <li>
                      the Software will automatically download and install
                      available Updates; or
                    </li>
                    <li>
                      Customer may receive notice of or be prompted to download
                      and install available Updates.
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The Customer shall promptly download and install all Updates
                  and acknowledges and agrees that the Software or portions
                  thereof may not operate properly should the Customer fail to
                  do so.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold w-full">
              6. Data
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Data processed by the Company through or in connection with
                  the Software Subscription are subject to the Company’s Data
                  Privacy Policy, as amended from time to time at the Company’s
                  sole discretion, available at www.Elimuriselearning.co.ke (the
                  Privacy Policy). By means of the Software Subscription, the
                  Customer consents to all actions taken by the Company with
                  respect to its data pursuant to the terms of the Privacy
                  Policy
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  The Customer hereby acknowledges and agrees to be, at all
                  times, fully responsible and liable for the accuracy, quality,
                  integrity, and lawfulness of the data and content, independent
                  of its form or the manner in which such data is obtained,
                  used, generated, collected, provided, uploaded or loaded
                  through or into the Software and uploaded by the Customer in
                  the Company’s cloud platform, including, without limitation,
                  historical data to permit the use of the Software and
                  maintenance thereof.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  Customer retains all right, title, and interest in and to the
                  data referred to in Clause 6.2 and hereby grants to the
                  Company a non-exclusive right to use any such data, in an
                  anonymized way, including without limitation any measurement,
                  metadata, and results collected or generated through or by
                  means of the Software during the Subscription Period as well
                  as any intellectual property rights thereunder according to
                  the Company’s Privacy Policy. This right to use such data
                  shall survive the termination or expiry of the Subscription
                  for whatever reason.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  Any comments, ideas, or reports the Customer may provide to
                  the Company regarding the Software and any Services provided
                  in connection therewith or installation, functionality,
                  performance, accuracy, consistency, and ease of use of the
                  Software or Services (Feedback) will be considered the
                  Company’s property and shall be treated by the Customer as
                  confidential. The Customer hereby irrevocably transfers and
                  assigns to the Company all rights embodied in or arising in
                  connection with such Feedback. The Company in its sole
                  discretion, may freely use all Feedback, without attribution
                  or compensation to the Customer.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              7. Fees
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The fees payable by Customer in consideration of the Software
                  Subscription for the relevant Subscription Period will be in
                  Kenya Shillings (KES), or as otherwise specified in the
                  applicable Order Form issued by the Company (the Fees).
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Where the Subscription Period starting date has for any reason
                  to be adjusted by the Company, the Company may at its
                  discretion either (a) adjust the Subscription Period to run
                  from the revised start date; or (b) reduce it and invoice on a
                  pro-rata basis for the reduced period.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold w-full">
              8. Suspension of the Software Subscription
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Company shall have the right, but not the obligation, in
                  addition to any other rights it holds pursuant to these Terms
                  and Conditions or remedies available at law or equity, to
                  immediately disable or suspend the Customer’s access to and
                  use of the Software without further notice for an undetermined
                  period of time, upon occurrence of any of the following
                  events:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      any breach of any of the provisions of these Terms and
                      Conditions by the Customer, including without limitation
                      non-payment, in whole or in part, of any Fees due
                      hereunder within the given timeline;
                    </li>
                    <li>
                      in case the Company believes in good faith that the
                      Customer’s conduct or failure to act may (i) pose a
                      security risk or otherwise adversely impact the Software
                      and/or the Company; (ii) constitute or enable tampering
                      with, removing, disabling, or otherwise limiting the
                      effectiveness of any technical protections (including any
                      mechanisms for managing, monitoring, controlling, or
                      analyzing the installation of, access to, or use of the
                      Software or protections of the Company’s intellectual
                      property rights); (iii) subject the Company or any of its
                      partners or representatives or any other user to
                      liability. Unless the Company reasonably determines that
                      immediate action is prudent, the Company will seek to
                      notify the Customer of the planned disabling or suspension
                      before it takes effect.
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  The Company reserves the right to, at its sole discretion,
                  charge to the Customer an additional fee for the reactivation
                  of the Software Subscription.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              9. Software Defects
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Company will use reasonable efforts to, within a
                  commercially reasonable period of time, correct Software
                  defects which materially impair the performance and specified
                  functionality of the Software discovered during the
                  Subscription Period (the Defects). The Company has no
                  obligation to rectify or provide support or maintenance
                  services related to devices used in connection with the
                  Software and errors that arise out of or result from (a)
                  modifications to the Software or hardware made by the Customer
                  or a third party not authorized by the Company; (b) Customer’s
                  operation or use of the Software other than as strictly
                  specified by the Company; (c) any failure, including failure
                  to promptly install any Update; (d) continued use of the
                  Software after the Company has recommended install of an
                  Update; or (e) any material breach of these Terms and
                  Conditions by the Customer.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              10. Payment and Billing
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  All Fees payable under the Software Subscription are exclusive
                  and net of applicable sales, use, value added, personal
                  property, withholding taxes applicable in the territory of the
                  Customer and other taxes, which are and shall be payable
                  solely by the Customer.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  All telecoms charges incurred in using the Software are the
                  sole responsibility of Customer.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  All Fees for the Software Subscription shall be paid in
                  accordance with the payment terms and method stipulated in the
                  applicable Order Form.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  If full payment is not made by the due date, except to the
                  extent that any part non-payment relates to a bona fide
                  disputed invoice, without prejudice to any rights or remedies
                  otherwise available, the Company reserves the right to (a)
                  charge interest on the outstanding balance of all overdue sums
                  at the rate of 5% per annum; (b) suspend the Software
                  Subscription as per Clause 8; (c) charge to the Customer an
                  additional fee for administration costs at the Company’s
                  applicable rates; and (d) require and Customer shall cease all
                  use of the Software.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              11. Term and Termination
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The term of the Software Subscription shall commence on the
                  date stipulated in the respective Order Form and will continue
                  in effect for the period of time stated thereunder together
                  with any renewals thereof or as terminated in accordance with
                  this Clause 11 (the Subscription Period).
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Notwithstanding any of the foregoing, the Software
                  Subscription may be terminated with immediate effect by the
                  Company at any time in the event of the following:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      the Customer breaches any provision of the Terms and
                      Conditions and fails to remedy such breach within thirty
                      (30) calendar days of its notification by the Company. For
                      the avoidance of doubt, any failure to make timely
                      payments is considered a material breach;
                    </li>
                    <li>
                      if any organization, entity, or person, which the Company
                      acting reasonably determines to be a competitor of the
                      Customer acquires control of the Customer; or
                    </li>
                    <li>
                      the Customer becomes insolvent or bankrupt, seeks deferred
                      payment authorization, goes into liquidation, has an
                      administrator, administrative receiver, or receiver
                      appointed, makes a voluntary arrangement with its
                      creditors, or proceedings are brought by a creditor in
                      respect of any of the foregoing.{" "}
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  In the event of early termination without reason by the
                  Company, if Customer has pre-paid any Fees in respect of the
                  then current Software Subscription, the Company’s sole
                  liability to Customer in respect of such termination shall be
                  to refund the pre-paid Fees in respect of the remainder
                  Subscription Period. No such refund shall be required in event
                  of termination for Customer’s breach of any of the terms
                  hereunder.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  Upon expiry or termination of the Subscription Period by
                  either the Customer or the Company for whatever reason:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      all rights granted to the Customer hereunder will
                      automatically and immediately terminate;{" "}
                    </li>
                    <li>
                      the Company may provide, upon written request, to the
                      Customer a limited right to retrieve all archived data
                      stored in the cloud platform provided that such request is
                      made within a period of thirty (30) days after termination
                      or expiry.{" "}
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  Termination for whatever cause will not limit any of Company's
                  rights or remedies at law or in equity.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              12. Renewal of the Software Subscription
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Unless the Company receives a written termination notice from
                  the Customer at least two (2) months prior to the expiry of
                  each Subscription Period (the Termination Notice), the
                  Software Subscription will automatically renew for successive
                  periods of one (1) year each (each a Renewal Period). For
                  purposes of these Terms and Conditions, Subscription Period
                  shall include all Renewal Periods.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  The Company reserves the right to modify the Fees for each
                  Renewal Period in respect of any Software Subscription. The
                  Company will endeavor to issue Customer with a renewal notice
                  specifying the new applicable Fees for the Software
                  Subscription no less than two (2) months before the end of the
                  Subscription Period
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  Customer is deemed to have agreed to extend the Software
                  Subscription for the Renewal Period and to pay the Fees for
                  the Software Subscription for the Renewal Period unless the
                  Company receives a Termination Notice within the stipulated
                  timeline.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  Where, on expiry of the Subscription Period the applicable
                  Fees are under active bona fide discussion between the
                  parties, the Company will:
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      {" "}
                      whilst, in Company’s reasonable opinion, such discussions
                      are proceeding without undue delay, continue licensing the
                      relevant Software on the terms of these Terms and
                      Conditions during that period and to bill Customer for
                      Fees incurred at the existing rates;
                    </li>
                    <li>
                      be entitled, once agreement has been reached on Fees
                      applicable for such Renewal Period to invoice for the
                      additional amounts due in respect of the period between
                      the start of the Renewal Period and such agreement being
                      reached; an
                    </li>
                    <li>
                      in the event that such agreement is not reached within a
                      reasonable period, at Company’s sole discretion have the
                      right to require to withdraw Customer’s access to the
                      Software. In such case, Customer shall cease all use of
                      the Software, uninstall the Software, and confirm by email
                      to Company that the said Software has been uninstalled.{" "}
                    </li>
                  </ul>
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              13. Maintenance and Support Services
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  During the Subscription Period and provided that the Customer
                  is not in breach of any its obligations under these Terms and
                  Conditions, the Company will provide to the Customer certain
                  maintenance and support services in connection with the
                  Software, including rectification and correction of defects as
                  per Clause 9, and Software quality testing, cloud maintenance,
                  and backups (the Maintenance and Support Services).
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  The Company will only provide Maintenance and Support Services
                  to the Customer with the most current version and the
                  immediately preceding version of the Software.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  In case the Company determines that any of the Customer’s
                  reported maintenance problems cannot be resolved due to
                  Customer’s failure to install Updates or procure new versions
                  of the Software, Customer will be given a reasonable
                  opportunity to install such Updates or procure a new version.
                  If, after such opportunity, Customer fails or otherwise
                  refuses to install such Updates or procure such new version,
                  Company shall be relieved of its obligations.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The Company’s obligations under the Software Subscription
                  provided hereunder will extend only to Updates of the Software
                  provided to Customer by the Company so long as the Software or
                  hardware has not been modified or altered in any way by anyone
                  other than by the Company or by an authorized representative
                  of the Company.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  Customer shall ensure that the Company personnel are provided
                  with such information under Customer’s control as is
                  reasonably necessary to enable the Company to comply with its
                  obligations hereunde.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">6.</div>
                <div>
                  Any services, training, or other requirements not expressly
                  included in these Terms and Conditions are outside the scope
                  of this Software Subscription and may be only provided subject
                  to the Company’s availability and for additional fees. Fees
                  for such items are payable as specified in the applicable
                  Order Form.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              14. Third-Party Materials
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Software or any Services may contain, be dependent on,
                  display, include, or make available third-party products or
                  content (including without limitation data, information,
                  applications, and other products, services, and/or materials)
                  or provide links to third-party websites or services,
                  including through third-party advertising (Third-Party
                  Materials). The Customer acknowledges and agrees that the
                  Company is not responsible for any Third-Party Materials and
                  will not have any liability or responsibility to the Customer
                  or any other person or entity for any Third-Party Materials.
                  For Third-Party Materials, the respective warranty and terms
                  of use of such third parties shall apply exclusively
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Third-Party Materials and links thereto are provided solely as
                  a convenience to the Customer, and Customer’s access and use
                  of them are entirely at its own risk and subject to such third
                  parties' terms and conditions.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              15. Warranty and Limitation of Liability
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Except as specifically and expressly provided in these Terms
                  and Conditions and to the fullest extent permitted by law, the
                  Software and any Services provided hereunder are provided “as
                  is” and “as available” without warranty of any kind, whether
                  express or implied or statutory including but not limited to
                  warranties of performance, merchantability, fitness for a
                  particular purpose, accuracy, omissions, completeness,
                  correctness, and delays. To the maximum extent permitted under
                  applicable law, the Company, on its own behalf and on behalf
                  of its Affiliates and its and their respective licensors and
                  service providers, expressly disclaims all warranties, whether
                  express, implied, statutory, or otherwise, with respect to the
                  Software, and any Services, including without limitation all
                  implied warranties of merchantability, fitness for a
                  particular purpose, title, and non-infringement, and
                  warranties that may arise out of course of dealing, course of
                  performance, usage, downtime, or trade practice. Without
                  limitation to the foregoing, the Company provides no warranty
                  or undertaking, and makes no representation of any kind that
                  the Software will meet the Customer’s requirements, achieve
                  any intended results, be compatible, or work with any other
                  software, devices, applications, systems, or services, operate
                  without interruption, meet any performance or reliability
                  standards, or be error-free, or that any errors or defects can
                  or will be corrected
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              16. Indemnity and Remedies
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Customer agrees to indemnify, defend, and hold harmless
                  Company and its officers, directors, employees, agents,
                  Affiliates, successors, and assigns from and against any and
                  all losses, damages, liabilities, deficiencies, claims,
                  actions, judgments, settlements, interest, awards, penalties,
                  fines, costs, or expenses of whatever kind, including
                  attorneys' fees, arising from or relating to your use or
                  misuse of the Software or Customer’s breach of these Terms and
                  Conditions including but not limited to the content the
                  Customer submits or makes available through the Software.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Customer’s sole and exclusive remedy for the Company’s breach
                  of its obligations arising out of the Software Subscription
                  will be to have Company re-perform the defective services so
                  that they conform to the specifications provided herein as per
                  Clause 9.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  Other than in respect of the warranty given herein, Customer's
                  exclusive remedy and the Company's, its Affiliates' and/or
                  licensors of the foregoing entire liability under the Software
                  Subscription if any, for any claim(s) for damages relating to
                  the Software made against them individually or jointly whether
                  based in contract or negligence shall be limited to the
                  aggregate amount of the Fees pre-paid by Customer relative to
                  the specific aspect of the Software which is the basis of the
                  claim(s) during the twelve (12) month period preceding the
                  event giving rise to such claim.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The remedies provided in these Terms and Conditions are
                  Customer’s exclusive remedies and are in lieu of all other
                  legal or equitable remedies and all liabilities or obligations
                  on the part of the Company for any direct or indirect damages
                  arising out of, relating to, or in connection with the
                  Software Subscription and use of the Software including, but
                  not limited to, the licensing, delivery, installation, use or
                  performance of the Software or the integration of the Software
                  with other software or hardware, and any data collected.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              17. Infringement Claims
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Customer shall promptly inform the Company if Customer becomes
                  aware of:
                  <ul className="list-disc ml-5 mt-5">
                    <li>any unauthorized use of the Software;</li>
                    <li>
                      any actual, threatened, or suspected infringement of any
                      intellectual property of the Company, its Affiliates
                      and/or licensors of the foregoing in the Software which
                      comes to Customer's notice; or
                    </li>
                    <li>
                      any claim by any third party coming to its notice that the
                      Software infringes the intellectual property or other
                      rights of any other person
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Customer shall at the request and expense of the Company do
                  all such things as may be reasonably required to assist the
                  Company in taking or resisting proceedings in relation to any
                  infringement or claim referred to in this Clause 17 and in
                  maintaining the validity and enforceability of the
                  intellectual property of the Company, its Affiliates and/or
                  licensors of the foregoing in the Software.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  In the event a claim of infringement is made against the
                  Company or Customer with respect to the Software, the Company
                  shall have the right to terminate the Software Subscription
                  and, in such case, return to the Customer pre-paid Fees for
                  the remainder relevant Subscription Period
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  These Terms and Conditions contain the Company’s entire
                  obligation and the exclusive remedies of Customer with regard
                  to any claimed infringement arising out of or based upon the
                  Software used by Customer.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              18. Compliance with Applicable Laws
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Customer agrees to use the Software and any of the
                  Services provided in connection therewith in compliance and
                  conformity with all applicable laws, including local laws of
                  the country or region in which the Customer resides or in
                  which the Customer downloads or uses the Software and/or
                  Services. Features of the Software and/or the Services may not
                  be available in all languages or regions and some features may
                  vary by region. An Internet connection is required for some
                  features of the Software and/or Services.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Customer agrees to comply with all relevant export laws and
                  regulations (collectively, Export Laws) to ensure that the
                  Software or any portion of it is not exported, directly or
                  indirectly, in violation of any Export Laws, and that no
                  access to the specified services is given by Customer to any
                  embargoed country or their nationals, or any other
                  embargoed/denied persons listed from time to time by other
                  countries. The Company will not be liable for any default or
                  delay caused by the Customer’s efforts to comply with any
                  Export Laws. If Export Laws change after the commencement of
                  the Subscription Period and such changes materially inhibit or
                  prohibit the Company from performing its obligations
                  hereunder, the Company will not be liable for their
                  non-performance and either or both Company and Customer will
                  have the right to terminate the Software Subscription with
                  respect to the applicable Software without any compensation or
                  remedy.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  The Software may be subject to certain Export Laws. The
                  Customer shall not, directly or indirectly, export, re-export,
                  or release the Software to, or make the Software accessible
                  from or to any jurisdiction or country to which export,
                  re-export, or release is prohibited by law, rule, or
                  regulation in particular in those jurisdictions. Customer
                  shall comply with all applicable federal laws, regulations,
                  and rules, and complete all required undertakings (including
                  obtaining any necessary export or other governmental
                  approval), prior to exporting, re-exporting, releasing, or
                  otherwise making the Software available.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold  w-full">
              19. Other Releases
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Company may, from time to time at its sole discretion,
                  make available to certain Customers free of charge, certain
                  beta, trial, demo, or testing versions of any Software and
                  Services for the sole purpose of testing their functionality
                  and overall experience in exchange for providing the Company
                  with customer, application, and market insights, under the
                  terms set forth hereto (Versions). To the extent that Customer
                  was granted access to any such Versions, the Customer hereby
                  agrees as follows:
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Company may, at its sole discretion, grant Customer access to
                  certain Versions of the Software or Services as it deems fit
                  on a non-exclusive, non-assignable, and strictly confidential
                  basis, enabling Customer to test and evaluate the
                  functionality and overall experience of such product under
                  everyday conditions and to provide feedback thereof to the
                  Company as well as report any bugs, flaws, or imperfections it
                  may discover in any of the Version or in affiliated materials.
                  The rights provided hereunder to test the Versions are fully
                  revocable at any time.
                  <ul className="list-disc ml-5 mt-5">
                    <li>
                      Customer shall provide to the Company in consideration for
                      access to the respective Version, feedback and statistics
                      for the Versions as supplied, including without limitation
                      market and customer testimonials thereof.
                    </li>
                    <li>
                      Customer will have the right to use the Version within the
                      meaning of these Terms and Conditions for the timeframe
                      designated by the Company.
                    </li>
                    <li>
                      Customer hereby grants to the Company the limited right to
                      use its name, logo, and/or trademark, as applicable, for
                      any advertising, promotional, or sales literature without
                      its prior consent. Company may also refer to the Customer
                      as a reference in marketing documentation and activities
                      relating to the Software or Services provided that such
                      use is in accordance with good business practice and in
                      goodwill.
                    </li>
                    <li>
                      During the testing period, the Company may ask that the
                      Customer provides feedback on the Version performance.
                      Customer agrees to provide the appropriate feedback within
                      the allocated period of time. By submitting its feedback
                      and evaluation of the Version, the Customer hereby grants
                      to the Company permission to use its feedback for the
                      purposes of subsequent product scoping, development, and
                      promotion and irrevocably assigns without limitation and
                      free of charge to the Company all right, title, and
                      interest in and to any such feedback with all intellectual
                      property rights connected or arising therein
                    </li>
                    <li>
                      Except for the rights expressly granted herein, Customer
                      shall not assert any right, title, or interest in or to
                      any Version or any pertinent documentation. Company
                      reserves any and all right, title, and interest in and to
                      any Version provided to the Customer.
                    </li>
                    <li>
                      Customer undertakes to hold for a period of five (5) years
                      upon expiry or termination of the testing period for
                      whatever reason, the Versions and any information provided
                      and obtained connected therewith in strict confidence, and
                      it shall not use, publish, make public, or disclose in any
                      form any information related to the Version or feedback
                      provided hereunder, including without limitation any
                      results, reports, bugs, feedback, images, or photographs
                      and any information provided and obtained connected with
                      the Versions. The Customer hereby agrees that it will not,
                      at any time, engage in any action either directly or
                      indirectly that disparages or results in the disparagement
                      of the Company or the Version.
                    </li>
                    <li>
                      In addition to Clause 15 of these Terms and Conditions,
                      the Customer acknowledges and agrees that the Beta Version
                      is a beta version under test, delivered on an as-is and
                      as-available basis and the Version may not operate
                      correctly and may be substantially modified prior to being
                      delivered, or withdrawn. The Company shall have no
                      liability or obligation of any kind to the Customer
                      concerning the Version. The Company does not guarantee or
                      warrant the Version in any way and disclaims any warranty
                      of fitness, merchantability, safety, and the like,
                      including without limitation their condition; conformity
                      to any representation or description; loss of date or
                      interruption of the service; the existence of any latent
                      or patent defects; and title, merchantability, or fitness
                      for a particular purpose or use. In no event shall the
                      Company be liable for any damage whatsoever arising out of
                      the use of or inability to use the Versions.
                    </li>
                    <li>
                      The Company shall not be obligated to provide the Customer
                      with any maintenance, technical or other support for the
                      Version.
                    </li>
                  </ul>
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold w-full">
              20. Governing Law and Jurisdiction
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  Unless specified otherwise, the place of performance of these
                  Terms and Conditions shall be the registered domicile of the
                  Company.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  These Terms and Conditions and this Clause 20 shall be
                  governed, construed, and interpreted in accordance with the
                  laws of the Republic of Kenya.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  The Parties hereto undertake to use their best efforts to
                  resolve any dispute arising out of or in connection with this
                  Agreement through consultation in good faith and mutual
                  understanding, provided that such consultation shall not
                  prejudice the exercise of any right or remedy of either Party
                  hereto by any such Party in respect of any such dispute
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  In the event the Parties are unable to solve any dispute
                  arising out of or in connection with these Terms and
                  Conditions within 60 (60) days from the date a Party raises a
                  dispute, the dispute shall be submitted to final and binding
                  mediation at the request of either of the Parties upon written
                  notice to that effect to the othe
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  The mediation shall take place in accordance with the Nairobi
                  Centre for International Arbitration – Mediation Rules as at
                  present in force.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">6.</div>
                <div>
                  Nothing herein shall preclude either Party from seeking
                  interim or permanent equitable or injunctive relief, or both,
                  from the Court having jurisdiction to grant the same. The
                  pursuit of equitable or injunctive relief shall not be a
                  waiver of the duty of the Parties to pursue any remedy for
                  monetary damages through the mediation described in this
                  clause.
                </div>
              </li>
            </div>
          </div>

          <div className="xl:p-10  p-2">
            <h1 className="xl:text-3xl text-xl font-semibold w-full">
              21. Miscellaneous Provisions
            </h1>
            <div className="mt-2 xl:text-2xl">
              <li className="flex">
                <div className="mr-2">1.</div>
                <div>
                  The Company reserves the right to amend or modify any
                  provision of these Terms and Conditions. Unless the Customer
                  is notified to the contrary by the Company in writing any such
                  amendments shall only apply after the expiry of the Initial
                  Subscription Period, or after the expiry of the current
                  Renewal Period as the case may be. The Customer has the right,
                  at any time, to request from the Company a copy of the
                  currently applicable Terms and Conditions. Continued use of
                  the Software constitutes your acceptance or deemed acceptance
                  of the terms as modified
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">2.</div>
                <div>
                  Save for the foregoing, any deviation from these Terms and
                  Conditions shall only be valid if agreed upon between the
                  Company and the Customer exclusively in written form. Any
                  general terms and conditions of a Customer or any third party
                  shall not apply, irrespective of whether the Company expressly
                  objects in a particular case or not.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">3.</div>
                <div>
                  The Company shall not be liable for any delay or failure in
                  performing hereunder if caused by factors beyond its
                  reasonable control, such as acts of God, acts of any
                  government, war or other hostility, civil disorder, the
                  elements, fire, explosion, power failure, equipment failure,
                  failure of telecommunications or Internet services, industrial
                  or labor dispute, inability to obtain necessary supplies and
                  the like.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">4.</div>
                <div>
                  The Company may assign or transfer any its obligations under
                  these Terms and Conditions or any rights and obligations
                  hereunder either to an Affiliate or to a third party in each
                  case, without the prior consent of the Customer. The Company
                  may without the prior written consent of Customer and without
                  notice assign any benefit or transfer, delegate, or
                  sub-contract any of their duties and obligations hereunder to
                  any third party
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">5.</div>
                <div>
                  The Customer shall not assign, sub-license, or otherwise
                  transfer any part or portion of the Software Subscription.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">6.</div>
                <div>
                  The Customer hereby covenants that it shall not, during and
                  for the period of one (01) year from the date of termination
                  of this Agreement, either by itself or through its affiliates,
                  hire, employ, or engage any person who has, during the Term of
                  this Agreement been an employee or consultant of Elimurise Learning
                  Edge Ltd. without the prior written consent of Elimurise Learning
                  Edge Ltd.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">7.</div>
                <div>
                  During the Term of this Agreement, the Customer shall not,
                  whether directly or indirectly, engage itself in a business
                  that is the same or similar to the Business of Elimurise Learning
                  Edge Ltd. Further, the Customer shall not, whether directly or
                  indirectly, during the Term of this Agreement, engage itself
                  in marketing, promotion, advertisement, and sales of the
                  products of any third party which is the same or similar to
                  the Products of Elimurise Learning Edge Ltd. After the agreement
                  ends, the Customer also agrees not to engage in a business
                  that is the same or similar to the business of Elimurise Learning
                  Edge Ltd. for a period of three (3) years.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">8.</div>
                <div>
                  Except as otherwise provided, all notices and correspondence
                  must be given in writing to the Company at
                  info@Elimuriselearning.co.ke or such other addresses as may from
                  time to time be notified to the Customer in writing; and to
                  Customer at the address set out in the applicable Order Form
                  unless otherwise notified to the Company in writing.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">9.</div>
                <div>
                  The Company’s General Terms and Conditions of Sale and General
                  Terms and Conditions of Rental, as amended from time to time,
                  may supplement these Terms and Conditions and govern the
                  Software Subscription and use of the Software by the Customer.
                </div>
              </li>
              <li className="flex">
                <div className="mr-2">10.</div>
                <div>
                  If individual provisions of these Terms and Conditions should
                  be invalid in whole or in part, the validity of the remaining
                  provisions or the valid parts of such provisions shall not be
                  affected.
                </div>
              </li>
            </div>
          </div>
        </div>

        <FooterComponent />
      </div>
    </>
  );
};

export default Terms;
