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

import styles from '../styles/Home.module.css' 

import { useCallback, useReducer, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from "@mui/material";
import { Country, State, City }  from 'country-state-city';
import StorageUtils from "../src/utils/StorageUtils";
import APICaller from "../api/APICaller";
import FormStateFiller from "../src/utils/FormStateFiller";
import { format } from "date-fns";
import Router, { useRouter } from 'next/router';
import UserUtils from "../src/utils/UserUtils";
import SlotForm from "./SlotForm";
import { Storage } from "aws-amplify";
import aws_exports from '../src/aws-exports';
import TryoutTimePicker from "./TryoutTimePicker";


  
const EventForm = (props) => {

  const router = useRouter();
  
    const initialEventState = {
    title:'',
    sport:'',
    event_from_date:'',
    event_to_date:'',
    // age_groups:[],
    age_groups_slots:[],
    organization:'',
    organization_website:'',
    evaluation_year:2022,
    evaluation_season:'',
    // slots:[],
    address:'',
    city:'',
    state:'',
    country:'US',
    zip:'',
    checkin_time:'',
    start_time:'',
    finish_time:'',
    player_registration_price:5.00,
    player_registration_price_units:'USD',
    event_registration_price:19.99,
    event_registration_price_units:'USD',
    event_cover_pic:null,
    additional_info:'',
    poc_full_name:'',
    poc_phone:'',
    poc_email:''
  }
  const [eventForm, updateEventForm] = useReducer(FormStateFiller.enhancedReducer, initialEventState);
  
  // useEffect(() => {
  //   console.log("useEffect evntForm:", eventForm);
  // }, [eventForm])
  
  const [paymentFormState, setPaymentFormState] = useState({
    event_registration_price:19.99,
    event_registration_price_units:'usd',
    sender:'Coach',
    receiver:'TrueTryouts',
    event_id:'',
    unit_amount: 19.99,
    quantity: 1,
    product: 'Event Registration',
    currency: 'USD'
  });
  const [formState, setFormState] = useState({
    isSubmitted:null,
    message:null,
  });
  
  const [isUpdate, setIsUpdate] = useState();

  const [ageGroups, setAgeGroups] = useState([]);
  const [ageRange, setAgeRange] = useState([
    { id: 1, option: "8u" },
    { id: 2, option: "9u" },
    { id: 3, option: "10u" },
    { id: 4, option: "11u" },
    { id: 5, option: "12u" },
    { id: 6, option: "13u" },
    { id: 7, option: "14u" },
    { id: 8, option: "15u" },
    { id: 9, option: "16u" },
    { id: 10, option: "17u" },
    { id: 11, option: "18u" },
  ]);

  let eSlot = {
    age_groups:[],
    tryout_date:'',
    start_time:'',
    finish_time:''
  };

  const [slots, setSlots] = useState([eSlot]);
  const [fileData, setFileData] = useState();
  const [fileStatus, setFileStatus] = useState(false);
  const [userId, setUserId] = useState();


  const handleEChange = useCallback(({ target: { value, name, type } }) => {
    const updatePath = name.split(".");

    console.log("Name", name);
    console.log("Type", type);
    console.log("Value", value);
    console.log("Before typeof value: "+ typeof value);
    console.log("updatePath:", updatePath);
    if(name === 'evaluation_year' || name === 'player_registration_price'){
      console.log("convert");
        value = value - 0;
    }
    console.log("After typeof value: "+ typeof value);
    // if we have to update the root level nodes in the form
    if (updatePath.length === 1) {
      const [key] = updatePath;
        updateEventForm({
          [key]: value
        });
    }

    // if we have to update nested nodes in the form object
    // use _path and _value to update them.
    if (updatePath.length > 1) {
      updateEventForm({
        _path: updatePath,
        _value: value
      });
    }
  }, []);
  
  const handleStartDateChange = (d) => {
    // setEventForm({...eventForm,event_from_date:d});
    let tempd = format(d,'MM/dd/yyyy');
    console.log(tempd);
    handleEChange(
      {
        target: {
          name:'event_from_date',
          value:tempd
        }
      }
    );
  }

  const handleEndDateChange = (d) => {
    // setEventForm({...eventForm,event_to_date:d});
    let tempd = format(d,'MM/dd/yyyy');
    console.log(tempd);
    handleEChange(
      {
        target: {
          name:'event_to_date',
          value:tempd
        }
      }
    );
  }

  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList, selectedItem);
    setAgeGroups(selectedList);
    updateEventForm({
      age_groups:selectedList.map(x=>x.id+'')
    })
  };

  const onRemove = (selectedList, removedItem) => {
    console.log(selectedList, removedItem);
    setAgeGroups(selectedList);
    updateEventForm({
      age_groups:selectedList.map(x=>x.id+'')
    })
  };

  const handleCheckInTimeChange = (t) => {
    //let tempT = formatISO9075(t, { representation:'time' });
    handleEChange(
      {
        target: {
          name:'checkin_time',
          value:t
        }
      }
    );
  }
  
  const handleStartTimeChange = (t) => {
      //let tempT = formatISO9075(t, { representation:'time' });
      console.log("TIME:", t);
      handleEChange(
        {
          target: {
            name:'start_time',
            value:t
          }
        }
      );
  }

  const handleFinishTimeChange = (t) => {
    //let tempT = formatISO9075(t, { representation:'time' });
    handleEChange(
      {
        target: {
          name:'finish_time',
          value:t
        }
      }
    );
  }


  const addSlot = () => {
    let newSlots = slots;
    newSlots.push(eSlot);
    setSlots(newSlots);
    handleEChange(
      {
        target: {
          name: 'age_groups_slots',
          value: slots
        }
      }
    );
  }

  const removeSlot = (i) => {
    let newSlots = slots;
    newSlots.splice(i,1);
    setSlots(newSlots);
    handleEChange(
      {
        target: {
          name: 'age_groups_slots',
          value: slots
        }
      }
    );
  }

  useEffect(() =>{
    // console.log("Slots changed:", slots);
    // console.log(router.query);
    const prefillEventForm = () => {
      if(router && router.query && router.query.event_id && router.query.event_id !==null){
        setIsUpdate(true);
        //Make sure id is present in the model. Otherwise, we create a new record. 
        updateEventForm({_path:'id', _value:router.query.event_id});
        APICaller.apiGetEvent(router.query.event_id)
          .then(geR => {
            Object.keys(eventForm).forEach(k => {
              updateEventForm({
                _path:[k],
                _value:geR[k]
              });
            })
            console.log("Event Form Initialized to",eventForm);
          })
          .catch(e => {
            console.error("Error fetching event: ",e);
          })
      } else {
        console.log("Fresh event");
      }
    }

    prefillEventForm();

    let usrId = StorageUtils.getLocalStorageObject('usid');
    setUserId(usrId);

  }, [])
  

  const uploadFile = async (file) => {
    var fileName = `${ Date.now()}-${file.name}`;
    const result = await Storage.put(fileName, file, {
      contentType: file.type,
    });

    updateEventForm({
      event_cover_pic: {
        key: result.key,
        bucket: aws_exports.aws_user_files_s3_bucket,
        region: aws_exports.aws_project_region
      }
    });

    setFileStatus(true);
    console.log(21, result);

  };
  
  const handleClick = () => {
    // UserUtils.getAuthenticatedUser() 
      // .then(aUser => {
        // console.log(aUser);
        //TODO - Create event at the landing page after the payment is successful
        if(userId){
          APICaller.apiUpsertEvent(eventForm, userId)
            .then((response) => {
              console.log("Event added",response);
              setPaymentFormState({
                event_id: response.id,
                currency: 'USD',
                quantity: 1,
                product: response.title,
                unit_amount: 19.99,
              })
              StorageUtils.setLocalStorageObject("EventInfo",response);
              setFormState({
                isSubmitted: true,
                message:"Event Details Updated Successfully"
              })
              //Router.push(actualPath,hiddenPath) - We are, obviously, hiding query params 
              if(isUpdate){
                //Edits are not charged. So, take the coach back to their events page. 
                Router.push({pathname:'/CoachMyEventsPage'});
              } else {
                //Pay up, Coach Carter! 
                Router.push({
                  pathname:'/EventPaymentPage',
                  query: {
                    type: 1,
                    event_id: response.id,
                    product_id: response.id,
                    currency: 'USD',
                    quantity: 1,
                    product: response.title,
                    unit_amount: 19.99,
                    sender: aUser.id,
                    receiver: "True Tryouts",
                    sport: response.sport
                  }
                },'/EventPaymentPage');
            }
            })
            .catch(e => {
              console.error(e);
              setFormState({
                isSubmitted: false,
                message:"Event Creation Failed: "+e.message 
              })
            })
        } else {
          console.error("EventForm: UserId not detected. Coach is probably not signed in. ");
        }
      // })
      // .catch(e => {
      //   console.error("Coach is not probably not signed in",e);
      // })
  }

  const handleBackClick = () => {
    Router.back();
  }

  return (
  <>

 <div className={styles.container} align="center">
      <main1 className={styles.submain1} > 

  <Container
   //className="mt-4 mb-4"
   className="mt-4 mb-4 shadow p-3 mb-5 bg-white rounded"
   >
    <Row>
      <Col>
        <Card>
          <Card.Header
            style={{
              fontSize: "1.75rem",
              fontWeight: "500",
            }}
          >
            Event Creation
          </Card.Header>
          <Card.Body>
            <Form>
              <Stack>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Event Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Event Name / Title"
                      name="title"
                      defaultValue={eventForm.title}
                      onChange={handleEChange}
                      required
                    />
                  </Form.Group>
                </Col>
                {/* <Col>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Event Flyer</Form.Label>
                    <Form.Control 
                      controlId="eventForm.event_cover_pic"
                      type="file" 
                      onChange={handleCoverChange}
                      name="event_cover_pic"
                      defaultValue={eventForm.event_cover_pic}
                      />
                  </Form.Group>
                </Col> */}
                <Col>
                    <Col>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload Event Flyer</Form.Label>
                        <Form.Control 
                          controlId="eventForm.dp"
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
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Sport</Form.Label>
                    <Form.Select 
                      aria-label="Select the sport"
                      name="sport"
                      onChange={handleEChange}

                      required>
                      <option>Select Sport</option>
                      <option value="1">Baseball</option>
                      <option value="2">Softball</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker 
                        label="Enter Event Start Date"
                        name="event_from_date"
                        onChange={handleStartDateChange}
                        value={eventForm.event_from_date}
                        renderInput={(params) => <TextField {...params} />}
                        required
                      />
                    </LocalizationProvider>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker 
                        label="Enter Event End Date"
                        name="event_to_date"
                        onChange={handleEndDateChange}
                        value={eventForm.event_to_date}
                        renderInput={(params) => <TextField {...params} />}
                        required
                      />
                    </LocalizationProvider>
                  </Form.Group>
                </Col>
                <Col>
                  <Card>
                    <Card.Header
                      style={{
                        fontSize: "1.50rem",
                        fontWeight: "400",
                      }}
                      >
                      Tryout Age Groups Slots
                    </Card.Header>
                      {
                        slots.map((field, index) => {
                          return (
                            <>
                            {/* <p>{JSON.stringify(slots)}</p> */}
                            <SlotForm
                              slot={field} 
                              slots={slots}
                              setSlots={setSlots}
                              index={index}
                              addSlot={addSlot}
                              removeSlot={removeSlot}
                              handleEChange={handleEChange}
                              />
                              </>
                            );
                          })
                        }
                  </Card>
                </Col>
                {/* <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Select Age Range</Form.Label>
                    <Multiselect
                      options={ageRange}
                      onSelect={onSelect}
                      onRemove={onRemove}
                      displayValue="option"
                      showCheckbox
                      name="age_groups"
                    />
                  </Form.Group>
                </Col> */}
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Organization Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Organization Name"
                      name="organization"
                      defaultValue={eventForm.organization}
                      onChange={handleEChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Organization Website</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Organization Website"
                      name="organization_website"
                      defaultValue={eventForm.organization_website}
                      onChange={handleEChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Evaluation for Year</Form.Label>
                    <Form.Select 
                      aria-label="Enter Evaluation for year"
                      name="evaluation_year"
                      onChange={handleEChange}
                      value={eventForm.evaluation_year}
                      controlId="eventForm.evaluation_year"
                      >
                      <option>Select Year</option>
                      <option value={2023}>2023</option>
                      <option value={2022}>2022</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Evaluation for Season</Form.Label>
                    <Form.Select 
                      aria-label="Enter evaluation season"
                      name="evaluation_season"
                      onChange={handleEChange}
                      value={eventForm.evaluation_season}
                      controlId="eventForm.evaluation_season"
                      >
                      <option>Select Season</option>
                      <option value="1">Fall</option>
                      <option value="2">Spring</option>
                      <option value="3">Summer</option>
                      <option value="4">Winter</option>
                      <option value="5">Spring / Summer</option>
                      <option value="6">Summer / Fall</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <hr />
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Tryout Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Location Address"
                      name="address"
                      defaultValue={eventForm.address}
                      onChange={handleEChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Select 
                      aria-label="Select country"
                      controlId="eventForm.country"
                      placeholder="Enter Country"
                      value={eventForm.country}
                      name="country"
                      onChange={handleEChange}
                      required
                        >
                        { 
                          eventForm.country && eventForm.country !== null ?
                            <option 
                              value={Country.getCountryByCode(eventForm.country).isoCode}>
                              {Country.getCountryByCode(eventForm.country).name}
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
                          })
                        }
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Select 
                      aria-label="Select state"
                      controlId="eventForm.state"
                      placeholder="State"
                      value={eventForm.state}
                      name="state"
                      onChange={handleEChange}
                      required
                      >
                      { 
                        eventForm.state && eventForm.state !== null ?
                          <option 
                            value={() => {
                              let state = State.getStateByCodeAndCountry(eventForm.state,eventForm.country);
                              if(state && state!==null && state.isoCode && state.isoCode !== null) return state.isoCode; else return "";}}>
                            {() => {
                              let state = State.getStateByCodeAndCountry(eventForm.state,eventForm.country); 
                              if(state && state!==null && state.isoCode && state.isoCode !== null) return state.name; else return "Select State..."}}
                          </option>
                        :
                          <option>Select State...</option>    
                      }

                      if(eventForm.country){
                        State.getStatesOfCountry(eventForm.country)
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
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Select aria-label="Select City"
                      controlId="eventForm.city"
                      placeholder="City"
                      value={eventForm.city}
                      name="city"
                      onChange={handleEChange}
                      required  
                        >
                      { 
                        eventForm.city && eventForm.city !== null ?
                          <option 
                            value={City.getCitiesOfState(eventForm.country,eventForm.state).filter(x => x.isoCode===eventForm.city).isoCode}>
                            {City.getCitiesOfState(eventForm.country,eventForm.state).filter(x => x.isoCode===eventForm.city).name}
                          </option>
                        :
                          <option>Select City...</option>    
                      }
                      {
                        City.getCitiesOfState(eventForm.country, eventForm.state).map((value, key) => {
                          return (
                            <option value={value.isoCode} key={key}>
                              {value.name}
                            </option>
                          );
                        })
                      }
                      </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Enter Location Zip"
                      name="zip"
                      defaultValue={eventForm.zip}
                      onChange={handleEChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <hr />
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker 
                        label="Enter Checkin time"
                        name="checkin_time"
                        onChange={handleCheckInTimeChange}
                        minutesStep={5}
                        value={eventForm.checkin_time}
                        renderInput={(params) => <TextField {...params} />}
                        required
                      />
                    </LocalizationProvider> */}
                       <TryoutTimePicker
                      id="checkInTime"
                      label="Enter Checkin time" 
                      initValue={eventForm.checkin_time}
                      setValue={handleCheckInTimeChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker 
                        label="Enter Start time"
                        name="start_time"
                        onChange={handleStartTimeChange}
                        minutesStep={5}
                        renderInput={(params) => <TextField {...params} />}
                        required
                      />
                    </LocalizationProvider> */}
                       <TryoutTimePicker
                      id="starTime"
                      label="Enter Start time" 
                      initValue={eventForm.start_time}
                      setValue={handleStartTimeChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileTimePicker 
                        label="Enter Finish time"
                        name="finish_time"
                        onChange={handleFinishTimeChange}
                        minutesStep={5}
                        value={eventForm.finish_time}
                        renderInput={(params) => <TextField {...params} />}
                        required
                      />
                    </LocalizationProvider> */}
                       <TryoutTimePicker
                      id="finshTime"
                      label="Enter Finish time" 
                      initValue={eventForm.finish_time}
                      setValue={handleFinishTimeChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Point-of-contact name</Form.Label>
                    <Form.Control
                      controlId="eventForm.poc_full_name"
                      type="text"
                      placeholder="Enter Event Point-of-Contact Person Full Name"
                      name="poc_full_name"
                      defaultValue={eventForm.poc_full_name}
                      onChange={handleEChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Point-of-contact Phone</Form.Label>
                    <Form.Control
                      controlId="eventForm.poc_phone"
                      type="text"
                      placeholder="Enter Point-of-contact Mobile"
                      name="poc_phone"
                      defaultValue={eventForm.poc_phone}
                      onChange={handleEChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>Point-of-contact Email</Form.Label>
                    <Form.Control
                      controlId="eventForm.poc_email"
                      type="email"
                      placeholder="Enter Point-of-contact Email"
                      name="poc_email"
                      defaultValue={eventForm.poc_email}
                      onChange={handleEChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Per Athlete (Minimum $5 per player registration)</Form.Label>
                    <Form.Control 
                      controlId="eventForm.player_registration_price"
                      type="text" 
                      placeholder="Enter Price" 
                      onChange={handleEChange}
                      defaultValue={eventForm.player_registration_price}
                      name="player_registration_price"
                      />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Additinal Info</Form.Label>
                    <Form.Control 
                      controlId="eventForm.additional_info"
                      type="text" 
                      placeholder="Enter Info" 
                      onChange={handleEChange}
                      defaultValue={eventForm.additional_info}
                      name="additional_info"
                      />
                  </Form.Group>
                </Col>
                <Col>
                  <hr />
                </Col>
                <Row>
                  <Col className="text-center" lg={2}>
                    <Button 
                      variant="primary"
                      onClick={handleClick} 
                      >{isUpdate?"Update Event":"Register Event"}</Button>
                  </Col>
                  <Col className="text-center" lg={2}>
                    <Button 
                      variant="danger"
                      onClick={handleBackClick} 
                      >Take me back</Button>
                  </Col>
                </Row>
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

     </main1>
    </div> 
  </>  
  );
}
export default EventForm;
