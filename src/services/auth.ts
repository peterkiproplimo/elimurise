
import axios from 'axios';
import * as c from '../utils/constants';
import { FieldValues } from 'react-hook-form';


export async function login(data: FieldValues) {
  try {
    let res = await axios.post(c.LOGIN, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
  
} 

const getData = async () => {
  try {
    const auth = await localStorage.getItem('@AuthData')
    
    if (auth !== null) {
      // value previously stored
      let auth_data = JSON.parse(auth);
      let user=auth_data.user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      return user;
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
}
getData();


// // Add a request interceptor
axios.interceptors.request.use(
  async (config) => {
    try {
      
      const user=await getData();
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




























































export const getPackages =async (data:any) => {
  try {
      let res = await axios.get(c.SUBSCRIPTION+"/packages",{
        params:data
      });
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }

  export async function createSubscription(data: FieldValues) {
    try {
      if(data._id){
        let res = await axios.put(c.SUBSCRIPTION, data);
        return res.data;
      }
     else{
      let res = await axios.post(c.SUBSCRIPTION, data);
      return res.data;
     }
      
    } catch (e) {
      throw handler(e);
    }
  }



export const getAcademic =async (data:any) => {
try {
    let res = await axios.get(c.ACADEMIC,{
      params:data
    });
    console.log(data)
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function createAcademic(data: any) {
  try {
    if(data._id){
      let res = await axios.put(c.ACADEMIC + "/"+ data?._id, data);
  
      return res.data;
    }
    else{
      let res = await axios.post(c.ACADEMIC, data);
   
    return res.data;
    }
  } catch (e) {
    throw handler(e);
  }
}

export async function deleteAcademic(Id: any) {
  try {
  
    let res = await axios.delete(c.ACADEMIC+'/'+Id);
    console.log(res)
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

//term

export const getTerm =async (data: any) => {
  try {
      let res = await axios.get(c.TERM,{
        params:data
      });
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }
  
  export async function createTerm(data: FieldValues) {
    try {
    
      if(data._id){
        let res = await axios.put(c.TERM + '/' + data._id, data);
        return res.data;
      }
    else{
      let res = await axios.post(c.TERM, data);
       return res.data;
    }
    
      
    } catch (e) {
      throw handler(e);
    }
  }
  
  export async function deleteTerm(gradeId: any) {
    try {
      let res = await axios.delete(c.TERM +'/'+gradeId);
      console.log(res)
      return res.data;
    } catch (e) {
      throw handler(e);
    }
  }  

  //streams 
  export const getStream =async (data: any) => {
    try {
        let res = await axios.get(c.STREAMS,{
          params:data
        });
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function createStream(data: FieldValues) {
      try {
      
        if(data._id){
          let res = await axios.put(c.STREAMS + '/' + data._id, data);
          return res.data;
        }
      else{
        let res = await axios.post(c.STREAMS, data);
         return res.data;
      }
      
        
      } catch (e) {
        throw handler(e);
      }
    }
    
    export async function deleteStream(gradeId: any) {
      try {
      
        let res = await axios.delete(c.STREAMS +'/'+gradeId);
        console.log(res)
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


export const getGrades =async (data:any) => {
  try {
      let res = await axios.get(c.GRADES,{
        params:data
      });
      return res.data;
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
  

  

    export const  getLearners =async (data:any,filter:any) => {
      try {
     
          let res = await axios.get(c.LEARNERS,{
            params:data
          });
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }
     
      export async function createLearner(data: FieldValues) {
        try {
        
          if(data._id){
            let res = await axios.put(c.LEARNERS + '/' + data._id, data);
            return res.data;
          }
        else{
          let res = await axios.post(c.LEARNERS, data);
           return res.data;
        }
        
          
        } catch (e) {
          throw handler(e);
        }
      }
      
      export async function deleteLearner(gradeId: any) {
        try {
        
          let res = await axios.delete(c.LEARNERS +'/'+gradeId);
          console.log(res)
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }  

      
      export const getParents =async (data:any) => {
        try {
            let res = await axios.get(c.PARENTS,{params:data});
            return res.data;
          } catch (e) {
            throw handler(e);
          }
        }
        
        export async function createParents(data: FieldValues) {
          try {
           
            if(data._id){
              let res = await axios.put(c.PARENTS+ "/" +data._id, data);
              return res.data;
            }else{
              let res = await axios.post(c.PARENTS, data);
              return res.data;
            }
           
          } catch (e) {
            throw handler(e);
          }
        }

        export async function deleteParents(userId: any) {
          try {
          
            let res = await axios.delete(c.PARENTS+'/'+userId);
            console.log(res)
            return res.data;
          } catch (e) {
            throw handler(e);
          }
        }

      

        export const getTeachers =async (data:any) => {
          try {
              let res = await axios.get(c.TEACHERS,{params:data});
              return res.data;
            } catch (e) {
              throw handler(e);
            }
          }
          
          export async function createTeachers(data: FieldValues) {
            try {
             
              if(data._id){
                let res = await axios.put(c.TEACHERS + "/" + data._id, data);
                return res.data;
              }else{
                let res = await axios.post(c.TEACHERS, data);
                return res.data;
              }
             
            } catch (e) {
              throw handler(e);
            }
          }
  
          export async function deleteTeachers(userId: any) {
            try {
            
              let res = await axios.delete(c.TEACHERS +'/'+userId);
              console.log(res)
              return res.data;
            } catch (e) {
              throw handler(e);
            }
          }
  
          export const getLearningAreas =async (data: any) => {
            try {
                let res = await axios.get(c.LEARNING_AREA,{
                  params:data
                });
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
































































































            export const getStrands =async (data:any,filter:any) => {
              try {
                  if(filter.learning_area==="na"){
                    console.log("failed...")
                    return;
                  }
                  let res = await axios.get( `${c.STRANDS}/${filter.learning_area}/${filter.term}`,{
                    params:data
                  });
                  return res.data;
                } catch (e) {
                  throw handler(e);
                }
              }

      
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
     

        export async function activateorDeactivateUsers(data: FieldValues) {
          try {
           
            if(data.status!==1){
              const res = await axios.put(`${c.USERS}/${data._id}/activate`, data);
              return res.data;
            }else{
              const res = await axios.put(`${c.USERS}/${data._id}/deactivate`, data);
              return res.data;
            }
           
          } catch (e) {
            throw handler(e);
          }
        }
        
       

  

  export const getSubstrand =async (data:any) => {
    try {
        let res = await axios.get(c.SUBSTRAND,{params:data});
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

    export async function getSubstrandByStrand(data:any,strandId: any) {
      try {
      
        let res = await axios.get(c.SUBSTRANDBYSTRAND+'/'+ strandId,{params:data});
        console.log(res)
        return res.data;
      } catch (e) {
        throw handler(e);
      }
    }
 

    export const getRole =async (data:any) => {
      try {
          let res = await axios.get(c.ROLES,{params:data});
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

      export async function createProfile(data: FieldValues) {
        try {
        
       
            let res = await axios.patch(c.USERS+"/profile", data);
            return res.data;
         
     
          
        } catch (e) {
          throw handler(e);
        }
      }
    
      export async function getProfile(data: any) {
        try {
          let res = await axios.get(c.USERS+"/profile",{
            params:data
          });
         
          return res.data;
        } catch (e) {
          throw handler(e);
        }
      }

  
      export async function getDashboard() {
        try {
          let res = await axios.get(c.USERS+"/profile");
        
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

export async function getUserData() {
    try {
        let res = await axios.get(c.USERS +"/profile");
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