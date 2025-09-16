import axios from "axios";
import * as c from "../utils/constants";
import { FieldValues } from "react-hook-form";
const config = { headers: { "Content-Type": "multipart/form-data" } };

export async function login(data: FieldValues) {
  try {
    let res = await axios.post(c.LOGIN, data);
    console.log("hellll");
    return res?.data;
  } catch (e) {
    console.log("hellllerror");

    throw handler(e);
  }
}
export async function login_parent(data: FieldValues) {
  try {
    let res = await axios.post(c.PARENT + "/auth/login", data);
    getData();
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
const getData = async () => {
  try {
    const auth = await localStorage.getItem("@AuthData");

    if (auth !== null) {
      // value previously stored
      let auth_data = JSON.parse(auth);
      let user = auth_data?.user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      return user;
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
getData();

// // Add a request interceptor
axios.interceptors.request.use(
  async (config) => {
    try {
      const user = await getData();

      // Assuming `getData()` returns an object with a token or some user info
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }

      return config;
    } catch (error) {
      // Handle the error as needed
      console.error("Interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    // Handle request error
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export const getPackages = async (data: any) => {
  try {
    await getData();
    let res = await axios.get(c.PACKAGE + "/", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const scedule_demo = async (data: any) => {
  try {
    let res = await axios.post(
      "https://staging.herolearning.co.ke/api/method/hero.hero.apis.appointment.schedule_appointment",
      data
    );
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const get_schedule_demo = async () => {
  try {
    let res = await axios.get(
      "https://staging.herolearning.co.ke/api/method/hero.hero.apis.appointment.get_booked_dates"
    );
    return res.data.message; // Assuming booked dates are inside `message`
  } catch (e) {
    throw handler(e);
  }
};

export const getSubscriptions = async (data: any) => {
  try {
    await getData();
    let res = await axios.get(c.SUBSCRIPTION + "/invoices", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getPrintSubscription = async (data: any) => {
  try {
    await getData();
    let res = await axios.get(c.SUBSCRIPTION + "/trasactions/" + data._id, {
      params: data,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createSubscription(data: FieldValues) {
  try {
    let res = await axios.post(c.REGISTER, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function paySubscription(data: FieldValues) {
  try {
    let res = await axios.post(`${c.SUBSCRIPTION}/${data._id}/pay`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getAcademic = async (data: any) => {
  try {
    let res = await axios.get(c.ACADEMIC, {
      params: data,
    });
    console.log(data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getSchoolDetails = async (data: any) => {
  try {
    let res = await axios.get(`${c.SCHOOL}/current`, {
      params: data,
    });
    console.log(data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const setCurrentSettings = async (data: any) => {
  try {
    const res = await axios.put(`${c.SCHOOL}/update`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!res.data) {
      throw new Error('No response data received');
    }

    return res;
  } catch (e: any) {
    console.error('School update error:', e.response?.data || e.message);
    throw {
      message: e.response?.data?.message || e.message || 'Failed to update school settings',
      response: e.response
    };
  }
};

export async function importLearners(data: FieldValues) {
  try {
    let res = await axios.post(c.LEARNERS + "/import", data, {
      responseType: "blob",
    });
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:]/g, "").split(".")[0]; // Format: YYYYMMDDTHHMMSS
    const filename = `learners_${formattedDate}.csv`;

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Filename with date and time
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function exportLearners(data: FieldValues) {
  try {
    let res = await axios.post(c.LEARNERS + "/export", data, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "learners.csv"); // Filename for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    link.remove(); // Clean up the DOM

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function importParents(data: FieldValues) {
  try {
    let res = await axios.post(c.PARENTS + "/import", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function sendWecomeEmail(data: any) {
  try {
    let res = await axios.put(c.PARENTS + "/welcome-email/" + data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function exportParents(data: FieldValues) {
  try {
    let res = await axios.post(c.PARENTS + "/export", data, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "parents.csv"); // Filename for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    link.remove(); // Clean up the DOM

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function importTeachers(data: FieldValues) {
  try {
    let res = await axios.post(c.TEACHERS + "/import", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function exportTeachers(data: FieldValues) {
  try {
    let res = await axios.post(c.TEACHERS + "/export", data, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "teachers.csv"); // Filename for download
    document.body.appendChild(link);
    link.click(); // Trigger the download
    link.remove(); // Clean up the DOM

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function createAcademic(data: any) {
  try {
    if (data._id) {
      let res = await axios.put(c.ACADEMIC + "/" + data?._id, data);

      return res.data;
    } else {
      let res = await axios.post(c.ACADEMIC, data);

      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteAcademic(Id: any) {
  try {
    let res = await axios.delete(c.ACADEMIC + "/" + Id);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

//term

export const getTerm = async (data: any) => {
  try {
    let res = await axios.get(c.TERM, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createTerm(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.TERM + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.TERM, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteTerm(gradeId: any) {
  try {
    let res = await axios.delete(c.TERM + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
//summative tests
export const getTests = async (data: any) => {
  try {
    let res = await axios.get(c.TESTS, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTestsDone = async (data: any) => {
  try {
    let res = await axios.get(c.TESTS + "/assessed-tests", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const createSummativeTests = async (data: any) => {
  try {
    let res = await axios.post(c.SUMMATIVE, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createTests(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.TESTS + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.TESTS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteTests(data: any) {
  try {
    let res = await axios.delete(c.TESTS + "/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function publishTest(data: any, other: any) {
  try {
    let res = await axios.patch(c.TESTS + "/" + data + "/publish", {
      data: other,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

//streams
export const getStream = async (data: any) => {
  try {
    let res = await axios.get(c.STREAMS, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getAttendance = async (data: any) => {
  try {
    let res = await axios.get(c.ATTENDANCE, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getAttendanceSummary = async (data: any) => {
  try {
    let res = await axios.get(c.ATTENDANCE + "/monthly-analysis", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getAttendanceMonthlySummary = async (data: any) => {
  try {
    let res = await axios.get(c.ATTENDANCE + "/monthly-summary", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getAttendanceMonthlyAnalysis = async (data: any) => {
  try {
    let res = await axios.get(c.ATTENDANCE + "/getMonthlyAttendanceSummary", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createAttendance = async (data: any) => {
  try {
    console.log("data", data);
    let res = await axios.post(c.ATTENDANCE, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createStream(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.STREAMS + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.STREAMS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteStream(gradeId: any) {
  try {
    let res = await axios.delete(c.STREAMS + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// export const getLearners =async (data:any, filter:any) => {
//   try {
//       let res = await axios.get(c.LEARNERS,{params:data});
//       return res.data;
//     } catch (e) {
//       throw handler(e);
//     }
//   }

export const getGrades = async (data: any) => {
  try {
    let res = await axios.get(c.GRADES, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const getParentNotifications = async (data: any) => {
  try {
    let res = await axios.get(c.PARENT + "/notifications/list", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const dismissParentNotifications = async (data: any) => {
  try {
    let res = await axios.put(c.PARENT + "/notifications/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getNotificeBoardParent = async (data: any) => {
  try {
    let res = await axios.get(c.PARENT + "/noticeboard", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getNotificeBoard = async (data: any) => {
  try {
    let res = await axios.get(c.SCHOOL_PATH + "/noticeboard", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createNotificeBoard = async (data: any) => {
  try {
    let res = await axios.post(c.SCHOOL_PATH + "/noticeboard", data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const updateNotificeBoard = async (id: any, data: any) => {
  try {
    let res = await axios.put(c.SCHOOL_PATH + "/noticeboard/" + id, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const deleteNotificeBoard = async (data: any) => {
  try {
    let res = await axios.delete(c.SCHOOL_PATH + "/noticeboard/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getSchoolNotifications = async (data: any) => {
  try {
    let res = await axios.get(c.SCHOOL_PATH + "/notifications/list", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const dissmissSchoolNotifications = async (data: any) => {
  try {
    let res = await axios.put(c.SCHOOL_PATH + "/notifications/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export async function deleteGrade(gradeId: any) {
  try {
    let res = await axios.delete(c.GRADES + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getLearnersEnroll = async (data: any, filter: any) => {
  try {
    let res = await axios.get(c.LEARNERS, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getLearners = async (data: any, filter: any) => {
  try {
    let res = await axios.get(c.LEARNERS + "/all-by-session", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getEnrolments = async (data: any, filter: any) => {
  try {
    let res = await axios.get(c.ENROLLMENT, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTransfersRequests = async (data: any, filter: any) => {
  try {
    let res = await axios.get(c.ACADEMIC, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTransfers = async (data: any) => {
  try {
    let res = await axios.get(c.TRANSFERS, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getEnrolmentsByStream = async (data: any, filter: any) => {
  try {
    let res = await axios.get(c.ENROLLMENT + "/" + data.stream, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTransfersIncomming = async (data: any) => {
  try {
    let res = await axios.get(c.TRANSFERS + "/incomming", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const getLearnersTransfers = async (data: any) => {
  try {
    let res = await axios.get(c.PARENT + "/v1/tranfer-requests/", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createTransfers = async (data: any) => {
  try {
    let res = await axios.post(c.TRANSFERS, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const updateTransfers = async (data: any) => {
  try {
    let res = await axios.post(c.TRANSFERS + "/approve", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const payForTransfer = async (data: any) => {
  try {
    let res = await axios.post(c.PARENT + "/v1/pay", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const toggleIdicatorStatus = async (id: any, data: any) => {
  try {
    let res = await axios.put(c.ASSESSMENT + "/publish/" + id, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export async function createLearner(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.LEARNERS + "/" + data._id, data, config);
      return res.data;
    } else {
      let res = await axios.post(c.LEARNERS, data, config);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteLearner(gradeId: any) {
  try {
    let res = await axios.delete(c.LEARNERS + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function toggleLearnerStatus(gradeId: any) {
  try {
    let res = await axios.put(c.LEARNERS + "/" + gradeId + "/status");
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteTransfer(transferId: any) {
  try {
    let res = await axios.delete(c.TRANSFERS + "/" + transferId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getBehaviour() {
  try {
    let res = await axios.get(c.BEHAVIOUR);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function sendMessage(data: any) {
  try {
    console.log(data);
    let res = await axios.post(c.MESSAGE + "/send", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function sendMessageParent(data: any) {
  try {
    console.log(data);
    let res = await axios.post(c.MESSAGE_PARENT + "/send", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getAdminMessages(data: any) {
  try {
    console.log(data);
    let res = await axios.get(c.MESSAGE + "/admin-messages/" + data.parentId);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getMessage(data: any) {
  try {
    console.log(data);
    let res = await axios.get(c.MESSAGE + "/" + data.parent, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getMessageParent(data: any) {
  try {
    console.log(data);
    let res = await axios.get(c.MESSAGE_PARENT + "/" + data.parent, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getAdminParentChats() {
  try {
    let res = await axios.get(c.MESSAGE + "/chat-heads-admin");
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getChatheads() {
  try {
    let res = await axios.get(c.MESSAGE_PARENT + "/chat-heads");
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
getAdminParentChats;
export async function createBehaviour(data: any) {
  try {
    let res = await axios.post(c.BEHAVIOUR, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getParents = async (data: any) => {
  try {
    let res = await axios.get(c.PARENTS, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getParentsById = async (id: any) => {
  try {
    let res = await axios.get(c.PARENTS + "/" + id);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getOneParents = async (data: any) => {
  try {
    let res = await axios.post(`${c.PARENTS}/search`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createParents(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.PARENTS + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.PARENTS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function parentDashboard() {
  try {
    let res = await axios.get(c.PARENT + "/v1/dashboard");
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function parentAttendance(data: any) {
  try {
    let res = await axios.get(c.PARENT + "/v1/attendance/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function leanerClasses(learner: any) {
  try {
    let res = await axios.get(c.PARENT + "/v1/learner-classes", {
      params: learner,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function learnerHistory(learner: any) {
  try {
    let res = await axios.get(c.LEARNERS + "/" + learner + "/history");
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteParents(userId: any) {
  try {
    let res = await axios.delete(c.PARENTS + "/" + userId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getTeachers = async (data: any) => {
  try {
    let res = await axios.get(c.TEACHERS, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTeacher = async (data: any) => {
  try {
    let res = await axios.get(c.TEACHERS + "/" + data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createTeachers(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.TEACHERS + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.TEACHERS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteTeachers(userId: any) {
  try {
    let res = await axios.delete(c.TEACHERS + "/" + userId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export const getLearningAreas = async (data: any) => {
  try {
    let res = await axios.get(c.LEARNING_AREA, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTimetables = async (filter: any) => {
  try {
    const res = await axios.get(`${c.Timetable}/timetable`, { params: filter });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getTimetableTeacher = async (filter: any) => {
  try {
    const res = await axios.get(`${c.Timetable}/timetable/teacher`, {
      params: filter,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Update a timetable entry by ID
export const updateTimetablePeriod = async (data: any) => {
  try {
    console.log(data);
    const res = await axios.post(`${c.Timetable}/timetable`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const deleteTimetablePeriod = async (data: any) => {
  try {
    console.log(data);
    const res = await axios.delete(`${c.Timetable}/timetable/${data}`);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Fetch time slots with optional filters
export const getTimeSlots = async (filter: any) => {
  try {
    const res = await axios.get(`${c.Timetable}/timeslot`, { params: filter });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Update a time slot by ID
export const updateTimeSlot = async (id: any, data: any) => {
  try {
    const res = await axios.put(`${c.Timetable}/timeslot/${id}`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
// New TimeSlot CRUD functions
export const createTimeSlot = async (data: any) => {
  try {
    const res = await axios.post(`${c.Timetable}/timeslot`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const deleteTimeSlot = async (id: any) => {
  try {
    const res = await axios.delete(`${c.Timetable}/timeslot/${id}`);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
// Fetch all special programs (with optional filters if needed in the future)
export const getSpecialPrograms = async (filter: any = {}) => {
  try {
    const res = await axios.get(`${c.Timetable}/special-program`, {
      params: filter,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Fetch a single special program by ID
export const getSpecialProgramById = async (id: string) => {
  try {
    const res = await axios.get(`${c.Timetable}/special-program/${id}`);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Create a new special program
export const createSpecialProgram = async (data: any) => {
  try {
    const res = await axios.post(`${c.Timetable}/special-program`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Update a special program by ID
export const updateSpecialProgram = async (id: string, data: any) => {
  try {
    const res = await axios.put(`${c.Timetable}/special-program/${id}`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

// Delete a special program by ID
export const deleteSpecialProgram = async (id: string) => {
  try {
    const res = await axios.delete(`${c.Timetable}/special-program/${id}`);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const getCounties = async (data: any) => {
  try {
    let res = await axios.get(c.COUNTIES, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createLearningArea(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.LEARNING_AREA + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.LEARNING_AREA, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function updateLearningArea(id: string, data: FieldValues) {
  try {
    let res = await axios.put(c.LEARNING_AREA + "/" + id, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteLearningArea(gradeId: any) {
  try {
    let res = await axios.delete(c.LEARNING_AREA + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getStrands = async (data: any, filter: any) => {
  try {
    if (filter.learning_area === "na" || !filter.learning_area) {
        return { data: [], pagination: { current_page: 1, total_pages: 1, total: 0 } };
    }
    
    // Handle term parameter - if it's 'na' or undefined, don't include it in URL
    const termParam = filter.term && filter.term !== "na" ? `/${filter.term}` : "/all";
    let res = await axios.get(
      `${c.STRANDS}/${filter.learning_area}${termParam}`,
      {
        params: data,
      }
    );
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

//  export const getStrands =async (data: any) => {
//           try {
//               let res = await axios.get(c.STRANDS,{
//                 params:data
//               });
//               return res.data;
//             } catch (e) {
//               throw handler(e);
//             }
//           }

export async function createStrand(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.STRANDS, data);
      return res.data;
    } else {
      let res = await axios.post(c.STRANDS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}
export async function fetchPromotion(data: FieldValues) {
  try {
    let res = await axios.post(c.ENROLLMENT + "/enroll", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function leanersPromote(data: FieldValues) {
  try {
    let res = await axios.put(c.ENROLLMENT + "/enroll", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteStrand(gradeId: any) {
  try {
    let res = await axios.delete(c.STRANDS + "/" + gradeId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function activateorDeactivateUsers(data: FieldValues) {
  try {
    if (data.status !== 1) {
      const res = await axios.put(`${c.USERS}/${data._id}/activate`, data);
      return res.data;
    } else {
      const res = await axios.put(`${c.USERS}/${data._id}/deactivate`, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}
export async function createUser(data: FieldValues) {
  try {
    if (data._id) {
      const res = await axios.put(c.USERS + "/" + data._id, data);
      return res.data;
    } else {
      const res = await axios.post(c.USERS, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export const getSubstrand = async (data: any) => {
  try {
    let res = await axios.get(c.SUBSTRAND, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getAssessmentLerners = async (data: any) => {
  try {
    let res = await axios.get(c.ASSESSMENT + "/assessment-learners", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const getSummativeAssessment = async (data: any) => {
  try {
    let res = await axios.get(c.SUMMATIVE, {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getBehaviourAssessment = async (data: any) => {
  try {
    let res = await axios.get(c.BEHAVIOUR + "/assessment", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createBehaviourAssessment = async (data: any) => {
  try {
    let res = await axios.put(c.BEHAVIOUR + "/assessment", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getCommentAssessment = async (data: any) => {
  try {
    let res = await axios.get(c.COMMENTS + "/assessment", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createCommentAssessment = async (data: any) => {
  try {
    let res = await axios.put(c.COMMENTS + "/assessment", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export const getReportByLearners = async (data: any) => {
  try {
    let type =
      data.type === "analysis-grade" || data.type === "analysis-stream"
        ? "/analysis"
        : // : data.type === "learner-weakness"
          // ? "/"
          "";

    let res = await axios.get(c.ASSESSMENT + "/assessments" + type, {
      params: data,
      responseType: "arraybuffer",
      timeout: 600000,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getSummativeByLearners = async (data: any) => {
  try {
    let type =
      data.type == "analysis-grade" || data.type == "analysis-stream"
        ? "/analysis"
        : data.type == "analysis-stream-stream"
        ? "/analysis-stream"
        : data.type == "learner-comparison"
        ? "-comparison"
        : data.type == "grade" || data.type == "stream"
        ? "/all"
        : "";

    let res = await axios.get(c.SUMMATIVE + "/assessments" + type, {
      params: data,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getSummativeForParent = async (data: any) => {
  try {
    let type = data.type === "learner" ? "summative" : "assessments-comparison";

    let res = await axios.get(c.PARENT + "/v1/" + type, {
      params: data,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getLearnerReport = async (data: any) => {
  try {
    let res = await axios.get(c.ASSESSMENT + "/report", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const createAssessment = async (data: any) => {
  try {
    const isFormData = data instanceof FormData;
    console.log("isFormData", isFormData);
    if (isFormData) {
      let res = await axios.post(c.ASSESSMENT, data, config);
      return res.data;
    } else {
      let res = await axios.post(c.ASSESSMENT, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
};
export const uploadFile = async (data: any) => {
  try {
    let res = await axios.post(c.ASSESSMENT + "/upload", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export async function createSubstrand(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.SUBSTRAND + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.SUBSTRAND, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteSubstrand(substrandId: any) {
  try {
    let res = await axios.delete(c.SUBSTRAND + "/" + substrandId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getSubstrandByStrand(data: any, strandId: any) {
  try {
    let res = await axios.get(c.SUBSTRANDBYSTRAND + "/" + strandId, {
      params: data,
    });
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getSingleSubstrand(stream: any, substrand: any) {
  try {
    let res = await axios.get(c.SUBSTRAND + "/" + stream + "/" + substrand);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getSchemeLearningAreas(learning_area: any) {
  try {
    let res = await axios.get(
      c.STRANDS + "/scheme/learning-areas/" + learning_area
    );
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getScheme() {
  try {
    let res = await axios.get(c.SCHEME);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
//getSchemeById
export async function getSchemeById(id: string) {
  try {
    let res = await axios.get(`${c.SCHEME}/${id}`);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function createScheme(data: any) {
  try {
    let res = await axios.post(c.SCHEME, data);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export const updateScheme = async (schemeId: string, updatedScheme: any) => {
  try {
    const response = await axios.put(`${c.SCHEME}/${schemeId}`, updatedScheme);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update scheme");
  }
};
//lessson pla
export async function createLessonPlan(data: any) {
  try {
    let res = await axios.post(c.LESSON_PLAN, data);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
//export async function getLessonPlanById(id: string) {
export async function getLessonPlanById(id: string) {
  try {
    let res = await axios.get(`${c.LESSON_PLAN}/${id}`);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
// download lesson plan
export async function downloadLessonPlan(id: string) {
  try {
    const res = await axios.get(`${c.LESSON_PLAN}/${id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `lesson_plan_${id}.pdf`); // Adjust file extension if needed
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// Get all lesson plans
export async function getLessonPlans(data: any) {
  try {
    let res = await axios.get(c.LESSON_PLAN, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// Update lesson plan
export async function updateLessonPlan(id: string, data: any) {
  try {
    let res = await axios.put(`${c.LESSON_PLAN}/${id}`, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// Delete lesson plan
export async function deleteLessonPlan(id: string) {
  try {
    let res = await axios.delete(`${c.LESSON_PLAN}/${id}`);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// Get lesson plans by teacher
export async function getLessonPlansByTeacher(teacherId: string, data: any) {
  try {
    let res = await axios.get(`${c.LESSON_PLAN}/teacher/${teacherId}`, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
//'/scheme/:id/download
export async function downloadScheme(id: string) {
  try {
    const res = await axios.get(`${c.SCHEME}/${id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `scheme_${id}.pdf`); // Adjust file extension if needed
    document.body.appendChild(link);
    link.click();
    link.remove(); // Clean up
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export const getRole = async (data: any) => {
  try {
    let res = await axios.get(c.ROLES, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};
export const getUsers = async (data: any) => {
  try {
    let res = await axios.get(c.USERS, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createRole(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(c.ROLES + "/" + data._id, data);
      return res.data;
    } else {
      let res = await axios.post(c.ROLES, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function createProfile(data: FieldValues) {
  try {
    let res = await axios.patch(c.USERS + "/profile", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getProfile(data: any) {
  try {
    let res = await axios.get(c.USERS + "/profile", {
      params: data,
    });

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getDashboard() {
  try {
    let res = await axios.get(c.USERS + "/profile");

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export async function deleteRole(id: any) {
  try {
    let res = await axios.delete(c.ROLES + "/" + id);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function signup(data: FieldValues) {
  try {
    let res = await axios.post(c.REGISTER, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function payment(data: FieldValues) {
  try {
    const auth = await localStorage.getItem("registered_user");
    console.log(auth);
    if (auth !== null) {
      // Value previously stored
      const auth_data = JSON.parse(auth);
      console.log(auth_data);
      const token = auth_data.token;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(`${c.PAYMENTS}/initiate-payment`, data, {
        headers,
      });

      return res.data;
    } else {
      throw new Error("User is not authenticated");
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function schoolDashboard() {
  try {
    let res = await axios.get(c.SCHOOLDASHBOARD);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
// /accept-terms
export async function acceptTerms(data: any) {
  try {
    let res = await axios.patch(c.USERS + "/accept-terms", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getUserData() {
  try {
    let res = await axios.get(c.USERS + "/profile");
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function addEmailOTP(data: FieldValues) {
  try {
    console.log(data);
    let res = await axios.post(c.AUTH + "/forgot-password", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function verifyEmailOTP(data: FieldValues) {
  try {
    let res = await axios.post(c.AUTH + "/reset-password", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function passwordReset(data: FieldValues) {
  try {
    console.log(data);
    let res = await axios.post(c.REGISTER + "/password", data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function addEmailOTPParent(data: FieldValues) {
  try {
    console.log(data);
    let res = await axios.post(c.PARENT + "/auth/forgot-password", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function verifyEmailOTPParent(data: FieldValues) {
  try {
    let res = await axios.post(c.PARENT + "/auth/reset-password", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerAcademicYear(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/academic-years", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerTerm(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/terms", { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerLeaningArea(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/learning-areas", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerLeaningAreaAdmin(data: FieldValues) {
  try {
    let res = await axios.get(c.LEARNERS + "/learning-areas", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getLeanerTests(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/tests", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerTestsAdmin(data: FieldValues) {
  try {
    let res = await axios.get(c.LEARNERS + "/tests", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerAssessmentReport(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/assessment/report", {
      params: data,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getLeanerAssessmentReportUploads(data: FieldValues) {
  try {
    let res = await axios.get(c.PARENT + "/v1/assessment/with-uploads", {
      params: data,
    });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}


export const getLearningAreasAssignments = async (data: any) => {
  try {
    let res = await axios.get(c.LEARNING_AREA_ASSIGNMENT, { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function createLearningAreaAssignment(data: FieldValues) {
  try {
    if (data._id) {
      let res = await axios.put(
        c.LEARNING_AREA_ASSIGNMENT + "/" + data._id,
        data
      );
      return res.data;
    } else {
      let res = await axios.post(c.LEARNING_AREA_ASSIGNMENT, data);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}
export async function deleteLearningAreaAssignment(userId: any) {
  try {
    let res = await axios.delete(c.LEARNING_AREA_ASSIGNMENT + "/" + userId);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function removeLearningAreaAssignment(assignmentId: any) {
  try {
    let res = await axios.delete(c.LEARNING_AREA_ASSIGNMENT + "/" + assignmentId);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getAvailableLearningAreas(data: any) {
  try {
    let res = await axios.get(c.LEARNING_AREA + "/available", { params: data });
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function selectLearningAreas(data: any) {
  try {
    let res = await axios.post(c.LEARNING_AREA_ASSIGNMENT + "/select", data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function deleteMultipleLearningAreaAssignment(data: any) {
  try {
    console.log(data);
    let res = await axios.delete(c.LEARNING_AREA_ASSIGNMENT + "/multiple", {
      data,
    });
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getListOfGradings(data: any) {
  try {
    let res = await axios.get(c.GRADING, {
      params: data,
    });
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getGradingScale(id: any) {
  try {
    let res = await axios.get(c.GRADING + "/" + id);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function createGrading(data: any) {
  try {
    if (data._id) {
      let res = await axios.put(c.GRADING + "/update-name/" + data._id, data);
      console.log(res);
      return res.data;
    } else {
      let res = await axios.post(c.GRADING, data);
      console.log(res);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}
export async function deleteGrading(data: any) {
  try {
    let res = await axios.delete(c.GRADING + "/" + data);
    console.log(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function updateGradingScale(data: any) {
  try {
    let res = await axios.put(c.GRADING + "/" + data._id, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function createGradingLearningArea(id: any, data: any) {
  try {
    if (data._id) {
      let res = await axios.put(c.GRADING + "/" + id, data);
      console.log(res);
      return res.data;
    } else {
      let res = await axios.post(c.GRADING + "/" + id, data);
      console.log(res);
      return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}
// export const getUsers = async (data: any) => {
//   try {
//     let res = await axios.get(c.USERS, { params: data });
//     return res.data;
//   } catch (e) {
//     throw handler(e);
//   }
// };
// export function handler(err: any) {
//   let error = err;
//   console.log("status code ", error?.response?.status);
//   // Check for specific status code and perform action
//   if (error?.response?.status == 403) {
//     localStorage.removeItem("@AuthData");
//     window.location.href = "/auth/login";
//     //
//   }

//   // Handle errors with a response data that has an 'error' property
//   if (error.response && error.response.data.hasOwnProperty("error")) {
//     error = error.response.data;
//     // Check if the error response contains a specific structure
//     if (error.error) {
//       error.message = error.error;
//     } else if (Array.isArray(error.errors)) {
//       // Handle custom errors with an array of errors
//       const customErrors = error.errors;
//       const firstError = customErrors[0]; // Assuming you want the first error message
//       error.message = firstError.msg || "An unknown error occurred.";
//     } else {
//       // Fallback if error.error is not present and the structure is unknown
//       error.message = "An unknown error occurred.";
//     }
//     console.log(error);
//   }
//   // if (error.step) {
//   //   localStorage.clear();
//   //   localStorage.setItem("step", error.step);
//   //   window.location.href = "/register";
//   // }
//   // Handle errors without 'error' property and convert to JSON if possible
//   else if (!err.hasOwnProperty("error")) {
//     error = err.toJSON();
//     error.message = error.message || "An unknown error occurred.";
//   }

//   console.log("error");
//   console.log(error.message);
//   return new Error(error.message);
// }
export function handler(err: any) {
  let error = err;
  console.log(error);
  if (error.code === "ERR_NETWORK") {
    error.message = "Network error occurred.";

    return new Error(error.message);
  }
  // Check for specific status code and perform action
  // if (error?.response?.status == 403) {
  //   localStorage.removeItem("@AuthData");
  //   window.location.href = "/auth/login";
  // }
  // Handle errors with a response data that has an 'error' property
  if (
    (error.response &&
      (error.response.data.hasOwnProperty("errors") ||
        error.response.data.hasOwnProperty("error"))) ||
    error.response.data.hasOwnProperty("message")
  ) {
    error = error.response.data;

    // Check if the error response contains a specific structure
    if (error.error) {
      error.message = error.error;
    } else if (error.message) {
      error.message = error.message;
    } else if (Array.isArray(error.errors)) {
      // Handle custom errors with an array of errors
      const customErrors = error.errors;
      const firstError = customErrors[0]; // Assuming you want the first error message
      error.message = firstError.msg || "An unknown error occurred.";
    } else {
      // Fallback if error.error is not present and the structure is unknown
      error.message = "An unknown error occurred.";
    }
  }
  // if (error.step) {
  //   localStorage.clear();
  //   localStorage.setItem("step", error.step);
  //   window.location.href = "/register";
  // }
  // Handle errors without 'error' property and convert to JSON if possible
  else if (!err.hasOwnProperty("error")) {
    error = err.toJSON();
    error.message = error.message || "An unknown error occurred.";
  }

  console.log("error");
  console.log(error.message);
  return new Error(error.message);
}
