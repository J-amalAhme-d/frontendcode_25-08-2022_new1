  import {
      Container,
      Row,
      Col,
      Card,
      Button,
      Dropdown,
      Stack,
      Form,
      Alert,
   } from "react-bootstrap";




import { useCallback, useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from '@mui/material/TextField';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { Country, State, City }  from 'country-state-city';
import { format } from "date-fns";
import Router from "next/router";

import APICaller from "../api/APICaller";
import FormStateFiller from "../src/utils/FormStateFiller";
import UserUtils from "../src/utils/UserUtils";
import { Storage, Auth } from "aws-amplify";
import aws_exports from '../src/aws-exports'



import moment from 'moment'


function CoachProfileForm (props) {

  let initialCoachState = {
    given_name:'',
    family_name:'',
    phone:'',
    email:'',
    birth_date: '',
    // address:'',
    gender:'',
    country:'',
    state:'',
    city:'',
    zip:'',
    organization:'',
    sport:'',
    dp:null
  };

  //for ant design----
  // const { Header, Content, Sider } = Layout;
  // const [cForm] = Form.useForm();

  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);

  const [coachForm, updateCoachForm] = useReducer(FormStateFiller.enhancedReducer, initialCoachState);
  
  const [formState, setFormState] = useState({
    isSubmitted:null,
    message:null,
    isFirstUserVisit:true
  }); 
  const [ states, setStates ] = useState([]);
  const [ country, setCountry ] = useState();
  const [ state, setState ] = useState();
    
  useEffect(() => {
    const updateCoachInfo = () => {
      UserUtils.getAuthenticatedUser()
        .then(aUser => {
          updateCoachForm({given_name:aUser.given_name});
          updateCoachForm({family_name:aUser.family_name});
          updateCoachForm({email:aUser.email});
          updateCoachForm({phone:aUser.phone_number});
  
          // cForm.setFieldsValue({
          //   given_name:aUser.given_name,
          //   family_name:aUser.family_name,
          //   email:aUser.email,
          //   phone:aUser.phone_number
          // });

          console.log("Coach Form Initialized from local storage to", coachForm);
          
          APICaller.apiGetCoach(aUser.email)
            .then(cRes => {
              if(cRes && cRes !== null) {
                setFormState({
                  isFirstUserVisit:false
                });
                initFormModel({
                  coach: cRes,
                });
              } else {
                console.warn("Coach not found");
              }
            })
            .catch(e => console.error("getCoach query failed",e))
        })
    }
    
    const initFormModel = ( { coach } ) => {
      if(coach && coach!== null) {
        Object.keys(coachForm).forEach(k => {
          updateCoachForm({
            _path:[k],
            _value:coach[k]
          });
        })

        let bDate = moment(new Date(coach.birth_date));
        coach.birth_date = bDate;
        setState(coach.state);
        setCountry(coach.country);
        cForm.setFieldsValue(coach);
        console.log("Coach Form Initialized to",coachForm);
      }
    }

    updateCoachInfo();
  },[])



  const handleEChange = useCallback(({ target: { value, name, type } }) => {
    const updatePath = name.split(".");

    console.log("Name", name);
    console.log("Type", type);
    console.log("Value", value);
    

    // if we have to update the root level nodes in the form
    if (updatePath.length === 1) {
      const [key] = updatePath;
        updateCoachForm({
          [key]: value
        });
    }

    // if we have to update nested nodes in the form object
    // use _path and _value to update them.
    if (updatePath.length > 1) {

      updateCoachForm({
        _path: updatePath,
        _value: value
      });
    }
  }, []);

  const handleChange = (e) => {
    // setCoachForm({...coachForm,[e.target.name]:e.target.value});
  }

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

  const getCoachStates = (country) => {
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

  // new change ===========
const uploadFile = async (file) => {
  var fileName = `${ Date.now()}-${file.name}`;
  const result = await Storage.put(fileName, file, {
    contentType: file.type,
  });

  updateCoachForm({
    dp: {
      key: result.key,
      bucket: aws_exports.aws_user_files_s3_bucket,
      region: aws_exports.aws_project_region
    }
  });

  setFileStatus(true);
  console.log(21, result);

};

  async function addCoach(coachDo) {
    // APICaller.apiUpsertCoach(coachForm)
    APICaller.apiUpsertCoach(coachDo)
      .then(r => {
        console.log("CoachUpsert Complete");
        setFormState({
          isSubmitted: true,
          message: "Coach Profile Updated Successfully"
        })
        Router.push('/ViewProfilePage');
      })
      .catch(e => {
        setFormState({
          isSubmitted: false,
          message: "Coach Profile Update Failed: " + e.message
        })
      })
  }

  const handleBackClick = () => {
    Router.back();
  }

  const handleFormFilled = (formValues) => {
    console.log("Form Values:", formValues);
    let tempd = formValues.birth_date.format('MM/DD/YYYY');
    delete formValues['birth_date'];
    addCoach({...formValues,'birth_date':tempd});
  }

  return (
     <Container className="mt-4 mb-4">
       {/* <p>{JSON.stringify(userAuthContext)}</p> */}
       <Row><p>{formState.isFirstUserVisit? "Looking like you are here for the first time. Create your profile":"Update your profile information"}</p></Row>
       <Row>
         <Col>
           <Card>
             <Card.Header
               style={{
                 fontSize: "1.75rem",
                 fontWeight: "500",
               }}
             >
               Coach Profile Update
             </Card.Header>
             <Card.Body>
               <Form>
                 <Stack>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>First Name</Form.Label>
                       <Form.Control
                         controlId="coachForm.given_name"
                         type="text"
                         placeholder="Enter Given Name"
                         name="given_name"
                         defaultValue={coachForm.given_name}
                         onChange={handleEChange}
                         required
                         //  rules={[
                         //       {
                         //       required: true,
                         //       message: "Please enter your name",},
                         //     ]}
                       />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Middle Name</Form.Label>
                       <Form.Control
                         controlId="coachForm.middle_name"
                         type="text"
                         placeholder="Enter Middle Name"
                         name="middle_name"
                         onChange={handleEChange}
                         defaultValue={coachForm.middle_name}
                       />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Last Name</Form.Label>
                       <Form.Control
                         controlId="coachForm.family_name"
                         type="text"
                         placeholder="Enter Family Name"
                         onChange={handleEChange}
                         name="family_name"
                         defaultValue={coachForm.family_name}
                         required
                       />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Mobile</Form.Label>
                       <Form.Control
                         controlId="coachForm.phone"
                         type="text"
                         placeholder="Enter Mobile"
                         onChange={handleEChange}
                         name="phone"
                         defaultValue={coachForm.phone}
                         required
                       />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Email</Form.Label>
                       <Form.Control
                         controlId="coachForm.email"
                         type="email"
                         disabled
                         onChange={handleEChange}
                         name="email"
                         defaultValue={coachForm.email}
                         required
                       />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <LocalizationProvider dateAdapter={AdapterDateFns}>
                         <MobileDatePicker 
                           label="Enter Birth Date"
                           name="birth_date"
                           onChange={handleDOBChange}
                           value={coachForm.birth_date}
                           renderInput={(params) => <TextField {...params} />}
                           required
                         />
                       </LocalizationProvider>
                     </Form.Group>
                   </Col>
                   {/* <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Address</Form.Label>
                       <Form.Control
                         controlId="coachForm.address"
                         type="text"
                         placeholder="Enter address"
                         onChange={handleEChange}
                         name="address"
                         defaultValue={coachForm.address}
                         />
                     </Form.Group>
                   </Col> */}
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Gender</Form.Label>
                       <Form.Select 
                         aria-label="Select gender"
                         controlId="coachForm.gender"
                         onChange={handleEChange}
                         name="gender"
                         value={coachForm.gender}
                         required
                         >
                         <option>Select Gender...</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         {/* <option value="LGBTQIA">LGBTQIA</option> */}
                       </Form.Select>
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Select 
                         aria-label="Select country"
                         controlId="coachForm.country"
                         placeholder="Country"
                         value={coachForm.country}
                         name="country"
                         onChange={handleEChange}
                         required
                           >
                           { 
                             coachForm.country && coachForm.country !== null && coachForm.country !== ""?
                               <option 
                                 value={Country.getCountryByCode(coachForm.country).isoCode}>
                                 {Country.getCountryByCode(coachForm.country).name}
                               </option>
                               :
                               <option>Select Country...</option>    
                           }
                           {
                             Country.getAllCountries().map((value, key) => {
                               return (
                                   <option value={value.isoCode} key={key}>
                                     {value.name}
                                   </option>
                                 );
                               }
                             )
                           }
                       </Form.Select>
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Select 
                         aria-label="Select state"
                         controlId="coachForm.state"
                         placeholder="State"
                         value={coachForm.state}
                         name="state"
                         onChange={ handleEChange }
                         required
                         >
                         { 
                           coachForm.country && coachForm.country !== null && coachForm.country !== "" && coachForm.state && coachForm.state !== null && coachForm.state !== ""?
                             <option 
                               value={() => {
                                 let stateSelected = State.getStateByCodeAndCountry(playerForm.state, playerForm.country);
                                 if(stateSelected){
                                   return(stateSelected.isoCode)
                                 } 
                               }}>
                               {() => {
                                 let stateSelected = State.getStateByCodeAndCountry(playerForm.state,playerForm.country);
                                 if(stateSelected){
                                   return(stateSelected.name)
                                 } 
                               }}
                             </option>
                             :
                             <option>Select State...</option>    
                         }
                         if(coachForm.country){
                           State.getStatesOfCountry(coachForm.country)
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
                     </Form.Group>
                   </Col>
                   {/* <Col>
                     <Form.Group className="mb-4">
                       <Form.Select aria-label="Select City"
                         controlId="coachForm.city"
                         placeholder="City"
                         value={coachForm.city}
                         name="city"
                         onChange={
                           // (e) => setSelectedCity(e.target.value)
                           // handleEChange
                           handleCityChange
                           }
                         required  
                           >
                         { 
                           () => {
                             return coachForm.city && coachForm.city !== null ?
                               (
                                 <option 
                                   value={City.getCitiesOfState(coachForm.country,coachForm.state).filter(x => x.isoCode===coachForm.city)[0].isoCode}>
                                   {City.getCitiesOfState(coachForm.country,coachForm.state).filter(x => x.isoCode===coachForm.city)[0].name}
                                 </option>
                               )
                             :
                               (
                                 <option>Select City...</option>    
                               )
                           }
                         }  
                         {
                           City.getCitiesOfState(coachForm.country, coachForm.state).map((value, key) => {
                             return (
                               <option value={value.isoCode} key={key}>
                                 {value.name}
                               </option>
                             );
                           })
                         }
                         </Form.Select>
                     </Form.Group>
                   </Col> */}
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Zip Code</Form.Label>
                       <Form.Control
                         controlId="coachForm.zip"
                         type="text"
                         placeholder="Enter zip code"
                         onChange={handleEChange}
                         name="zip"
                         defaultValue={coachForm.zip}
                         required
                         />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Organization</Form.Label>
                       <Form.Control
                         controlId="coachForm.organization"
                         type="text"
                         placeholder="Enter organization"
                         onChange={handleEChange}
                         name="organization"
                         defaultValue={coachForm.organization}
                         />
                     </Form.Group>
                   </Col>
                   <Col>
                     <Form.Group className="mb-4">
                       <Form.Label>Sport</Form.Label>
                       <Form.Select 
                         aria-label="sport"
                         controlId="coachForm.sport"
                         onChange={handleEChange}
                         value={coachForm.sport}
                         name="sport">
                         <option>Select Option</option>
                         <option value="Baseball">Baseball</option>
                         <option value="Softball">Softball</option>
                       </Form.Select>
                     </Form.Group>
                   </Col>
                   <Col>
                     <Col>
                       <Form.Group controlId="formFile" className="mb-3">
                         <Form.Label>Upload Photo</Form.Label>
                         <Form.Control 
                           controlId="coachForm.dp"
                           type="file" 
                           onChange={(e) => {
                             // setFileData(e.target.files[0]);
                             uploadFile(e.target.files[0]);
                             }}
                           name="dp"
                           />
                       </Form.Group>
                     </Col>
                   
                     {/* <div>
                             <input type="file" onChange={(e) => setFileData(e.target.files[0])}/>
                             </div>
                             <br></br>
                             <div>
                               <button onClick={uploadFile}>
                                 Upload File
                               </button>
                             </div> */}
                             {fileStatus ? 'File uploaded successfully' : ""}

                            
                     </Col>
                   <Col className="text-center">
                     <Row>
                       <Col className="text-center" lg={3}>
                         <Button 
                           variant="primary"
                           onClick={addCoach}>
                           Update Coach Profile
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
               </Form>
             </Card.Body>
           </Card>
         </Col>
       </Row>
     </Container>
      );
}

export default CoachProfileForm;
