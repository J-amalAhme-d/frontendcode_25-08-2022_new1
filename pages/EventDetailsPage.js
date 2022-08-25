import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/shared/Header";
import APICaller from "../api/APICaller";
import { useEffect, useState } from "react";
import UserUtils from "../src/utils/UserUtils";
import Router, { useRouter } from 'next/router';
import { Button, Col, Container, Row } from "react-bootstrap";
import SignUpConfig from '../src/utils/SignUpConfig'

function EventDetailsPage({ user, signOut }){
  
  const [eventDetails, setEventDetails] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if(router?.query?.event_id){
      UserUtils.getAuthenticatedUser() 
      .then(aUser => {
        console.log(aUser);
        APICaller.apiGetEvent(router.query.event_id)
          .then((response) => {
            console.log("eventDetails",response);
            setEventDetails(response);
          })
          .catch(e => {
            console.error(e);
          })
      })
      .catch(e => {
        console.error("Coach is not probably not signed in",e);
      })
    }
  }, [])
  
  const handleBackClick = () => {
    Router.back();
  }

  return (
    <>
    <Header />
    <div style={{
        marginRight: "5%",
        marginLeft: "5%"
      }}>
      <h2>Event Details:{eventDetails.title}</h2>
      <br></br>
      <Container>
        <Row>
          <Col>Event Name:</Col>
          <Col>{eventDetails.title}</Col>
        </Row>
        <Row>
          <Col>Sport:</Col>
          <Col>{eventDetails.sport == 1? 'Baseball':'Softball'}</Col>
        </Row>
        <Row>
          <Col>Event Start Date:</Col>
          <Col>{eventDetails.event_from_date}</Col>
        </Row>  
        <Row>
          <Col>Event End Date:</Col>
          <Col>{eventDetails.event_to_date}</Col>
        </Row>  
        <Row>
          <Col>Organization Name:</Col>
          <Col>{eventDetails.organization}</Col>
        </Row>  
        <Row>
          <Col>Organization Website:</Col>
          <Col>{eventDetails.organization_website}</Col>
        </Row>  
        <Row>
          <Col>Evaluation for Year:</Col>
          <Col>{eventDetails.evaluation_year}</Col>
        </Row>  
        <Row>
          <Col>Evaluation for Season:</Col>
          <Col>{eventDetails.evaluation_season}</Col>
        </Row>  
        <Row>
          <Col>Tryout Address:</Col>
          <Col>{eventDetails.address}</Col>
        </Row>  
        <Row>
          <Col>Country:</Col>
          <Col>{eventDetails.country}</Col>
        </Row>
        <Row>
          <Col>State:</Col>
          <Col>{eventDetails.state}</Col>
        </Row>
        <Row>
          <Col>City:</Col>
          <Col>{eventDetails.city}</Col>
        </Row>  
        <Row>
          <Col>Location Zip:</Col>
          <Col>{eventDetails.zip}</Col>
        </Row>  
        <Row>
          <Col>Checkin time:</Col>
          <Col>{eventDetails.checkin_time}</Col>
        </Row>  
        <Row>
          <Col>Start time:</Col>
          <Col>{eventDetails.start_time}</Col>
        </Row>
        <Row>
          <Col>Finish time:</Col>
          <Col>{eventDetails.finish_time}</Col>
        </Row>
        <Row>
          <Col>Point-of-contact name:</Col>
          <Col>{eventDetails.poc_full_name}</Col>
        </Row>
        <Row>
          <Col>Point-of-contact Phone:</Col>
          <Col>{eventDetails.poc_phone}</Col>
        </Row>  
        <Row>
          <Col>Point-of-contact Email:</Col>
          <Col>{eventDetails.poc_email}</Col>
        </Row>
        <Row>
          <Col>Price Per Athlete (Minimum $5 per player registration):</Col>
          <Col>{eventDetails.player_registration_price}</Col>
        </Row>
        <Row>
          <Col>Additinal Info:</Col>
          <Col>{eventDetails.additional_info}</Col>
        </Row>
        <Row>
        <Button 
            variant="danger"
            onClick={handleBackClick}>
            Take me back
          </Button>
        </Row>
      </Container>
    </div>
    </>
  );
}

export default withAuthenticator(EventDetailsPage, SignUpConfig);


/*
additional_info: "1"
address: "hello"
age_groups_slots: [{…}]
checkin_time: "10:34"
city: "Bengaluru"
coach: null
coachEventsId: "5fc2ea16-3cbd-4fe7-ae6a-4eab3015f800"
country: "IN"
createdAt: "2022-06-30T04:04:40.522Z"
evaluation_season: "1"
evaluation_year: 2022
evaluators: {items: Array(0), nextToken: null}
event_cover_pic: null
event_from_date: "06/30/2022"
event_registration_price: 1999
event_registration_price_units: "USD"
event_to_date: "06/30/2022"
finish_time: "11:36"
id: "002ab966-b7b4-4a4c-9aaa-444f0f1879f8"
organization: "praveen"
organization_website: "https://praveen.com/"
player_registration_price: 500
player_registration_price_units: "USD"
players: {items: Array(0), nextToken: null}
poc_email: "praveen@gmail.com"
poc_full_name: "praveen"
poc_phone: "8105566721"
sport: "1"
start_time: "10:35"
state: "KA"
title: "Event 2"
type: null
updatedAt: "2022-06-30T04:04:40.522Z"
zip: "56002"
*/