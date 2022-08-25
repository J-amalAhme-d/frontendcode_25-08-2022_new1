import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../src/aws-exports';
import { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import styles from '../styles/Home.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Card, Container, Button, Toast } from "react-bootstrap";
import Image from 'next/image'
import UserUtils from "../src/utils/UserUtils";
import StorageUtils from "../src/utils/StorageUtils";
import CoachProfileForm from "../components/CoachProfileForm";
import Link from 'next/link';
import SignUpConfig from '../src/utils/SignUpConfig'
import { LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';


Amplify.configure(awsconfig);

function Item ({desc, srcloc, helptxt, link}) {
  return (
      <Link href={link}> 
        <Button variant="outline-primary" className="d-flex">
          <h2>{desc}</h2>
          <Image 
            src={srcloc} 
            width="70%"
            height="70%"
            alt={helptxt}
            />
        </Button>
      </Link>
  )
}


function CoachLandingPage({ user, signOut }){

  const router = useRouter();
  const [showToast, setShowToast] = useState(true);
  const [userRole, setUserRole] = useState("Coach");

  
  useEffect(() => {
    UserUtils.getUserRole(user.attributes.email) 
      .then(r => {
        if(r===userRole){
          console.log("Role is OK. ",userRole);
          
          let userR = StorageUtils.getLocalStorageObject("UserRole");
          if(!userR || userR === null || userR === ""){
            StorageUtils.setLocalStorageObject("UserRole",r);   
          }

          //Only for the coach, set the userInfo. Other roles should not be touched here.
          // let userInfo = StorageUtils.getLocalStorageObject("UserInfo");
          // if(!userInfo || userInfo === null || userInfo === ""){
          //   StorageUtils.setLocalStorageObject("UserInfo",user.attributes);   
          // }
        } else {
          console.error("Role is not OK. Why are you here? ",r);
          setUserRole(r);
        }
      })
      .catch(e => {
        console.error("User Role query failed. Be our guest!");
        setUserRole("Guest");
      })

  },[])

  return (
    <>
      <Header />
      {
        router.query && router.query.st &&
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={10000} autohide>
          <Toast.Header>
            <strong className="me-auto">Event Registration Status</strong>
            <small>Message to Coach</small>
          </Toast.Header>
          <Toast.Body>{router.query.st==='y'?"Event Added Successfully":"Event not added"}</Toast.Body>
        </Toast>
      }
      {
        userRole==="Coach"?
          <div className={styles.container} align="center">
          <main className={styles.submain0} >
          <Card>
              <Card.Header align="center" className={styles.headingfont}>Coach Actions</Card.Header> 
              <Card.Body>
                <Container>
                  <Row >
                    {/* <Col>
                      <Item 
                      desc="Update Profile" 
                        srcloc="/images/action-update.png"
                        link="/CoachProfilePage"
                        helptxt="Coach Profile Page Button"  
                        />
                    </Col>
                    <Col>
                      <Item 
                      desc="View Profile" 
                      srcloc="/images/action-view.png"
                        link="/PlayerViewProfilePage"
                        helptxt="Coach View Profile Page Button"  
                        />
                    </Col> */}
                    <Col>
                      <Item 
                        desc="Add an event" 
                        srcloc="/images/action-add.png" 
                        link="/EventPage"
                        helptxt="Coach Add Event Button"
                        />
                    </Col>
                    <Col>
                      <Item 
                        desc="View my events" 
                        srcloc="/images/event.png"
                        link="/CoachMyEventsPage"
                        helptxt="Coach My Events Page Button"  
                        />
                    </Col>
                    </Row>
                    <Row>

                    <Col>
                      <Item 
                        desc="Invite evaluator" 
                        srcloc="/images/coach.png"
                        link="/CoachInviteEvaluatorPage"
                        helptxt="Coach Invite Evaluator Page Button"  
                        />
                    </Col>
                    <Col>
                      <Item 
                        desc="Invite player" 
                        srcloc="/images/player.png"
                        link="/CoachInvitePlayerPage"
                        helptxt="Coach Invite Player Page Button"  
                        />
                    </Col>
                    </Row>
                </Container>
              </Card.Body>
              </Card>
          </main>
          </div>
          :
          userRole === "Guest"?
            <CoachProfileForm/>
            :
            <>
              <p>Issue with user role. Are you sure you reached the right place?</p>
              <LinearProgress />
            </>
      }      
    </>
  )
}

export default withAuthenticator(CoachLandingPage, SignUpConfig);