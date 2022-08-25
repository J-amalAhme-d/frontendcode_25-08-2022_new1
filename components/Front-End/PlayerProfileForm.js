import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Stack,
  Form,
  Alert,
} from "react-bootstrap";
//import 'antd/dist/antd.css';  
//import { Form } from "antd"; 
import styles from '../styles/Home.module.css' 

import Multiselect from "multiselect-react-dropdown";

import { useState, useEffect, useReducer, useCallback} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from "date-fns";

import { Country, State, City }  from 'country-state-city';
import { Storage } from "aws-amplify";
import aws_exports from '../src/aws-exports'
import Router from 'next/router'

import  FormStateFiller from '../src/utils/FormStateFiller'
import StorageUtils from '../src/utils/StorageUtils'
import UserUtils from "../src/utils/UserUtils";
import APICaller from "../api/APICaller";
import _ from 'lodash'

function PlayerProfileForm() {
  
  let initialPlayerState = {
    id:'',
    given_name:'',
    family_name:'',
    phone:'',
    email:'',
    birth_date: '',
    address:'',
    gender:'',
    country:'US',
    state:'',
    city:'',
    zip:'',
    graduation_year:'',
    height:'',
    weight:'',
    dp: null,
   
  }

  // let initialPlayerErrorsState = {
  //   given_name:'',
  //   family_name:'',
  //   phone:'',
  //   email:'',
  //   birth_date: '',
  //   address:'',
  //   gender:'',
  //   country:'',
  //   state:'',
  //   city:'',
  //   zip:'',
  //   graduation_year:'',
  // }

  let initialParentState = {
    id:'',
    given_name:'',
    family_name:'',
    phone:'',
    email:'',
    //TODO
    // gender:'Female'
  }

  let initialProfileState = {
    sport: '',
    primary_position:'',
    secondary_position:[],
    pitch:'',
    hit:'',
    throwe:'',
  }

  // let initialPositionState = [
  //   { id: 1, option: "1 Base" },
  //   { id: 2, option: "2 Base" },
  //   { id: 3, option: "3 Base" },
  //   { id: 4, option: "Short Stop" },
  //   { id: 5, option: "Left Field" },
  //   { id: 6, option: "Center Field" },
  //   { id: 7, option: "Right Field" },
  //   { id: 8, option: "RH Pitcher" },
  //   { id: 9, option: "LH Pitcher" },
  //   { id: 10, option: "Catcher" },
  // ];

  

  const [playerForm, updatePlayerForm] = useReducer(FormStateFiller.enhancedReducer, initialPlayerState);
  const [parentForm, updateParentForm] = useReducer(FormStateFiller.enhancedReducer, initialParentState);
  const [profileForm, updateProfileForm] = useReducer(FormStateFiller.enhancedReducer, initialProfileState);
  // const [positions, updatePositions] = useReducer(FormStateFiller.enhancedReducer, initialPositionState);

  const [formState, setFormState] = useState({
    isSubmitted:null,
    message:null,
    isFirstUserVisit:true
  }); 
  const [secondaryPosition, setSecondaryPosition] = useState([]);

  const [prevPlayerEmail, setPrevPlayerEmail] = useState();
  const [prevParentEmail, setPrevParentEmail] = useState();
  const [userEmail, setUserEmail] = useState();
  

  const [ playerFormErrors, setPlayerFormErrors ] = useState({})
  // const [ playerFormErrors, updatePlayerFormErrors ] = useReducer(FormStateFiller.enhancedReducer, initialPlayerErrorsState);

  const [ parentFormErrors, setParentFormErrors ] = useState({})
  
  
  const [ profileFormErrors, setProfileFormErrors ] = useState({})
  const [ country, setCountry ] = useState();
  const [ state, setState ] = useState();
  const [ city, setCity ] = useState();
  const [ countries, setCountries ] = useState([]);
  const [ states, setStates ] = useState([]);
  const [ cities, setCities ] = useState([]);
  

  const [positions, setPositions] = useState([
    { id: "1B", option: "1B" },
    { id: "2B", option: "2B" },
    { id: "3B", option: "3B" },
    { id: "Short Stop", option: "Short Stop" },
    { id: "Infield", option: "Infield" },
    { id: "Outfield", option: "Outfield" },
    { id: "RH Pitcher", option: "RH Pitcher" },
    { id: "LH Pitcher", option: "LH Pitcher" },
    { id: "Catcher", option: "Catcher" },
  ]);

  const [heightValues, setHeightValues] = useState(
    () => {
      let vals = [];
      _.range(6,3,-1).forEach(x => _.range(11,-1,-1).forEach(y => vals.push(x+'\''+y+'\"')));
      // console.log(vals);
      return vals;
    }
  );

  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  
  useEffect(() => {
    
    const loadUserId = (email) => {
      let lUserId = StorageUtils.getLocalStorageObject('usid');
      if(lUserId && lUserId !== null && lUserId !== ''){
        setUserId(lUserId);
      }

      UserUtils.getUserRole(email)
        .then(r => {
          if(r && r!== null){
            setRole(r);
            if( r === 'Player' || r === 'Parent'){
              UserUtils.getUserId(email)
                .then(i => storeUserId(i))
                .catch(e => console.log('Issue querying userid ',e));
            } else {
              console.error("Issue with role: (Not player or parent) ",r);
            }
          }
        })
        .catch(e => console.error('Issue querying role ',e));
      
    }

    const storeUserId = (sUserId) => {
      if(userId !== sUserId){
        StorageUtils.setLocalStorageObject('usid',sUserId);
        setUserId(sUserId);
      }
    }

    const storeUserRole = (email) => {
      setUserEmail(email);
      let role = StorageUtils.getLocalStorageObject("UserRole");
      if(!role || role === null || role === ""){
        UserUtils.getUserRole(email)
        .then(r => {
          if(r && r!== null){
            setRole(r);
            if( r !== 'Guest' && r !== 'Coach'){
              UserUtils.getUserId(email)
                .then(i => storeUserId(i))
                .catch(e => console.log('Issue querying userid ',e));
              console.log("Role local storage:",r);
              StorageUtils.setLocalStorageObject("UserRole",role);
              
            } else {
              console.error("Issue with role:",r);
            }
          }
        })
        .catch(e => console.error('Issue with role ',e));
      }
    }
    
    const prefillPlayerInfoForm = () => {
      UserUtils.getAuthenticatedUser()
        .then(aUser => {
          updatePlayerForm({given_name:aUser.given_name});
          updatePlayerForm({family_name:aUser.family_name});
          updatePlayerForm({email:aUser.email});
          updatePlayerForm({phone:aUser.phone_number});
          console.log("Player Form Initialized from local storage to",playerForm);
          
          loadUserId(aUser.email);

          if(userId !== null){
            APICaller.apiGetPlayerById(userId)
            .then(rPlayerInfo => {
              if(rPlayerInfo === null){
                APICaller.apiGetParentById(userId)
                  .then(gpR => {
                    if(gpR !== null) {
                      setFormState({isFirstUserVisit:false});
                      if(gpR !== null){
                        initFormModels({
                        parent: gpR
                      }); 
                      
                      if(gpR.players.items.length>0){
                        APICaller.apiGetPlayer(gpR.players.items[0].playerID)
                          .then(gPlR => {
                            initFormModels({
                              player: gPlR
                            }); 
                            if(gPlR.profiles && gPlR.profiles.items && gPlR.profiles.items.length > 0) {
                              APICaller.apiGetSportProfile(gPlR.profiles.items[0].playerSportProfileID)
                              .then(rProfileInfo => {
                                initFormModels({
                                  profile: rProfileInfo,
                                }); 
                              })
                            }
                          })
                        }
                        storeUserRole(gpR.email);
                      }
                    } else {
                      console.error("Parent also not found for this user id. Strange!",e);

                    }
                  })
                  .catch(e => {
                    console.error("Parent query filed for this user id. Strange!",e);
                  })
              } else {
                setFormState({isFirstUserVisit:false});
                initFormModels({
                  player: rPlayerInfo,
                });
                if(rPlayerInfo && rPlayerInfo.parents && rPlayerInfo.parents!== null && rPlayerInfo.parents.items && rPlayerInfo.parents.items.length > 0){
                  APICaller.apiGetParentById(rPlayerInfo.parents.items[0].parentID)
                  .then(rParentInfo => {
                    initFormModels({
                        parent: rParentInfo,
                      });  
                    })
                }
                if(rPlayerInfo && rPlayerInfo.profiles && rPlayerInfo.profiles!==null && rPlayerInfo.profiles.items && rPlayerInfo.profiles.items.length > 0) {
                  APICaller.apiGetSportProfile(rPlayerInfo.profiles.items[0].playerSportProfileID)
                    .then(rProfileInfo => {
                      initFormModels({
                        profile: rProfileInfo,
                      }); 
                    })
                }
                storeUserRole(rPlayerInfo.email);
              }
            })
            .catch(e => {
              console.error("Player not found for this email! Looking for parent.",e);
            });
            console.log("Player Form prefilled",playerForm,parentForm, profileForm);
          } else {
            APICaller.apiGetPlayer(aUser.email)
            .then(rPlayerInfo => {
              if(rPlayerInfo === null){
                APICaller.apiGetParent(aUser.email)
                  .then(gpR => {
                    if(gpR !== null) {
                      setFormState({isFirstUserVisit:false});
                      if(gpR !== null){
                        initFormModels({
                        parent: gpR
                      }); 
                      
                      if(gpR.players.items.length>0){
                        APICaller.apiGetPlayer(gpR.players.items[0].playerID)
                          .then(gPlR => {
                            initFormModels({
                              player: gPlR
                            }); 
                            if(gPlR.profiles && gPlR.profiles.items && gPlR.profiles.items.length > 0) {
                              APICaller.apiGetSportProfile(gPlR.profiles.items[0].playerSportProfileID)
                              .then(rProfileInfo => {
                                initFormModels({
                                  profile: rProfileInfo,
                                }); 
                              })
                            }
                          })
                        }
                        storeUserRole(gpR.email);
                      }
                    } else {
                      console.error("Parent also not found for this email. Strange!");

                    }
                  })
                  .catch(e => {
                    console.error("Parent also not found for this email. Strange!",e);
                  })
              } else {
                setFormState({isFirstUserVisit:false});
                initFormModels({
                  player: rPlayerInfo,
                });
                if(rPlayerInfo && rPlayerInfo.parents && rPlayerInfo.parents!== null && rPlayerInfo.parents.items && rPlayerInfo.parents.items.length > 0){
                  APICaller.apiGetParentById(rPlayerInfo.parents.items[0].parentID)
                  .then(rParentInfo => {
                    initFormModels({
                        parent: rParentInfo,
                      });  
                    })
                }
                if(rPlayerInfo && rPlayerInfo.profiles && rPlayerInfo.profiles!==null && rPlayerInfo.profiles.items && rPlayerInfo.profiles.items.length > 0) {
                  APICaller.apiGetSportProfile(rPlayerInfo.profiles.items[0].playerSportProfileID)
                    .then(rProfileInfo => {
                      initFormModels({
                        profile: rProfileInfo,
                      }); 
                    })
                }
                storeUserRole(rPlayerInfo.email);
              }
            })
            .catch(e => {
              console.error("Player not found for this email! Looking for parent.",e);
            });
            console.log("Player Form prefilled",playerForm,parentForm, profileForm);
          
            console.log("First time user spotted");
          }
        })
    }

    const initFormModels = ({player, parent, profile}) => {
    if(player && player!== null) {
      Object.keys(playerForm).forEach(k => {
        updatePlayerForm({
          _path:[k],
          _value:player[k]
        });
      })
      setPrevPlayerEmail(player.email);
      setCountry(player.country);
      setState(player.state);
      setCity(player.city);
      console.log("Player Form Initialized to",playerForm);
    }

    if(parent && parent!== null) {
      Object.keys(parentForm).forEach(k => {
        updateParentForm({
          _path:[k],
          _value:parent[k]
        });
      })
      setPrevParentEmail(parent.email);
      console.log("Parent Form Initialized to",parentForm);
    }

    if(profile && profile!== null) {
      Object.keys(profileForm).forEach(k => {
        if(k==='secondary_position') {
          setSecondaryPosition(positions.filter(x=>profile[k].includes(x.id+'')));
        }
        updateProfileForm({
          _path:[k],
          _value:profile[k]
        });
      })
      console.log("profile Form Initialized to",profileForm);
    }
    }

    prefillPlayerInfoForm();

    const subscription = APICaller.onAPIUpsertPlayer();

    return () => {
      subscription.unsubscribe();
    }
  }, [])

  
// const displayPositions = () => {
//   if(profileForm.primary_position && profileForm.primary_position!==null && profileForm.primary_position !==""){
//     setPositions(positions.filter(x => x.id !== profileForm.primary_position));
//     // return positions.filter(x.id !== profileForm.primary_position);
//   } 
//     return positions;
//   }

const onSelect = (selectedList, selectedItem) => {
  console.log(selectedList, selectedItem);
  setSecondaryPosition(selectedList);
  updateProfileForm({
    secondary_position:selectedList.map(x=>x.id+'')
  })
};

const onRemove = (selectedList, removedItem) => {
  console.log(selectedList, removedItem);
    setSecondaryPosition(selectedList);
    updateProfileForm({
      secondary_position:selectedList.map(x=>x.id+'')
    })
};

// const handleEChange = (e) => 
//   FormStateFiller.useEnhancedCallback(e, updatePlayerForm, updatePlayerFormErrors);
// ;
const handleEChange = useCallback(({ target: { value, name, type } }) => {
  const updatePath = name.split(".");

  // console.log("Name", name);
  // console.log("Type", type);
  // console.log("Value", value);
  

  // if we have to update the root level nodes in the form
  if (updatePath.length === 1) {
    const [key] = updatePath;
      updatePlayerForm({
        [key]: value
      });
  }

  // if we have to update nested nodes in the form object
  // use _path and _value to update them.
  if (updatePath.length > 1) {

    updatePlayerForm({
      _path: updatePath,
      _value: value
    });
  }

  if ( !!playerFormErrors[name] ) {
    let newErrs = playerFormErrors;
    delete newErrs[name];
    setPlayerFormErrors(newErrs);
  //   setPlayerFormErrors({
  //   ...playerFormErrors,
  //   [name]: null
  // })
  }
}, []);

const handleEParentChange = useCallback(({ target: { value, name, type } }) => {
  const updatePath = name.split(".");

  // console.log("Name", name);
  // console.log("Type", type);
  // console.log("Value", value);
  

  // if we have to update the root level nodes in the form
  if (updatePath.length === 1) {
    const [key] = updatePath;
      updateParentForm({
        [key]: value
      });
  }

  // if we have to update nested nodes in the form object
  // use _path and _value to update them.
  if (updatePath.length > 1) {

    updateParentForm({
      _path: updatePath,
      _value: value
    });
  }

  if ( !!parentFormErrors[name] ) {
    let newErrs = parentFormErrors;
    delete newErrs[name];
    setParentFormErrors(newErrs);
    // setParentFormErrors({
    // ...parentFormErrors,
    // [name]: null
  // })
  }
}, []);

const handleEProfileChange = useCallback(({ target: { value, name, type } }) => {
  const updatePath = name.split(".");

  // console.log("Name", name);
  // console.log("Type", type);
  // console.log("Value", value);
  // console.log(profileForm);

  // if(name==='primary_position'){
  //   handlePositionChange({
  //     target: {
  //       value: value
  //     }
  //   })
  // }
  // if we have to update the root level nodes in the form
  if (updatePath.length === 1) {
    const [key] = updatePath;
      updateProfileForm({
        [key]: value
      });
  }

  // if we have to update nested nodes in the form object
  // use _path and _value to update them.
  if (updatePath.length > 1) {

    updateProfileForm({
      _path: updatePath,
      _value: value
    });
  }

  if ( !!profileFormErrors[name] ){

    let newErrs = profileFormErrors;
    delete newErrs[name];
    setProfileFormErrors(newErrs);
    // setProfileFormErrors({
    //   ...profileFormErrors,
    //   [name]: null
    // })
  } 
  

}, []);

// const handlePositionChange = useCallback(({ target: { value, name, type } }) => {
// TODO - Validation for linking primary to secondary position
//   console.log("Name", name);
//   console.log("Type", type);
//   console.log("Value", value);

//   updatePositions(positions.filter(x => x.id !== value));

//   console.log(positions.filter(x => (x.id+'') !== value));
// }, []);


const handleDOBChange = (d) => {
  let tempd = format(d,'MM/dd/yyyy');
  console.log(tempd);
  handleEChange(
    {
      target: {
        name:'birth_date',
        value:tempd
      }
    }
  );
}

// new change ===========
const uploadFile = async (file) => {
var fileName = `${ Date.now()}-${file.name}`;
const result = await Storage.put(fileName, file, {
  contentType: file.type,
});

updatePlayerForm({
  dp: {
    key: result.key,
    bucket: aws_exports.aws_user_files_s3_bucket,
    region: aws_exports.aws_project_region
  }
});

setFileStatus(true);
console.log("File:", result);

};

const handleClick = async (event) => {
  // get our new errors
  // r is an array of the resolved returns from all promises in that array
  Promise.all([validateAndLoadPlayerErrors(), validateAndLoadParentErrors(),validateAndLoadProfileErrors()])
    .then(r => {
      let sum = 0;
      r.forEach(x=> {sum = Object.keys(x).length+sum});
      console.log("Errors sum:",sum); 

      if ( sum === 0 ) {
        console.log("Errors not found!",playerFormErrors, parentFormErrors, profileFormErrors);

        upsertProfileInfo()
          .then((response) => {
            setFormState({
              isSubmitted:true,
              message: "Player Profile Updated Successfully"
            });
            Router.push('/ViewProfilePage');
          })
          .catch((error) => {
            setFormState({
              isSubmitted:false,
              message: "Player Profile Update Failed: " + error.message
            });
          })
      } else {
        console.error("Resolve errors now", playerFormErrors, parentFormErrors, profileFormErrors);
      }
    })
}

const handleBackClick = () => {
  Router.back();
}
  
async function upsertProfileInfo() {

  return new Promise(
    async (resolve, reject) => {

      try {
        
        if (!playerForm || playerForm == null) {
          console.error("Invalid player form")
          reject({message: "Invalid player form"});
        }
        
        if (!parentForm || parentForm == null) {
          console.error("Invalid parent form")
          reject({message: "Invalid parent form"});
        }
        

          APICaller.apiUpsertPlayer(playerForm)
          .then(playerInfoDo => {
            APICaller.apiUpsertParent(parentForm)
              .then(parentInfoDo => {
                APICaller.apiUpsertPlayerParent(playerInfoDo, parentInfoDo)
                  .then(r => {
                    console.log('Linked Player to Parent');
                    // TODO - Ideally APICaller.apiUpsertSportsProfile can be an independant step after APICaller.apiUpsertParent. But chaining to make sure (easier) valid return happens to the caller. 
                    APICaller.apiUpsertSportsProfile(profileForm, playerInfoDo)
                    .then(profileInfoDo => {
                      APICaller.apiUpsertPlayerProfile(playerInfoDo, profileInfoDo)
                      .then(r => {
                        console.log("Linked player and profile",r);
                        resolve(playerInfoDo);
                      })
                      .catch(e => {
                        console.error("Failed linking player and profile",e);
                        reject(e);
                      })
                    })
                    .catch(e => {
                      console.error("Error upserting player profile",e);
                      reject(e);
                    })
                  })
                  .catch(e => {
                    console.error('Failed linking player to parent',e);
                    reject(e);
                  })
              })
              .catch(e => {
                console.error("Error upserting parent",e);
                reject(e);
              })
              })
          .catch(e => {
            console.error("Error upserting player",e);
            reject(e); 
          })
      } catch (err) {
        console.error('Unexpected error while updating player profile:', err)
        reject(err);
      }
    }
  )
}

const validateAndLoadPlayerErrors = () => {

  return new Promise(
    async (resolve, reject) => {

      const { given_name, family_name, phone, email, birth_date, gender, address, country, state, city, zip, graduation_year } = playerForm;
  
      const newErrors = {}
      
      if ( !given_name || given_name === '' ) {
        // updatePlayerFormErrors({given_name: 'Pls enter First Name!'})
        newErrors.given_name = 'Pls enter First Name!';
      }
        if ( !family_name || family_name === '' ) newErrors.family_name = 'Pls enter Last Name!';
      if ( !phone || phone === '' ) newErrors.phone = 'Pls enter Mobile!';
      if ( email && email === parentForm.email) {
        console.log("Player email:",email);
        newErrors.email = 'Parent and Player emails should not be same'
      } else if ( email && prevPlayerEmail && prevPlayerEmail !== email ) {
        UserUtils.getUserRole(email)
          .then(r => {
            if( r==='Player') {
              newErrors.email = 'Another player exists with this email. Try another'
            }
          })
      } 
  
      if ( !gender || gender === '' || gender === 'BLANK' ) {console.log("Gender:",gender);newErrors.gender = 'Pls enter gender!'; }
      if ( !birth_date || birth_date === '' ) newErrors.birth_date = 'Pls enter birth date!';
      if ( !address || address === '' ) newErrors.address = 'Pls enter address !';
      if ( !country || country === '' || country === 'BLANK') newErrors.country = 'Pls enter country!';
      if ( !state || state === '' || state === 'BLANK') newErrors.state = 'Plz enter state!';
      if ( !city || city === '' || city === 'BLANK') newErrors.city = 'Pls enter city!';
      if ( !zip || zip === '' ) newErrors.zip = 'Pls enter zip!';
      if ( !graduation_year || graduation_year === '' ) newErrors.graduation_year = 'Pls enter graduation year!';
  
  
      console.log("Player Form Errors ", newErrors);
      setPlayerFormErrors(newErrors);
      resolve(newErrors);
    }
  )

}

const validateAndLoadParentErrors = () => {
  return new Promise (
    async(resolve, reject) => {

      const newErrors = {}
      
  const { given_name, family_name, phone, email} = parentForm;

  if ( !given_name || given_name === '' ) newErrors.given_name = 'Pls enter first name!';
  if ( !family_name || family_name === '' ) newErrors.family_name = 'Pls enter last name!';
  if ( !phone || phone === '' ) newErrors.phone = 'Pls enter mobile!';
  if ( !email || email === '' ) {
    newErrors.email = 'Pls enter email!'
  } else if ( email === playerForm.email) {
    console.log("Parent email:",email);
    newErrors.email = 'Parent and Player emails should not be same'
  } else if( ( !playerForm.email || playerForm.email === null || playerForm.email === "" ) && userEmail && email !== userEmail ) {
    newErrors.email = 'Player email does not exist. So, Parent email should be same as login / account email.'
  } else if ( prevParentEmail && prevParentEmail !== email ) {
    UserUtils.getUserRole(email)
    .then(r => {
      if( r==='Parent') {
        newErrors.email = 'Another parent exists with this email. Try another.'
      }
    })
  };
  
  
  console.log("Parent Form Errors ", newErrors);
  setParentFormErrors(newErrors);
  resolve(newErrors);
}
)

}

const validateAndLoadProfileErrors =  () => {
  return new Promise(
    async (resolve, reject) => {

      const newErrors = {};
      const {sport, primary_position, hit, throwe} = profileForm;
      
      if ( !sport || sport === '' || sport === 'BLANK') newErrors.sport = 'Pls enter sport!';
      if ( !primary_position || primary_position === '' || primary_position==='BLANK') newErrors.primary_position = 'Pls enter primary position!';
      if ( !hit || hit === '' || hit === 'BLANK') newErrors.hit = 'Pls enter hit!';
      if ( !throwe || throwe === '' || throwe === 'BLANK') newErrors.throwe = 'Pls enter throw!';
      
      console.log("Profile Form Errors ", newErrors);
      setProfileFormErrors(newErrors);
      resolve(newErrors);
    }
  )

}

const handleCountryChange = ({ target: { value, name, type } }) => {
  setCountry(value);
  handleEChange({
    target: {
      name: 'country',
      value: value
    }
  });
}

const handleStateChange = ({ target: { value, name, type } }) => {
  setState(value);
  handleEChange({
    target: {
      name: 'state',
      value: value
    }
  });
} 

const handleCityChange = ({ target: { value, name, type } }) => {
  setCity(value);
  handleEChange({
    target: {
      name: 'city',
      value: value
    }
  });
}

const getPlayerCities = (country, state) => {
  if(country && country !== null && state && state !== null && state !=='BLANK'){
    if(cities.length===0){
      setCities(City.getCitiesOfState(country,state));
    } else {
      let lCities = City.getCitiesOfState(country,state);
      if(lCities.length !== cities.length){
        setCities(lCities);
      }
    }
    return cities;
  }
  return [{name:'BLANK'}]; 
}

const getPlayerStates = (country) => {
  if(country && country !== null && country !== 'BLANK'){
    if(states.length===0){
      setStates(State.getStatesOfCountry(country));
    } else {
      let lStates = State.getStatesOfCountry(country);
      if(lStates.length !== states.length){
        setStates(lStates);
      } 
    }
    return states;
  } 
  
  return [{name: 'BLANK'}];
}

const getPlayerCity = (country, state, city) => {
  let lCities = getPlayerCities(country, state);
  if(city && city !== null && city !=='BLANK'){
    let lCity =  lCities.filter(x => x.name===city);
    if(lCity && lCity !== null && lCity.length>0){
      return lCity;
    }
  }  
  
  return {name:'BLANK'};

}

const isCountrySelected = () => {
  return playerForm.country && playerForm.country !== null && playerForm.country !== "" && playerForm.country !== "BLANK";  
}

const isStateSelected = () => {
  return playerForm.state && playerForm.state !== null && playerForm.state !== "" && playerForm.state !== "BLANK";
}

const isCitySelected = () => {
  playerForm.city && playerForm.city !== null && playerForm.city !== "" && playerForm.city !== "BLANK"
}


return (
  <div className={styles.container} align="center">
    <main1 className={styles.submain1} >
        <div>
  <Container 
  //className="mt-4 mb-4"
  className="mt-4 mb-4 shadow p-3 mb-5 bg-white rounded "
  >
    <Row><p>{formState.isFirstUserVisit? "Looking like you are here for the first time. Create your profile":"Update your profile information"}</p></Row>
    <Row>
      <Col>
        <Form>
          <Card>
            <Card.Header
              style={{
                fontSize: "1.75rem",
                fontWeight: "500",
              }}
            >
              Player Personal Profile
            </Card.Header>
            <Card.Body>
              <Card className="border-0">
                <Stack>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        controlId="playerForm.given_name"
                        type="text"
                        placeholder="Enter First Name"
                        name="given_name"
                        defaultValue={playerForm.given_name}
                        onChange={handleEChange}
                        required
                        isInvalid={!!playerFormErrors.given_name}
                        // rules={[
                        //   {
                        //   required: true,
                        //   message: "Please enter your name",},
                        // ]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.given_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        controlId="playerForm.family_name"
                        type="text"
                        placeholder="Enter Last Name"
                        onChange={handleEChange}
                        name="family_name"
                        defaultValue={playerForm.family_name}
                        required
                        isInvalid={!!playerFormErrors.family_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.family_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>*Mobile</Form.Label>
                      <Form.Control
                        controlId="playerForm.phone"
                        type="text"
                        placeholder="Enter Mobile"
                        onChange={handleEChange}
                        name="phone"
                        defaultValue={playerForm.phone}
                        required
                        isInvalid={!!playerFormErrors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>*Email</Form.Label>
                      <Form.Control
                        controlId="playerForm.email"
                        type="email"
                        onChange={handleEChange}
                        name="email"
                        defaultValue={playerForm.email}
                        required
                        isInvalid={!!playerFormErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker 
                          label="*Enter Birth Date"
                          name="birth_date"
                          onChange={handleDOBChange}
                          value={playerForm.birth_date}
                          renderInput={(params) => <TextField {...params} />}
                          required
                          isInvalid={!!playerFormErrors.birth_date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {playerFormErrors.birth_date}
                        </Form.Control.Feedback>
                      </LocalizationProvider>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>*Gender</Form.Label>
                      <Form.Select 
                        aria-label="Select gender"
                        controlId="playerForm.gender"
                        onChange={handleEChange}
                        name="gender"
                        value={playerForm.gender}
                        required
                        isInvalid={!!playerFormErrors.gender}
                        >
                        <option value="BLANK">Select Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        {/* <option value="LGBTQIA">LGBTQIA</option> */}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.gender}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>*Address</Form.Label>
                      <Form.Control
                        controlId="playerForm.address"
                        type="text"
                        placeholder="Enter address"
                        onChange={handleEChange}
                        name="address"
                        defaultValue={playerForm.address}
                        isInvalid={!!playerFormErrors.address}
                        />
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.address}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Select 
                        aria-label="*Select country"
                        controlId="playerForm.country"
                        placeholder="*Country"
                        value={country || 'US'}
                        name="country"
                        onChange={handleCountryChange}
                        required
                        isInvalid={!!playerFormErrors.country}
                          >
                          { 
                            isCountrySelected()?
                              <option 
                                value={Country.getCountryByCode(playerForm.country).isoCode}>
                                {Country.getCountryByCode(playerForm.country).name}
                              </option>
                              :
                              <option 
                                value="BLANK">
                                Select Country...
                              </option>    
                          }
                          {
                            Country.getAllCountries().map((value, key) => {
                              return (
                                <option value={value.isoCode} key={key}>
                                  {value.name}
                                </option>
                              );
                            })
                          }
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {playerFormErrors.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Select 
                        aria-label="*Select state"
                        controlId="playerForm.state"
                        placeholder="*State"
                        value={state}
                        name="state"
                        onChange={handleStateChange}
                        required
                        isInvalid={!!playerFormErrors.state}
                        >
                        { 
                          isCountrySelected() && isStateSelected() &&
                            <option 
                              value={() => {
                                  let stateSelected = State.getStateByCodeAndCountry(playerForm.state,playerForm.country);
                                  if(stateSelected){
                                    return(stateSelected.isoCode)
                                  } 
                                }}>
                              {() => {
                                  let stateSelected = State.getStateByCodeAndCountry(playerForm.state,playerForm.country);
                                  if(stateSelected){
                                    return(stateSelected.name)
                                  } 
                                }
                                }
                            </option>   
                        }
                        if(playerForm.country){
                          getPlayerStates(playerForm.country)
                          .map((value, key) => {
                              return (
                                <option value={value.isoCode} key={key}>
                                  {value.name}
                                </option>
                              );
                            }
                          )
                        } else {
                          getPlayerStates('US')
                          .map((value, key) => {
                              return (
                                <option value={value.isoCode} key={key}>
                                  {value.name}
                                </option>
                              );
                            }
                          )
                        } 
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {playerFormErrors.state}
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    {/* <p>{JSON.stringify(City.getCitiesOfState(playerForm.country,playerForm.state))}</p> */}
                    <Form.Group className="mb-4">
                      <Form.Select aria-label="Select City"
                        controlId="playerForm.city"
                        placeholder="City"
                        value={city}
                        name="city"
                        onChange={handleCityChange}
                        required  
                        isInvalid={!!playerFormErrors.city}
                        >
                        { 
                          isCountrySelected() && isStateSelected() && isCitySelected()?
                            <option 
                              value={getPlayerCity(playerForm.country,playerForm.state,playerForm.city)[0].name}>
                              {getPlayerCity(playerForm.country,playerForm.state, playerForm.city)[0].name}
                            </option>
                            :
                            <option value="BLANK">*Select City...</option>    
                        }
                        {
                          isCountrySelected() && isStateSelected()? 
                          getPlayerCities(playerForm.country, playerForm.state).map((value, key) => {
                            return (
                              <option value={value.name} key={key}>
                                {value.name}
                              </option>
                            );
                          })
                          :
                          <></>
                        }
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          {playerFormErrors.city}
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4" >
                      <Form.Label>*Zip Code</Form.Label>
                      <Form.Control
                        controlId="playerForm.zip"
                        type="text"
                        placeholder="Enter zip code"
                        onChange={handleEChange}
                        name="zip"
                        defaultValue={playerForm.zip}
                        required
                        isInvalid={!!playerFormErrors.zip}
                        />
                        <Form.Control.Feedback type="invalid">
                          {playerFormErrors.zip}
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-4">
                      <Form.Label>*Graduation Year</Form.Label>
                      <Form.Control
                        controlId="playerForm.graduation_year"
                        type="text"
                        placeholder="Enter graduation year"
                        onChange={handleEChange}
                        name="graduation_year"
                        defaultValue={playerForm.graduation_year}
                        isInvalid={!!playerFormErrors.graduation_year}
                        />
                        <Form.Control.Feedback type="invalid">
                          {playerFormErrors.graduation_year}
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                  {/* <p>{_.range(4,6,1).forEach(x => _.range(1,12,1).forEach(y => console.log(x+'\''+y+'\"')))}</p> */}
                    <Form.Group className="mb-4">
                      <Form.Label>Height - F&apos;I&quot; - like 5&apos;10&quot;</Form.Label>
                      <Form.Select
                        controlId="playerForm.height"
                        type="text"
                        placeholder="Enter height"
                        onChange={handleEChange}
                        name="height"
                        defaultValue={playerForm.height}
                        value={playerForm.height}
                        >
                          <option>Select Height</option>
                          {
                            heightValues.map((v,i) => {
                              return <option value={v} key={i}>{v}</option>
                            })
                          }
                          </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                      {/* <p>{_.range(75,250,5).forEach(x=>{console.log( x+'');})}</p> */}
                    <Form.Group className="mb-4">
                      <Form.Label>Weight - In pounds</Form.Label>
                      <Form.Select
                        controlId="playerForm.weight"
                        type="text"
                        placeholder="Enter weight"
                        onChange={handleEChange}
                        name="weight"
                        defaultValue={playerForm.weight}
                        value={playerForm.weight}
                        >
                          <option>Select Weight...</option>
                          {
                            _.range(255,70,-5).map((opt,i) => {
                              return <option value={opt+''} key={i}>{opt+''}</option>
                            })
                          }
                          
                          </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                  <Col>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Upload Photo</Form.Label>
                      <Form.Control 
                        controlId="playerForm.dp"
                        type="file" 
                        onChange={(e) => {
                          uploadFile(e.target.files[0]);
                          }}
                        name="dp"
                        />
                    </Form.Group>
                  </Col>
                      {fileStatus ? 'File uploaded successfully' : ""}
                  </Col>
                </Stack>
              </Card>
            </Card.Body>
          </Card>
          <br/>
          <Card className="border-0">
            <Card.Header
              style={{
                fontSize: "1.50rem",
                fontWeight: "400",
              }}
            >
              Parent Details
            </Card.Header>
            <br/>
            <Stack>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>*First Name</Form.Label>
                  <Form.Control
                    controlId="parentForm.given_name"
                    type="text"
                    placeholder="Enter First Name"
                    name="given_name"
                    defaultValue={parentForm.given_name}
                    onChange={handleEParentChange}
                    isInvalid={!!parentFormErrors.given_name}
                        
                  />
                  <Form.Control.Feedback type="invalid">
                    {parentFormErrors.given_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    controlId="parentForm.family_name"
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={handleEParentChange}
                    name="family_name"
                    defaultValue={parentForm.family_name}
                    isInvalid={!!parentFormErrors.family_name}
                        
                  />
                  <Form.Control.Feedback type="invalid">
                    {parentFormErrors.family_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>*Mobile</Form.Label>
                  <Form.Control
                    controlId="parentForm.phone"
                    type="text"
                    placeholder="Enter Mobile"
                    onChange={handleEParentChange}
                    name="phone"
                    defaultValue={parentForm.phone}
                    isInvalid={!!parentFormErrors.phone}
                        
                  />
                  <Form.Control.Feedback type="invalid">
                    {parentFormErrors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-4">
                  <Form.Label>*Email</Form.Label>
                  <Form.Control
                    controlId="parentForm.email"
                    type="email"
                    onChange={handleEParentChange}
                    name="email"
                    defaultValue={parentForm.email}
                    placeholder="Enter email"
                    isInvalid={!!parentFormErrors.email}
                        
                  />
                  <Form.Control.Feedback type="invalid">
                    {parentFormErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Stack>
          </Card>
          <br/>
          <Card className="border-0">
            <Card.Header
              style={{
                fontSize: "1.50rem",
                fontWeight: "400",
              }}
            >
              Player Sport Profile
            </Card.Header>
            <br/>
            <Card.Body>
              <Stack>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>*Sport</Form.Label>
                    <Form.Select 
                      aria-label="sport"
                      controlId="profileForm.sport"
                      onChange={handleEProfileChange}
                      value={profileForm.sport}
                      name="sport"
                      required
                      isInvalid={!!profileFormErrors.sport}
                        
                      >
                      <option value="BLANK">Select Option</option>
                      <option value="Baseball">Baseball</option>
                      <option value="Softball">Softball</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {profileFormErrors.sport}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>*Position 1</Form.Label>
                    <Form.Select 
                      aria-label="Primary Position"
                      controlId="profileForm.primary_position"
                      onChange={handleEProfileChange}
                      value={profileForm.primary_position}
                      name="primary_position"
                      required
                      isInvalid={!!profileFormErrors.primary_position}
                        
                      >
                      <option value="BLANK">Select Position...</option>
                      <option value="1B">1B</option>
                      <option value="2B">2B</option>
                      <option value="3B">3B</option>
                      <option value="Short Stop">Short Stop</option>
                      <option value="Infield">Infield</option>
                      <option value="Outfield">Outfield</option>
                      <option value="RH Pitcher">RH Pitcher</option>
                      <option value="LH Pitcher">LH Pitcher</option>
                      <option value="Catcher">Catcher</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {profileFormErrors.primary_position}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Position 2</Form.Label>
                    <Multiselect
                      options={positions}
                      onSelect={onSelect}
                      onRemove={onRemove}
                      displayValue="option"
                      showCheckbox
                      controlId="secondaryPosition"
                      selectedValues={secondaryPosition}
                      value={secondaryPosition}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>*Hit</Form.Label>
                    <Form.Select 
                      aria-label="Hit"
                      controlId="profileForm.hit"
                      onChange={handleEProfileChange}
                      value={profileForm.hit}
                      name="hit"
                      required
                      isInvalid={!!profileFormErrors.hit}
                        
                      >
                      <option value="BLANK">Select Option</option>
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Switch">Switch</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {profileFormErrors.hit}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>*Throw</Form.Label>
                    <Form.Select 
                      aria-label="Throw"
                      controlId="profileForm.throwe"
                      onChange={handleEProfileChange}
                      value={profileForm.throwe}
                      name="throwe"
                      required
                      isInvalid={!!profileFormErrors.throwe}
                        
                      >
                      <option value="BLANK">Select Option</option>
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {profileFormErrors.throwe}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col className="text-center">
                  <Row>
                    <Col className="text-center" lg={3}>
                      <Button 
                        variant="primary"
                        // type="submit"
                        onClick={handleClick} 
                        >
                        Update Player Profile
                      </Button>
                    </Col>
                    <Col className="text-center" lg={2}>
                      <Button 
                        variant="danger"
                        onClick={handleBackClick}>
                        Take me back
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col className="text-center">
                  {
                    formState.isSubmitted !== null ?  
                      formState.isSubmitted ? 
                        <Alert 
                          key="success"
                          variant="success"
                          >
                          {formState.message}
                        </Alert>
                      :
                        <Alert 
                          key="danger"
                          variant="danger"
                          >
                          {formState.message}
                        </Alert>
                    :
                      <br/> 
                  }
                </Col>
              </Stack>
            </Card.Body>
          </Card>
        </Form>    
      </Col>
    </Row>
  </Container>
  </div>
  </main1>
  </div>
);
}

export default PlayerProfileForm;
