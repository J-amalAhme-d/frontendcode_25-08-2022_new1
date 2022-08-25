import { Auth } from "aws-amplify";
import APICaller from "../../api/APICaller";
import _ from 'lodash';

const getUserRole = (email) => {
  return new Promise(
    async(resolve, reject) => {
      try {
        
        let role = ""; 

        /*A user identity should not have a multiple roles. 
        A user (email) cannot be both player and parent. 
        A user (email) cannot be player and a coach also. 
        */
       Promise.all([APICaller.apiGetPlayer(email), APICaller.apiGetParent(email), APICaller.apiGetCoach(email)])
          .then(gResp => {
            console.log("Role query resp: ",gResp);
            gResp.forEach((gRow,i) => {
              if(gRow && gRow !== null) {
                switch (i) {
                  case 0: 
                  resolve("Player"); 
                  break;
                
                  case 1: 
                  resolve("Parent");
                  break;
                  
                  case 2:
                  resolve("Coach");
                  break;
                }
              } 
            })
            resolve( "Guest");
            // resolve(role);
          })
          .catch(e => {
            console.error("Issue querying user role",e);
            reject(e);
          });

      } catch (e) {
        console.error("Unexpected error querying for role",e);
        reject(e);
      }
    }
  )
}

const getUserId = (email) => {
  return new Promise(
    async(resolve, reject) => {
      try {
        
        let idT = ""; 

        /*A user identity should not have a multiple roles. 
        A user (email) cannot be both player and parent. 
        A user (email) cannot be player and a coach also. 
        */
       Promise.all([APICaller.apiGetPlayer(email), APICaller.apiGetParent(email), APICaller.apiGetCoach(email)])
          .then(gResp => {
            gResp.forEach((gRow,i) => {
              if(gRow && gRow !== null) {
                if (i === 0 || i=== 1 || i === 2) {
                  idT = gRow.id; 
                }
              }
            })
            resolve(idT);
          })
          .catch(e => {
            console.error("Issue querying user id",e);
            reject(e);
          });
      } catch (e) {
        console.error("Unexpected error querying for user id",e);
        reject(e);
      }
    }
  )
}

const getUserIdByRole = (email, role) => {
  return new Promise(
    async(resolve, reject) => {
      try {
        

        if(!role || role === null || role === "" || role === "Guest" ){
          console.warn("Role is invalid:", role);
          resolve(null);
        }

        if(role === "Player") {
          APICaller.apiGetPlayer(email)
            .then(p => {
              if(p !== null) {
                resolve(p.id);
              } else {
                resolve (null);
              }
            })
            .catch(e => reject(e))
        }

        if(role === "Parent"){
          APICaller.apiGetParent(email)
            .then(p => {
              if(p !== null) {
                resolve(p.id);
              } else {
                resolve (null);
              }
            })
            .catch(e => reject(e))
        }

        if(role === "Coach"){
          APICaller.apiGetCoach(email)
            .then(c => {
              if(c !== null) {
                resolve(c.id);
              } else {
                resolve (null);
              }
            })
            .catch(e => reject(e))
        }

      } catch (e) {
        console.error("Unexpected error querying for user id",e);
        reject(e);
      }
    }
  )
}

const isLoggedIn = () => {
  return new Promise(
    async (resolve) => {
      Auth.currentAuthenticatedUser()
        .then(u => {
          resolve(true);
        })
        .catch(e => {
          resolve(false);
        })
    }
  )
}

const getAuthenticatedUser = async () => {
  return new Promise(
    async(resolve, reject) => {
      Auth.currentAuthenticatedUser()
        .then(u => {
          resolve(u.attributes);
        })
        .catch(e => {
          reject(e);
        })
    }
  )
}



export default { 
  getUserRole,
  getUserId,
  getUserIdByRole,
  isLoggedIn,
  getAuthenticatedUser
};