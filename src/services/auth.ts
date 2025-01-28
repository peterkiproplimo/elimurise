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
      let user = auth_data.user;
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
      "https://staging-erp.herolearning.co.ke/api/method/hero.hero.apis.appointment.schedule_appointment",
      data
    );
    return res.data;
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
    let res = await axios.put(`${c.SCHOOL}/update`, data, config);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
};

export async function importLearners(data: FieldValues) {
  try {
    let res = await axios.post(c.LEARNERS + "/import", data);
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
    if (filter.learning_area === "na") {
      console.log("failed...");
      return;
    }
    let res = await axios.get(
      `${c.STRANDS}/${filter.learning_area}/${filter.term}`,
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
    let res = await axios.get(c.PARENT + "/v1/summative", {
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
    let res = await axios.post(c.ASSESSMENT, data);
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
