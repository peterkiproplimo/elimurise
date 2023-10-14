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
import { getUsers } from "../../services/auth";

import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import Dropzone from "../../base-components/Dropzone";
import TomSelect from "../../base-components/TomSelect";

function Main() {
  const [countries] = useState([
    { name: "Afghanistan", code: "AF" },
    { name: "Åland Islands", code: "AX" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "AndorrA", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Bouvet Island", code: "BV" },
    { name: "Brazil", code: "BR" },
    { name: "British Indian Ocean Territory", code: "IO" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cape Verde", code: "CV" },
    { name: "Cayman Islands", code: "KY" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Christmas Island", code: "CX" },
    { name: "Cocos (Keeling) Islands", code: "CC" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo, The Democratic Republic of the", code: "CD" },
    { name: "Cook Islands", code: "CK" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cote D'Ivoire", code: "CI" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Ethiopia", code: "ET" },
    { name: "Falkland Islands (Malvinas)", code: "FK" },
    { name: "Faroe Islands", code: "FO" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "French Guiana", code: "GF" },
    { name: "French Polynesia", code: "PF" },
    { name: "French Southern Territories", code: "TF" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Gibraltar", code: "GI" },
    { name: "Greece", code: "GR" },
    { name: "Greenland", code: "GL" },
    { name: "Grenada", code: "GD" },
    { name: "Guadeloupe", code: "GP" },
    { name: "Guam", code: "GU" },
    { name: "Guatemala", code: "GT" },
    { name: "Guernsey", code: "GG" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Heard Island and Mcdonald Islands", code: "HM" },
    { name: "Holy See (Vatican City State)", code: "VA" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran, Islamic Republic Of", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Isle of Man", code: "IM" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jersey", code: "JE" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea, Democratic People'S Republic of", code: "KP" },
    { name: "Korea, Republic of", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Lao People'S Democratic Republic", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libyan Arab Jamahiriya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macao", code: "MO" },
    { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Martinique", code: "MQ" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mayotte", code: "YT" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia, Federated States of", code: "FM" },
    { name: "Moldova, Republic of", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montserrat", code: "MS" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "Netherlands Antilles", code: "AN" },
    { name: "New Caledonia", code: "NC" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Niue", code: "NU" },
    { name: "Norfolk Island", code: "NF" },
    { name: "Northern Mariana Islands", code: "MP" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestinian Territory, Occupied", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Pitcairn", code: "PN" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Qatar", code: "QA" },
    { name: "Reunion", code: "RE" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation", code: "RU" },
    { name: "RWANDA", code: "RW" },
    { name: "Saint Helena", code: "SH" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Pierre and Miquelon", code: "PM" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia and Montenegro", code: "CS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Svalbard and Jan Mayen", code: "SJ" },
    { name: "Swaziland", code: "SZ" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Taiwan, Province of China", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania, United Republic of", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tokelau", code: "TK" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Turks and Caicos Islands", code: "TC" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "United States Minor Outlying Islands", code: "UM" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Virgin Islands, British", code: "VG" },
    { name: "Virgin Islands, U.S.", code: "VI" },
    { name: "Wallis and Futuna", code: "WF" },
    { name: "Western Sahara", code: "EH" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ]);

  const [dialog, setDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [conferences, setConferences] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 1,
    total_pages: 1,
    per_page: 1,
  });
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [select_role] = useState([
    "ADMIN",
    "GENERAL MANAGER",
    "MANAGER",
    "MARKETER",
  ]);
  const [selectUserRole, setUserRole] = useState([""]);

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      tenant: yup.string().required("Conference is required"),
      role: yup.string().required("Role is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
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
    getUsers();
    getRoles();
    // getConferences();
  }, []);

  const getUsers = async () => {
    const response = await ApiService.getUsers({ page: 1 });
    setUsers(response);
    console.log(response);
  };

  // const getUsers = async () => {
  //   isLoading(true);
  //   try {
  //     let res = await ApiService.getUsers({ page: 1 });
  //     setUsers(res.users);
  //     isLoading(false);
  //     setNextPage(page < res.total_pages ? page + 1 : res.total_pages);
  //     setPreviousPage(page > 1 ? page - 1 : 1);
  //     setPagination({
  //       current_page: res.current_page,
  //       total: res.total,
  //       total_pages: res.total_pages,
  //       per_page: res.per_page,
  //     });
  //   } catch (error) {
  //     isLoading(false);
  //     console.log("Error fetching users");
  //   }
  // };

  const getRoles = async () => {
    let res = await ApiService.getRoles();
    setRoles(res);
    console.log(res);
  };

  // const getConferences = async () => {
  //   let res = await ApiService.getConferences();
  //   setConferences(res.users);
  //   setPagination({ current_page: res.current_page, total: res.total, total_pages: res.total_pages, per_page: res.per_page });
  // };
  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        await ApiService.createUser(
          data.username,
          data.phone,
          data.password,
          data.roleId
        );
        await getUsers();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("User created successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message || "An error occurred while creating user.");
        notify.current?.showToast();
      }
    }
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteUser(userId);
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

  return (
    //for user table
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">System Users</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <Button
            variant="primary"
            className="mr-2 shadow-md"
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              setDialog(true);
            }}
          >
            New User
          </Button>
          <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                Excel
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                PDF
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing{" "}
            {pagination.current_page +
              " to " +
              pagination.total_pages +
              " of " +
              pagination.total}{" "}
            entries
          </div>
          <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="w-56 ml-2 xl:w-auto !box">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </FormSelect>
          </div>
        </div>
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap"></Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  USERNAME
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  PHONE
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  PASSWORD
                </Table.Th>

                <Table.Th className="border-b-0 whitespace-nowrap">
                  ROLE
                </Table.Th>
                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                  COUNTRY
                </Table.Th> */}
                <Table.Th className="border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user: any, key) => (
                <Table.Tr key={key} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <FormCheck.Input type="checkbox" />
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-9 h-9 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt=""
                          className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={user.photo}
                          content={user.firstname + " " + user.lastname}
                        />
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.username}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.phone}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.password}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.roleId}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": user.approval_status },
                        { "text-danger": !user.approval_status },
                      ])}
                    >
                      <Lucide
                        icon={user.approval_status ? "CheckSquare" : "XSquare"}
                        className="w-4 h-4 mr-2"
                      />
                      {user.approval_status ? "Active" : "Inactive"}
                    </div>
                  </Table.Td>
                  {/* <Table.Td className="first:rounded-l-md last:rounded-r-md capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {user.nationality}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": user.nationality },
                        { "text-danger": !user.nationality },
                      ])}
                    >
                      <Lucide
                        icon={user.nationality ? "CheckSquare" : "XSquare"}
                        className="w-4 h-4 mr-2"
                      />
                      {user.nationality ? "Active" : "Inactive"}
                    </div>
                  </Table.Td> */}
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center justify-center">
                      <Menu>
                        <Menu.Button as={Button} className="px-2 !box">
                          <span className="flex items-center justify-center w-5 h-5">
                            <Lucide icon="MoreVertical" className="w-4 h-4" />
                          </span>
                        </Menu.Button>
                        <Menu.Items className="w-40">
                          <Menu.Item>
                            <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setUserId(user.id), setConfirmDelete(true);
                            }}
                          >
                            <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                            Delete
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="View" className="w-4 h-4 mr-2" />{" "}
                            Profile
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="UserCheck" className="w-4 h-4 mr-2" />{" "}
                            Activate
                          </Menu.Item>
                          <Menu.Item>
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Email Credentials
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {loading && (
            <div className="flex flex-col items-center">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          )}
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link
              onClick={() => (setPage(previous_page), getUsers())}
            >
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            {_.times(pagination.total_pages).map((page, key) =>
              page + 1 == pagination.current_page ? (
                <Pagination.Link
                  onClick={() => (setPage(page + 1), getUsers())}
                  active
                  key={key}
                >
                  {page + 1}
                </Pagination.Link>
              ) : (
                <Pagination.Link
                  onClick={() => (setPage(page + 1), getUsers())}
                  key={key}
                >
                  {page + 1}
                </Pagination.Link>
              )
            )}
            <Pagination.Link onClick={() => (setPage(next_page), getUsers())}>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect className="w-20 mt-3 !box sm:mt-0">
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
      <Dialog
        staticBackdrop
        size="lg"
        open={dialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <Dialog.Panel>
          <form className="validate-form" onSubmit={onSubmit}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">New User</h2>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(false);
                }}
                className="absolute top-0 right-0 mt-3 mr-3"
                href="#"
              >
                <Lucide icon="X" className="w-8 h-8 text-slate-400" />
              </a>
            </Dialog.Title>
            <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Username</FormLabel>
                <FormInput
                  {...register("firstName")}
                  type="text"
                  name="firstName"
                  className={errors.firstname ? "border-danger" : ""}
                  placeholder="John"
                />
                {errors.firstname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.firstname.message === "string" &&
                      errors.firstname.message}
                  </div>
                )}
              </div>
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Last Name
                </FormLabel>
                <FormInput
                  {...register("lastName")}
                  type="text"
                  name="lastName"
                  className={errors.lastname ? "border-danger" : ''}
                  placeholder="Doe"
                />
                {errors.lastname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastname.message === "string" &&
                      errors.lastname.message}
                  </div>
                )}
              </div> */}
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  Conference
                </FormLabel>
                <FormSelect {...register("tenant")} name="tenant">
                  {conferences.map((conference: any, key) => <option key={key} value={conference._id} >{conference.name}</option>)}
                </FormSelect>
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div> */}
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  Role
                </FormLabel>
                <FormSelect {...register("role")} name="role">
                  {roles.map((role: any, key) => <option key={key} value={role._id} >{role.role}</option>)}
                </FormSelect>
                {errors.role && (
                  <div className="mt-2 text-danger">
                    {typeof errors.role.message === "string" &&
                      errors.role.message}
                  </div>
                )}
              </div> */}
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  Country
                </FormLabel>
                <FormSelect {...register("country")} name="country" value={"Kenya"}>
                  {countries.map((country, key) => <option key={key} value={country.name} >{country.name}</option>)}
                </FormSelect>
              </div> */}
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Phone Number
                </FormLabel>
                <FormInput
                  {...register("phoneNumber")}
                  type="text"
                  name="phoneNumber"
                  placeholder="+254 712 345 6789"
                />
              </div> */}

              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Email
                </FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.email ? "border-danger" : ''}
                  placeholder="info@example.com"
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div> */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Phone</FormLabel>
                <FormInput
                  {...register("phone")}
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                />
              </div>

              <div className="col-span-12 sm:col-span-12">
                <FormLabel htmlFor="modal-form-6">User Status</FormLabel>
                <FormSelect className="w-56 ml-2 xl:w-auto !box">
                  <option>Select Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </FormSelect>

                {errors.model && (
                  <div className="mt-2 text-danger">
                    {typeof errors.model.message === "string" &&
                      errors.model.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-12">
                <FormLabel htmlFor="modal-form-6">Roles</FormLabel>
                <TomSelect
                  value={selectUserRole}
                  onChange={setUserRole}
                  options={{
                    placeholder: "Select Role",
                  }}
                  className="w-full"
                  multiple
                >
                  {roles.map((role: any) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </TomSelect>
              </div>
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  ROLE
                </FormLabel>
                <FormInput
                  {...register("role")}
                  type="text"
                  name="role"
                  placeholder="Admin"
                />
              </div> */}
              {/* <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Linkedin
                </FormLabel>
                <FormInput
                  {...register("linkedin")}
                  type="text"
                  name="linkedin"
                  placeholder="https://www.linkedin.com/"
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Twitter
                </FormLabel>
                <FormInput
                  {...register("twitter")}
                  type="text"
                  name="twitter"
                  placeholder="https://twitter.com/"
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">
                  Facebook
                </FormLabel>
                <FormInput
                  {...register("facebook")}
                  type="text"
                  name="linkedin"
                  placeholder="https://www.facebook.com/"
                />
              </div> */}

              {/* <div className="col-span-12 sm:col-span-12">
                <Dropzone getRef={(el) => { }}
                  options={{
                    url: "https://africaclimatesummit.org/",
                    thumbnailWidth: 150,
                    maxFilesize: 0.5,
                    maxFiles: 1,
                    headers: { "My-Awesome-Header": "header value" },
                  }}
                  className="dropzone"
                >
                  <div className="text-lg font-medium">
                    Upload profile photo.
                  </div>
                  <div className="text-gray-600">
                    Optional
                  </div>
                </Dropzone>
              </div> */}
            </Dialog.Description>
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setDialog(false);
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
            </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>
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

export default Main;
