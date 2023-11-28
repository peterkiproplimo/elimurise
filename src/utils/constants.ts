
//API URL
// export const BASE_URLS = 'http://localhost:8000/';

// export const BASE_URL = 'https://palla.techsavanna.technology/palla-api/api/';
// export const Login_URL =  'https://palla.techsavanna.technology:7000/fineract-provider/api/v1/authentication?username="admin"&password="password"&tenantIdentifier=default';
 
export const BASE_URL= "https://hero.techsavanna.technology/api/"
//API Endpoints
//devops has do it again
export const REGISTER = `${BASE_URL}register`;
export const LOGIN = `${BASE_URL}cms/login`;
export const FORGOT_PASSWORD = `${BASE_URL}send-password/`; 
export const CHANGE_PASSWORD = `${BASE_URL}change-password`;
export const ROLES = `${BASE_URL}users/roles`;
export const CONFERENCES = `${BASE_URL}events-service/conference`;
export const THEMES = `${BASE_URL}events-service/theme`;
export const EVENTS = `${BASE_URL}events-service/event`;
export const DASHBOARD = `${BASE_URL}events-service/event/dashboard`;
export const USERS = `${BASE_URL}users`;
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