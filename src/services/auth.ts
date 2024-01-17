
import axios from 'axios';
import * as c from '../utils/constants';
import { FieldValues } from 'react-hook-form';

//Users
export async function login(data: FieldValues) {
  try {
    let res = await axios.post(c.LOGIN, data);
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(res.data); //email:
        await localStorage.setItem("user", jsonValue);
      } catch (e) {
        throw handler(e);
      }
    };
    storeData();
    return res.data;
  } catch (e) {
    throw handler(e);
  }
  
}



// Add a request interceptor
axios.interceptors.request.use(
  async (config) => {
    try {
      const user = await localStorage.getItem('user');

      if (user !== null) {
        const token = JSON.parse(user);
        config.headers['Authorization'] = `Bearer ${token.token}`;
      } else {
        // No user data found, possibly logout the user or handle as needed
        console.log('No user data found. Logging out...');
        // Perform logout logic, e.g., redirect to login page
        window.location.href = '/login';
        return Promise.reject('No user data found');
      }

      return config;
    } catch (error) {
      // Handle the error as needed
      console.error('Interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    // Handle request error
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);



export const getLevels =async ({ page }: { page: number }) => {
try {
    let res = await axios.get(c.LEVEL);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function createLevel(data: any) {
  try {
    if(data._id){
      let res = await axios.put(c.LEVEL, data);
  
      return res.data;
    }
    else{
      let res = await axios.post(c.LEVEL, data);
   
    return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteLevel(levelId: any) {
  try {
  
    let res = await axios.delete(c.LEVEL+'/'+levelId);
    console.log(res)
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

// export async function getUsers() {
//   return {}
// }

export const getGrades =async ({ page }: { page: number }) => {
  try {
      let res = await axios.get(c.GRADES);
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }
  
  export async function createGrade(data: FieldValues) {
    try {
      if(data._id){
        let res = await axios.put(c.GRADES, data);
        return res.data;
      }
     else{
      let res = await axios.post(c.GRADES, data);
      return res.data;
     }
      
    } catch (e) {
      throw handler(e);
    }
  }
  
  export async function deleteGrade(gradeId: any) {
    try {
    
      let res = await axios.delete(c.GRADES+'/'+gradeId);
      console.log(res)
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }
  

  export const getLearningAreas =async ({ page }: { page: number }) => {
    try {
        let res = await axios.get(c.LEARNING_AREA);
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function createLearningArea(data: FieldValues) {
      try {
      
        if(data._id){
          let res = await axios.put(c.LEARNING_AREA+'/'+data._id, data);
          return res.data;
        }
      else{
        let res = await axios.post(c.LEARNING_AREA, data);
         return res.data;
      }
      
        
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function deleteLearningArea(gradeId: any) {
      try {
      
        let res = await axios.delete(c.LEARNING_AREA+'/'+gradeId);
        console.log(res)
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }  
  

    export const getStrands =async ({ page }: { page: number },filter:any) => {
      try {
          if(filter.learning_area==="na"){
            console.log("failed...")
            return;
          }
          let res = await axios.get( `${c.STRANDS}/${filter.learning_area}/${filter.term}`);
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }
      
      export const allStrands =async ({ page }: { page: number },filter:any) => {
        try {
            let res = await axios.get(c.STRANDS,filter);
            return res.data;
          } catch (e) {
            throw handler(e);
          }
        }

      export async function createStrand(data: FieldValues) {
        try {
          if(data._id){
            let res = await axios.put(c.STRANDS, data);
            return res.data;
          }
          else{
            let res = await axios.post(c.STRANDS, data);
            return res.data;
          }
         
          
          
        } catch (e) {
          throw handler(e);
        }
      }
      
      export async function deleteStrand(gradeId: any) {
        try {
        
          let res = await axios.delete(c.STRANDS+'/'+gradeId);
          console.log(res)
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }  
    
      export const getUsers =async ({ page }: { page: number }) => {
        try {
            let res = await axios.get(c.USERS);
            return res.data;
          } catch (e) {
            throw handler(e);
          }
        }
        
        export async function createUsers(data: FieldValues) {
          try {
           
            if(data._id){
              let res = await axios.put(c.USERS+"/"+data._id, data);
              return res.data;
            }else{
              let res = await axios.post(c.USERS, data);
              return res.data;
            }
           
          } catch (e) {
            throw handler(e);
          }
        }
        
        export async function deleteUsers(userId: any) {
          try {
          
            let res = await axios.delete(c.USERS+'/'+userId);
            console.log(res)
            return res.data;
          } catch (e) {
            throw handler(e);
          }
        }

  

  export const getSubstrand =async ({ page }: { page: number }) => {
    try {
        let res = await axios.get(c.SUBSTRAND);
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function createSubstrand(data: FieldValues) {
      try {
        if(data._id){
          let res = await axios.put(c.SUBSTRAND+"/"+ data._id, data);
          return res.data;
        }
       else{
        let res = await axios.post(c.SUBSTRAND, data);
        return res.data;
       }
       
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function deleteSubstrand(substrandId: any) {
      try {
      
        let res = await axios.delete(c.SUBSTRAND+'/'+ substrandId);
        console.log(res)
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }

    export async function getSubstrandByStrand(strandId: any) {
      try {
      
        let res = await axios.get(c.SUBSTRANDBYSTRAND+'/'+ strandId);
        console.log(res)
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }
 

    export const getRole =async () => {
      try {
          let res = await axios.get(c.ROLES);
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }
      export async function createRole(data: FieldValues) {
        try {
          if(data._id){
            let res = await axios.put(c.ROLES+"/"+ data._id, data);
            return res.data;
          }
         else{
          let res = await axios.post(c.ROLES, data);
          return res.data;
         }
         
        } catch (e) {
          throw handler(e);
        }
      }
    
      export async function getProfile() {
        try {
          let res = await axios.get(c.USERS+"/profile");
          console.log(res);
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }

  
      export async function getDashboard() {
        try {
          let res = await axios.get(c.USERS+"/profile");
          console.log(res);
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }




































axios.interceptors.response.use(
    response => {
        return response
    },
    function (error) {
        if (error?.response?.status === 401) {
            return Promise.reject(error)
        }
        return Promise.reject(error)
    }
)






export async function getUserData() {
    try {
      // Get user data from local storage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user;
      } else {
        throw new Error("User data not found");
      }
    } catch (e) {
      throw handler(e);
    }
  }








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

export async function forgotPassword(email: string) {
    try {
        let res = await axios.post(c.FORGOT_PASSWORD + email);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

export async function changePassword(data: any) {
    try {
        let res = await axios.post(c.CHANGE_PASSWORD, data);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

// export async function getDashboard() {
//     try {
//         let res = await axios.get(c.DASHBOARD);
//         return res.data;
//     } catch (e) {
//         throw handler(e);
//     }
// }

export async function getConferences() {
    try {
        let res = await axios.get(c.CONFERENCES);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

export async function getThemes(data: { page: number; }) {
    try {
        let res = await axios.get(c.THEMES + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}


export async function getPolicy() {
    try {
      let res = await axios.get(c.POLICY);
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }
export async function getEvents(data: { page: any; }) {
    try {
        let res = await axios.get(c.EVENTS + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

// export async function getUsers(data: { page: number; }) {
//     try {
//         let res = await axios.get(c.USERS + "?page=" + data.page);
//         return res.data;
//     } catch (e) {
//         throw handler(e);
//     }
// }






    export async function addEmailOTP(data: FieldValues) {
    try {
        console.log(data);
 let res = await axios.post(c.REGISTER + "/otp", data);
 const storeData = async () => {
    try {
        const jsonValue = JSON.stringify(res.data)
        await localStorage.setItem('otp', jsonValue)
    } catch (e) {
        throw handler(e);
    }
}
storeData();
 
        return res.data;

    } catch (e) {
        throw handler(e);
    }
}

export async function verifyEmailOTP(data: FieldValues) {
    try {
        console.log(data);
 let res = await axios.post(c.REGISTER + "/verify", data);
 
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


export async function addMake(data: FieldValues) {
    try {
        console.log(data);
        let res = await axios.post(c.MAKES, data);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}


export async function getMakes(data: { page: number; }) {
    try {
        let res = await axios.get(c.MAKES + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

export async function deleteMakes(makeId: any) {
    try {
        let res = await axios.delete(c.MAKES + "/" + makeId);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}








export async function addFinanciers(data: FieldValues) {
    try {
        console.log(data);
        let res = await axios.post(c.FINANCIERS, data);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}



export async function getFinancier(data: { page: number; }) {
    try {
        let res = await axios.get(c.FINANCIERS + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}


export async function deleteFinancier(financierId: any) {
    try {
        let res = await axios.delete(c.FINANCIERS + "/" + financierId);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}



export async function getValuers(data: { page: number; }) {
    try {
        let res = await axios.get(c.VALUERS + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}



export async function exportValuers() {
    try {
      let res = await axios.get(c.VALUERS);
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  };




export async function deleteValuer(valuerId: any) {
    try {

        let res = await axios.delete(c.VALUERS + "/" + valuerId);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}



export async function addValuers(data: FieldValues) {
    try {
        console.log(data);
        let res = await axios.post(c.VALUERS, data);
        return res.data;
    } catch (e) {
        throw handler(e);
    }

}

export async function addSecurity(data: FieldValues) {
    try {
        console.log(data);
        let res = await axios.post(c.SECURITY_FEATURES, data);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

export async function getSecurity(data: { page: number; }) {
    try {
        let res = await axios.get(c.SECURITY_FEATURES + "?page=" + data.page);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}

export async function deleteSecurity(securityId: any) {
    try {
        let res = await axios.delete(c.SECURITY_FEATURES + "/" + securityId);
        return res.data;
    } catch (e) {
        throw handler(e);
    }
}




export function handler(err: any) {
  
    let error = err;
    
    if (err.response && err.response.data.hasOwnProperty("error")){
    
      error = err.response.data;
      error.message=err.response.data.error
      console.log(error)
    }
       
    else if (!err.hasOwnProperty("error")) error = err.toJSON();
    console.log("error")
    console.log(error.message)
    return new Error(error.message);
}