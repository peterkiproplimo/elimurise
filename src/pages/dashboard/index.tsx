import _ from "lodash";
import clsx from "clsx";
import { useRef } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import ReportDonutChart from "../../components/ReportDonutChart";
import LeafletMap from "../../components/LeafletMap";
import { Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { useState } from "react";
import studentUrl from "../../assets/images/woman.jpeg";
import { useAuth } from "../../contexts/Auth";

function Main() {
  interface Learner {
    firstname: string;
    // Add other properties if needed
  }
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const auth = useAuth();
  const user = auth?.authData?.user as Learner;
  const [page, setPage] = useState(1);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
          <div className="grid  gap-6">
            <div className="col-span-12 mt-8 xl:col-span-12">
              <div className="flex items-center h-10 intro-y">
                <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
              </div>
              <div className="mt-5 intro-y">
                <div className="box bg-blue-100 shadow-md">
                  <div className="col-span-12 p-8 border-t border-dashed lg:col-span-8 lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300">
                    <div className="bg-white p-6 rounded-lg flex items-center justify-between ">
                      <div>
                        <div className="text-xl text-gray-500"></div>
                        <div className="mt-2 text-4xl  text-gray-800">
                          Welcome back,{user?.firstname}
                        </div>
                        <div className="text-gray-500 text-xl font-bold">
                          Always stay updated with the current status
                        </div>
                      </div>
                      <div className="flex items-center">
                        <img
                          src={studentUrl}
                          alt="Welcome Image"
                          className="w-64  "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 mt-2 md:col-span-6 lg:col-span-4">
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="flex pb-3 mb-3 border-b border-dashed text-slate-500 border-slate-200 dark:border-darkmode-300">
                  <div>Parameters</div>
                  <div className="ml-auto">Report Values</div>
                </div>

                <div className="flex items-center mb-5">
                  <div className="flex items-center">
                    <div>% New Visits</div>
                    <Tippy
                      className="flex ml-2 text-xs font-medium cursor-pointer text-danger"
                      content="49% Higher than last month"
                    >
                      -9%{" "}
                      <Lucide icon="ChevronDown" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                  <div className="ml-auto">32%</div>
                </div>
                <div className="flex items-center mb-5">
                  <div className="flex items-center">
                    <div>Average Tim On Site</div>
                  </div>
                  <div className="ml-auto">1.5M</div>
                </div>
                <Button
                  variant="outline-secondary"
                  className="relative justify-start w-full bg-success mb-2  border-slate-300 dark:border-darkmode-300"
                >
                  <span className="mr-5 truncate text-white">Continue</span>
                  <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                    <Lucide icon="ArrowRight" className="w-4 h-4 text-white" />
                  </span>
                </Button>
              </div>
            </div>
            <div className="col-span-12 mt-2 md:col-span-6 lg:col-span-4">
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="flex pb-3 mb-3 border-b border-dashed text-slate-500 border-slate-200 dark:border-darkmode-300">
                  <div>Page Names</div>
                  <div className="ml-auto">Page Views</div>
                </div>
                <div className="flex items-center mb-5">
                  <div>/letz-lara…review/2653</div>
                  <div className="ml-auto">83</div>
                </div>
                <div className="flex items-center mb-5">
                  <div>/icewall…review/1674</div>
                  <div className="ml-auto">21</div>
                </div>
                <Button
                  variant="outline-secondary"
                  className="relative justify-start w-full mb-2 bg-success border-slate-300 dark:border-darkmode-300 text-white"
                >
                  <span className="mr-5 truncate">Continue</span>
                  <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                    <Lucide icon="ArrowRight" className="w-4 h-4 " />
                  </span>
                </Button>
              </div>
            </div>
            <div className="col-span-12 mt-2 md:col-span-6 lg:col-span-4">
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="flex pb-3 mb-3 border-b border-dashed text-slate-500 border-slate-200 dark:border-darkmode-300">
                  <div>Keywords</div>
                  <div className="ml-auto">Searched</div>
                </div>
                <div className="flex items-center mb-5">
                  <div>Vue 3 Release Date</div>
                  <div className="ml-auto">201</div>
                </div>
                <div className="flex items-center mb-5">
                  <div>Install Vite Vue</div>
                  <div className="ml-auto">42</div>
                </div>
                <Button
                  variant="outline-secondary"
                  className="relative justify-start w-full mb-2 text-white bg-success border-slate-300 dark:border-darkmode-300"
                >
                  <span className="mr-5 truncate">Continue</span>
                  <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                    <Lucide icon="ArrowRight" className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>

            <div className="col-span-12 mt-2 ">
              <div className="mt-8  box overflow-auto intro-y lg:overflow-visible sm:mt-0">
                <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        IMAGES
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        STUDENT NAME
                      </Table.Th>
                      <Table.Th className="text-center border-b-0 whitespace-nowrap">
                        STOCK
                      </Table.Th>
                      <Table.Th className="text-center border-b-0 whitespace-nowrap">
                        STATUS
                      </Table.Th>
                      <Table.Th className="text-center border-b-0 whitespace-nowrap">
                        ACTIONS
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {_.take(fakerData, 4).map((faker, fakerKey) => (
                      <Table.Tr key={fakerKey} className="intro-x">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="flex">
                            <div className="w-10 h-10 image-fit zoom-in">
                              <Tippy
                                as="img"
                                alt="Midone Tailwind HTML Admin Template"
                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                src={faker.images[0]}
                                content={`Uploaded at ${faker.dates[0]}`}
                              />
                            </div>
                            <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                              <Tippy
                                as="img"
                                alt="Midone Tailwind HTML Admin Template"
                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                src={faker.images[1]}
                                content={`Uploaded at ${faker.dates[1]}`}
                              />
                            </div>
                            <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                              <Tippy
                                as="img"
                                alt="Midone Tailwind HTML Admin Template"
                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                src={faker.images[2]}
                                content={`Uploaded at ${faker.dates[2]}`}
                              />
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <a href="" className="font-medium whitespace-nowrap">
                            {faker.products[0].name}
                          </a>
                          <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            {faker.products[0].category}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          {faker.stocks[0]}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div
                            className={clsx([
                              "flex items-center justify-center",
                              { "text-success": faker.trueFalse[0] },
                              { "text-danger": !faker.trueFalse[0] },
                            ])}
                          >
                            <Lucide
                              icon="CheckSquare"
                              className="w-4 h-4 mr-2"
                            />
                            {faker.trueFalse[0] ? "Active" : "Inactive"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center justify-center">
                            <a className="flex items-center mr-3" href="">
                              <Lucide
                                icon="CheckSquare"
                                className="w-4 h-4 mr-1"
                              />
                              Edit
                            </a>
                            <a
                              className="flex items-center text-danger"
                              href=""
                            >
                              <Lucide icon="Trash2" className="w-4 h-4 mr-1" />{" "}
                              Delete
                            </a>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
           
            </div>
          </div>
        </div>
         <div className="col-span-12 2xl:col-span-3 box">
          <div className=" 2xl:border-l">
            <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
              <div className="col-span-12 mt-3 mr-5 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="flex items-center h-10 intro-x">
                  <h2 className=" text-lg font-medium truncate">
                    Teachers
                  </h2>
                </div>
                <div className="mt-2">
                  {_.take(fakerData, 3).map((faker, fakerKey) => (
                    <div key={fakerKey} className="intro-x">
                      <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={faker.photos[0]}
                          />
                        </div>
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">
                            {faker.users[0].name}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {faker.dates[0]}
                          </div>
                        </div>
                        <div
                          className={clsx({
                            "text-success": faker.trueFalse[0],
                            "text-danger": !faker.trueFalse[0],
                          })}
                        >
                          {faker.trueFalse[0] ? "+" : "-"}${faker.totals[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    href=""
                    className="block w-full py-3 text-center border bg-success text-white rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                  >
                    See More
                  </a>
                </div>
              </div>

              <div className="col-span-12 mt-2  mr-5 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                <div className="flex items-center h-10 intro-x">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Parents
                  </h2>
                </div>
                <div className="mt-5">
                  {_.take(fakerData, 3).map((faker, fakerKey) => (
                    <div key={fakerKey} className="intro-x">
                      <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={faker.photos[0]}
                          />
                        </div>
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">
                            {faker.users[0].name}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {faker.dates[0]}
                          </div>
                        </div>
                        <div
                          className={clsx({
                            "text-success": faker.trueFalse[0],
                            "text-danger": !faker.trueFalse[0],
                          })}
                        >
                          {faker.trueFalse[0] ? "+" : "-"}${faker.totals[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    href=""
                    className="block w-full py-3 text-center border bg-success text-white rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                  >
                    See More
                  </a>
                </div>
              </div>
              <div className="col-span-12 mr-5">
                <div className="mt-5 before:hidden xl:before:block intro-y">
                  <div className="p-5 box">
                    <div className="mt-3">
                      <ReportDonutChart height={196} />
                    </div>
                    <div className="mx-auto mt-8 w-52 sm:w-auto">
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                        <span className="truncate">Ongoing</span>
                        <span className="ml-auto font-medium">60%</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                        <span className="truncate">Upcoming</span>
                        <span className="ml-auto font-medium">15%</span>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                        <span className="truncate">Completed</span>
                        <span className="ml-auto font-medium">15%</span>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="w-2 h-2 mr-3 rounded-full bg-danger"></div>
                        <span className="truncate">Out of time</span>
                        <span className="ml-auto font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
