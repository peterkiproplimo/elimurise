//API URL
// export const BASE_URL = "http://localhost:3000/";

// export const BASE_URL= "https://hero-staging.techsavanna.technology/api/"
export const BASE_URL = import.meta.env.VITE_API_ENDPOINT;
//API Endpoints
//devops has do it again
export const LOGIN = `${BASE_URL}portal/auth/login`;
export const REGISTER = `${BASE_URL}portal/auth/register`;
export const AUTH = `${BASE_URL}portal/auth`;
export const SUBSCRIPTION = `${BASE_URL}portal/subscription`;
export const ACADEMIC = `${BASE_URL}portal/academic-year`;
export const TERM = `${BASE_URL}portal/term`;
export const STREAMS = `${BASE_URL}portal/streams`;
export const LEARNERS = `${BASE_URL}portal/learners`;
export const ENROLLMENT = `${BASE_URL}portal/enrollment`;

export const PARENTS = `${BASE_URL}portal/parents`;
export const TEACHERS = `${BASE_URL}portal/teachers`;
export const GRADES = `${BASE_URL}cms/grades`;
export const STRANDS = `${BASE_URL}cms/strand`;
export const LEARNING_AREA = `${BASE_URL}cms/learning-areas`;

export const USERS = `${BASE_URL}portal/users`;
export const PROFILE = `${BASE_URL}portal/profile`;
export const SUBSTRAND = `${BASE_URL}cms/substrand`;
export const SUBSTRANDBYSTRAND = `${BASE_URL}cms/substrand/ByStrand`;
export const LEARNING_OUTCOME = `${BASE_URL}portal/substrandsByStrand`;
const Terms = {
  Term1: "1",
  Term2: "2",
  Term3: "3",
};
export const ROLES = `${BASE_URL}portal/roles`;

export const FORGOT_PASSWORD = `${BASE_URL}send-password/`;
export const CHANGE_PASSWORD = `${BASE_URL}change-password`;

export const CONFERENCES = `${BASE_URL}events-service/conference`;
export const THEMES = `${BASE_URL}events-service/theme`;
export const EVENTS = `${BASE_URL}events-service/event`;
export const DASHBOARD = `${BASE_URL}events-service/event/dashboard`;
export const MAKES = `${BASE_URL}vehicle/makes`;
export const VALUERS = `${BASE_URL}vehicle/valuers`;
export const SECURITY_FEATURES = `${BASE_URL}vehicle/security_features`;
export const FINANCIERS = `${BASE_URL}vehicle/financiers`;
export const Models = `${BASE_URL}vehicle/models/`;
export const POLICY = `${BASE_URL}vehicle/users/`;

//Simcards Endpoints
export const SIMCARDS = `${BASE_URL}simcard-service/simcards`;

//Payments Endpoints
export const WALLETS = `${BASE_URL}payments-service/wallets`;
export const TRANSACTIONS = `${BASE_URL}payments-service/transactions`;

//samson devops push ss
