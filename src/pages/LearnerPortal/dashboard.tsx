import { useEffect, useState } from "react";
import Lucide from "../../base-components/Lucide";
import Pagination from "../../base-components/Pagination";
import studentUrl from "../../assets/images/image.jpeg";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  interface Learner {
    first_name: string;
    // Add other properties if needed
  }
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<any>({
    learners: [],
  });
  const [learners, setLearners] = useState<any>([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const auth = useAuth();
  const learner = auth?.authData?.user as Learner;
  const [page, setPage] = useState(1);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  useEffect(() => {
    getLeaners();
  }, []);
  const getLeaners = async () => {
    const response = await ApiService.parentDashboard();

    setLearners(response.learners);
  };
  return (
    <main className="flex-1 overflow-y-auto bg-gray-10">
      {/* <div className="container mx-auto px-6 py-8"> */}
      <div className=" rounded-lg shadow-lg p-6">
        <div className= "box flex items-center justify-between mb-6">
          <div>
            <div className="text-2xl font-semibold text-gray-800">
              {currentDate}
            </div>
            <div className="mt-2 text-4xl font-bold text-gray-900">
              Welcome back, {learner?.first_name}
            </div>
            <div className="text-gray-600">
              Always stay updated in your learner's portal
            </div>
          </div>
          <div className="flex-shrink-0">
            <img
              src={studentUrl}
              alt="Welcome Image"
              className="w-24 h-24 rounded-full"
            />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Your Learners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {learners.map((learner: any) => (
              <div
                onClick={() => {
                  localStorage.setItem("learner", JSON.stringify(learner));
                  navigate("/v1/profile", {});
                }}
                key={learner._id}
                className="bg-white rounded-lg overflow-hidden p-5 shadow-lg cursor-pointer"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={studentUrl}
                      alt="Learner Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4 flex flex-col">
                      <span className="text-sm font-bold text-gray-600 mt-1">
                        {learner?.stream?.grade?.name} {learner?.stream?.name}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {learner?.learner?.first_name}{" "}
                        {learner?.learner?.surname}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}

export default Dashboard;
