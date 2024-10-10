import React, { useEffect, useState } from "react";
import axios from "axios";
import LearningArea from "./LearningArea";
import * as ApiService from "../../services/auth";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";

const GradingScaleEditor = () => {
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [scale, setScale] = useState<any>({});
  const data = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGradingLearningArea();
  }, []);
  const fetchGradingLearningArea = async () => {
    isLoading(true);
    try {
      let res = await ApiService.getGradingScale(data?.id);
      setScale(res.data);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
    }
  };
  // const [scale, setScale] = useState<any>({
  //   _id: "67079acee1ae0061fc043d96",
  //   grade: {
  //     _id: "65cdce2035008be91fe8d331",
  //     level_id: "65cdce0535008be91fe8d325",
  //     name: "GRADE 7.",
  //     status: 0,
  //     createdAt: "2024-02-15T08:41:04.574Z",
  //     updatedAt: "2024-03-12T19:35:49.436Z",
  //     __v: 0,
  //     level: 8,
  //   },
  //   school: "66cda9a515af1f7f8eefa575",
  //   __v: 0,
  //   deafult: true,
  //   learningAreas: [
  //     {
  //       learning_area: {
  //         _id: "6645c712a82594d019e93ae1",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "Integrated science ",
  //         status: 0,
  //         createdAt: "2024-05-16T08:42:58.770Z",
  //         updatedAt: "2024-05-16T08:42:58.770Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e11d",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e11e",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e11f",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e120",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e11c",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f863a255c6d14acdfe601",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "Pre- Technical Studies.",
  //         status: 0,
  //         createdAt: "2024-04-29T11:36:26.122Z",
  //         updatedAt: "2024-04-29T11:36:26.122Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e122",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e123",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e124",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e125",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e121",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f80f9b0e27c598a26aea2",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "IRE",
  //         status: 0,
  //         createdAt: "2024-04-29T11:14:01.475Z",
  //         updatedAt: "2024-04-29T11:14:01.475Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e127",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e128",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e129",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e12a",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e126",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f74707ca522c412d54460",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "English.",
  //         status: 0,
  //         createdAt: "2024-04-29T10:20:32.877Z",
  //         updatedAt: "2024-04-29T10:20:32.877Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e12c",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e12d",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e12e",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e12f",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e12b",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f73787ca522c412d543bf",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "Creative Arts and Sports ",
  //         status: 0,
  //         createdAt: "2024-04-29T10:16:24.837Z",
  //         updatedAt: "2024-04-29T10:16:24.837Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e131",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e132",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e133",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e134",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e130",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f717d7ca522c412d54168",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "Agriculture & Nutrition.",
  //         status: 0,
  //         createdAt: "2024-04-29T10:07:57.814Z",
  //         updatedAt: "2024-04-29T10:07:57.814Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e136",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e137",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e138",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e139",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e135",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f6f8639c74a7d0036317b",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "CRE",
  //         status: 0,
  //         createdAt: "2024-04-29T09:59:34.052Z",
  //         updatedAt: "2024-04-29T09:59:34.052Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e13b",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e13c",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e13d",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e13e",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e13a",
  //     },
  //     {
  //       learning_area: {
  //         _id: "662f667a91aeabd467119f61",
  //         grade_id: "65cdce2035008be91fe8d331",
  //         name: "Mathematics",
  //         status: 0,
  //         createdAt: "2024-04-29T09:20:58.973Z",
  //         updatedAt: "2024-04-29T09:20:58.973Z",
  //         __v: 0,
  //       },
  //       gradings: [
  //         {
  //           mark: 80,
  //           score: 4,
  //           description: "Excellent",
  //           _id: "67079bf475ea1f11bd93e140",
  //         },
  //         {
  //           mark: 60,
  //           score: 3,
  //           description: "Good",
  //           _id: "67079bf475ea1f11bd93e141",
  //         },
  //         {
  //           mark: 50,
  //           score: 2,
  //           description: "Average",
  //           _id: "67079bf475ea1f11bd93e142",
  //         },
  //         {
  //           mark: 40,
  //           score: 1,
  //           description: "Needs Improvement",
  //           _id: "67079bf475ea1f11bd93e143",
  //         },
  //       ],
  //       _id: "67079bf475ea1f11bd93e13f",
  //     },
  //   ],
  //   name: "Service",
  // });

  const [activeTab, setActiveTab] = useState(0); // State to track the active tab

  // const handleGradeChange = (e: any) => {
  //   setScale({
  //     ...scale,
  //     grade: {
  //       ...scale.grade,
  //       [e.target.name]: e.target.value,
  //     },
  //   });
  // };

  // Save the grading scale (optional backend API integration)
  const handleSave = async () => {
    try {
      setUpdated(false);
      let res = await ApiService.updateGradingScale(scale);

      // const response = await axios.put(`/api/scales/${scale._id}`, scale);
      console.log("Scale updated successfully:", scale);
    } catch (error) {
      console.error("Error updating scale:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      {/* Grade Info Section */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="#"
            onClick={(e: any) => navigate("/home/grading", { replace: true })}
            className="cursor-pointer mr-5 "
          >
            <Lucide icon="ArrowLeft" className="text-slate-400 " />
          </a>
          <h2 className="text-lg font-bold">Performance Level Scale</h2>
        </div>
      </div>

      {/* Learning Areas Section */}
      {!loading ? (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-bold mb-4">{scale?.name}</h2>
          <div className="flex items-center justify-between border-b mb-4">
            <div className="flex-3 py-5">
              <label className="text-lg font-bold px-4 py-5">
                {" "}
                {scale?.grade?.name}
              </label>
            </div>
            {updated && (
              <div className="ml-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Publish Changes
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap border-b">
            {scale?.learningAreas?.map((area: any, index: any) => (
              <button
                key={area.learning_area._id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 focus:outline-none ${
                  activeTab === index
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {area.learning_area.name}
              </button>
            ))}
          </div>
          {/* Content of the active tab */}
          <div className="mt-4">
            {scale?.learningAreas?.map((area: any, index: any) => (
              <div
                key={area.learning_area._id}
                className={activeTab === index ? "block" : "hidden"}
              >
                <LearningArea
                  learningArea={area}
                  scale={scale}
                  setScale={setScale}
                  index={index}
                  setUpdated={setUpdated}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
        </div>
      )}

      {/* Save Button */}
    </div>
  );
};

export default GradingScaleEditor;
