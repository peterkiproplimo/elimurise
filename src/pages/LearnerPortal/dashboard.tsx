import { useState } from "react";
import Lucide from "../../base-components/Lucide";
import Pagination from "../../base-components/Pagination";
import studentUrl from "../../assets/images/image.jpeg";
import { useAuth } from "../../contexts/Auth";

function Dashboard() {
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
  const auth = useAuth();
  const learner = auth?.authData?.user;
  const [page, setPage] = useState(1);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div className="flex">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <div className="bg-blue-100 p-6 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xl text-gray-500">{currentDate}</div>
            <div className="mt-2 text-3xl font-bold text-gray-800">
              Welcome back, {learner.first_name}!
            </div>
            <div className="text-gray-500">
              Always stay updated in your learner's portal
            </div>
          </div>
          <div className="flex items-center">
            <img src={studentUrl} alt="Welcome Image" className="w-24 h-24" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
