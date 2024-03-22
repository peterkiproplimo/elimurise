
//API URL
export const BASE_URL = "http://localhost:3000";

// export const BASE_URL= "https://hero.techsavanna.technology/api/"
//API Endpoints
//devops has do it again
export const LOGIN = `${BASE_URL}portal/auth/login`;
export const AUTH = `${BASE_URL}portal/auth`;
export const LEVEL=`${BASE_URL}portal/level`
export const GRADES=`${BASE_URL}portal/grades`
export const LEARNING_AREA=`${BASE_URL}portal/learning-areas`
export const USERS=`${BASE_URL}portal/users`
export const PROFILE=`${BASE_URL}portal/profile`
export const SUBSTRAND=`${BASE_URL}portal/substrand`
export const SUBSTRANDBYSTRAND=`${BASE_URL}portal/substrand/ByStrand`
export const LEARNING_OUTCOME=`${BASE_URL}portal/substrandsByStrand`
const Terms = {
    Term1: '1',
    Term2: '2',
    Term3: '3'
  };
export const ROLES = `${BASE_URL}portal/roles`;
export const STRANDS=`${BASE_URL}portal/strand`
export const REGISTER = `${BASE_URL}register`;
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