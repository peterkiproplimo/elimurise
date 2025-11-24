//API URL
// export const BASE_URL = "http://localhost:3000/";

// export const BASE_URL = "https://api.Elimuriselearning.co.ke/";
export const BASE_URL = import.meta.env.VITE_API_ENDPOINT;
export const BASE_LOCAL_URL = import.meta.env.VITE_API_ENDPOINT;
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

export const VISITORS = `${BASE_LOCAL_URL}visitors`;
export const ENQUIRIES = `${BASE_LOCAL_URL}client/enquiries`; 
export const ONLINEAPPLICANTS = `${BASE_LOCAL_URL}onlineregistration`; 
export const COMPLAINTS = `${BASE_LOCAL_URL}complaints`; 
export const CREATEREPLY = `${BASE_LOCAL_URL}replies`;
export const CERTIFICATES = `${BASE_LOCAL_URL}certificates`;
export const COHORTS = `${BASE_LOCAL_URL}cohorts`;
export const FRONTOFFICE = `${BASE_LOCAL_URL}front-office`; 
export const PHONECALLS = `${BASE_LOCAL_URL}phone-calls`;
export const PORTFOLIOSUMMARY = `${BASE_LOCAL_URL}portfolio-summary`; 

// Google OAuth 2.0 URLs
export const GOOGLE_OAUTH = {
  // Authorization URL for Google OAuth 2.0
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  
  // Token exchange URL
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  
  // Revoke access URL
  REVOKE_URL: 'https://oauth2.googleapis.com/revoke',
  
  // User info endpoint
  USER_INFO_URL: 'https://www.googleapis.com/oauth2/v2/userinfo',
  
  // Google Drive API endpoints
  DRIVE_API_BASE: 'https://www.googleapis.com/drive/v3',
  DRIVE_UPLOAD_BASE: 'https://www.googleapis.com/upload/drive/v3',
  
  // Discovery document URL
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  
  // OAuth 2.0 Scopes
  SCOPES: {
    // Read-only access to user's basic info
    PROFILE: 'https://www.googleapis.com/auth/userinfo.profile',
    EMAIL: 'https://www.googleapis.com/auth/userinfo.email',
    
    // Google Drive scopes
    DRIVE_FILE: 'https://www.googleapis.com/auth/drive.file',
    DRIVE_METADATA: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    DRIVE_READONLY: 'https://www.googleapis.com/auth/drive.readonly',
    DRIVE: 'https://www.googleapis.com/auth/drive',
    
    // Combined scopes for file operations
    DRIVE_UPLOAD: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly'
  }
};

// Google API endpoints
export const GOOGLE_APIS = {
  // Google Drive API
  DRIVE: {
    FILES: 'https://www.googleapis.com/drive/v3/files',
    ABOUT: 'https://www.googleapis.com/drive/v3/about',
    UPLOAD: 'https://www.googleapis.com/upload/drive/v3/files'
  },
  
  // OAuth 2.0
  OAUTH: {
    AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN: 'https://oauth2.googleapis.com/token',
    REVOKE: 'https://oauth2.googleapis.com/revoke',
    USERINFO: 'https://www.googleapis.com/oauth2/v2/userinfo'
  }
};

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
export const EVENTS = `${BASE_URL}portal/events`;
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
