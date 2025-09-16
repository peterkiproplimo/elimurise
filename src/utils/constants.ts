//API URL
// export const BASE_URL = "http://localhost:3000/";

// export const BASE_URL = "https://api.Elimuriselearning.co.ke/";
export const BASE_URL = import.meta.env.VITE_API_ENDPOINT;
export const IMG_URL = `${BASE_URL}portal`;
//API Endpoints
//devops has do it again
export const LOGIN = `${BASE_URL}portal/auth/login`;
export const PARENT = `${BASE_URL}learner`;
export const REGISTER = `${BASE_URL}portal/auth/register`;
export const AUTH = `${BASE_URL}portal/auth`;
export const SUBSCRIPTION = `${BASE_URL}portal/subscription`;
export const ACADEMIC = `${BASE_URL}portal/academic-year`;
export const TERM = `${BASE_URL}portal/term`;
export const STREAMS = `${BASE_URL}portal/streams`;
export const ATTENDANCE = `${BASE_URL}portal/attendance`;

export const LEARNERS = `${BASE_URL}portal/learners`;
export const ENROLLMENT = `${BASE_URL}portal/enrollment`;
export const ASSESSMENT = `${BASE_URL}portal/assessment`;
export const TESTS = `${BASE_URL}portal/tests`;
export const SUMMATIVE = `${BASE_URL}portal/summative`;
export const GRADING = `${BASE_URL}portal/grading-system`;
export const SCHOOLDASHBOARD = `${BASE_URL}portal/dashboard`;
export const TRANSFERS = `${BASE_URL}portal/transfer-requests`;
export const LEARNERTRANSFERS = `${BASE_URL}/learner`;
export const PAYMENTS = `${BASE_URL}portal/payment`;
export const BEHAVIOUR = `${BASE_URL}portal/behaviour`;
export const COMMENTS = `${BASE_URL}portal/comment`;
export const PACKAGE = `${BASE_URL}portal/package`;
export const MESSAGE = `${BASE_URL}portal/messages`;
export const SCHOOL_PATH = `${BASE_URL}portal`;

export const MESSAGE_PARENT = `${BASE_URL}learner/messages`;
export const Timetable = `${BASE_URL}portal/timetable`;

export const PARENTS = `${BASE_URL}portal/parents`;
export const TEACHERS = `${BASE_URL}portal/teachers`;
export const GRADES = `${BASE_URL}portal/grades`;
export const STRANDS = `${BASE_URL}portal/strand`;
export const LEARNING_AREA = `${BASE_URL}portal/learning-areas`;
export const SCHOOL = `${BASE_URL}portal/school`;
export const LEARNING_AREA_ASSIGNMENT = `${BASE_URL}portal/grade-teacher-assignment`;
export const USERS = `${BASE_URL}portal/users`;
export const COUNTIES = `${BASE_URL}portal/meta/counties`;

export const PROFILE = `${BASE_URL}portal/profile`;
export const SUBSTRAND = `${BASE_URL}portal/substrand`;
export const SUBSTRANDBYSTRAND = `${BASE_URL}portal/substrand/ByStrand`;
export const LEARNING_OUTCOME = `${BASE_URL}portal/substrandsByStrand`;
const Terms = {
  Term1: "1",
  Term2: "2",
  Term3: "3",
};
export const ROLES = `${BASE_URL}portal/roles`;

export const SCHEME = `${BASE_URL}portal/scheme`;
export const LESSON_PLAN = `${BASE_URL}portal/lesson-plan`;

// export const FORGOT_PASSWORD = `${BASE_URL}send-password/`;
// export const CHANGE_PASSWORD = `${BASE_URL}change-password`;

// export const CONFERENCES = `${BASE_URL}events-service/conference`;
// export const THEMES = `${BASE_URL}events-service/theme`;
// export const EVENTS = `${BASE_URL}events-service/event`;
// export const DASHBOARD = `${BASE_URL}events-service/event/dashboard`;
// export const MAKES = `${BASE_URL}vehicle/makes`;
// export const VALUERS = `${BASE_URL}vehicle/valuers`;
// export const SECURITY_FEATURES = `${BASE_URL}vehicle/security_features`;
// export const FINANCIERS = `${BASE_URL}vehicle/financiers`;
// export const Models = `${BASE_URL}vehicle/models/`;
// export const POLICY = `${BASE_URL}vehicle/users/`;

// //Simcards Endpoints
// export const SIMCARDS = `${BASE_URL}simcard-service/simcards`;

// //Payments Endpoints
// export const WALLETS = `${BASE_URL}payments-service/wallets`;
// export const TRANSACTIONS = `${BASE_URL}payments-service/transactions`;

//samson devops push ss
