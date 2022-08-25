import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../src/aws-exports';
import { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import styles from '../styles/Home.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Card, Container, Button, Toast } from "react-bootstrap";
import Image from 'next/image';
import SignUpConfig from '../src/utils/SignUpConfig';
import UserUtils from '../src/utils/UserUtils';
import PlayerProfileForm from "../components/PlayerProfileForm";
import StorageUtils from '../src/utils/StorageUtils'
import Link from 'next/link';
import { LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';

Amplify.configure(awsconfig);

function Item ({desc, srcloc, helptxt, link}) {
  return (
      <Link href={link}> 
        <Button variant="outline-primary">
          <h2>{desc}</h2>
          <Image 
            src={srcloc} 
            width="60%"
            height="60%"
            alt={helptxt}
            />
        </Button>
      </Link>
  )
}


function PlayerLandingPage({ user }){
  
  const router = useRouter();

  const [userRole, setUserRole] = useState("Guest");
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    UserUtils.getUserRole(user.attributes.email) 
      .then(r => {
        if(r === "Player" || r === "Parent"){
          console.log("Role is OK. ",r);
          //Only for the player and parent, set the user role on localStorage. Other roles should not be touched here.
          storeUserRole(r);
        } else {
          console.error("Role is not OK. Why are you here? ",r);
          storeUserRole(r);
        }
      })
      .catch(e => {
        console.error("Unable to fetch user role. Be our guest then: ",e);
        storeUserRole("Guest");
      })
    
    const storeUserRole = (tRole) => {
      let userR = StorageUtils.getLocalStorageObject("UserRole");
      if(!userR || userR === null || userR === ""){
        StorageUtils.setLocalStorageObject("UserRole",tRole);   
        setUserRole(tRole);
      } else {
        if(userR !== tRole){
          StorageUtils.setLocalStorageObject("UserRole",tRole);   
          setUserRole(tRole);
        }
      }
    }
  },[]);

  return (
    <>
      <Header />
      {
        router.query && router.query.st &&
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={10000} autohide>
          <Toast.Header>
            <strong className="me-auto">Player Registration Status</strong>
            <small>Message to Player</small>
          </Toast.Header>
          <Toast.Body>{router.query.st==='y'?"Player registered for the event successfully":"Player not registered for the event"}</Toast.Body>
        </Toast>
      }
      {
        userRole === "Guest" && 
        <PlayerProfileForm />
      }
      {
        (userRole === "Player" || userRole === "Parent") &&
        <div className={styles.container} align="center">
          <main className={styles.submain0}>
          <Card>
              <Card.Header align="center" className={styles.headingfont}>Player Actions</Card.Header> 
              <Card.Body>
                <Container>
                  <Row>
                    <Col>
                      <Item 
                        desc="Look for events" 
                        srcloc="/images/action-search.png" 
                        link="/EventSearchPage"
                        helptxt="Event Search Page Button"
                        />
                    </Col>
                    <Col>
                      <Item 
                        desc="View my events" 
                        srcloc="/images/event.png"
                        link="/PlayerMyEventsPage"
                        helptxt="Player My Events Page Button"  
                        />
                    </Col>
                    </Row>
                </Container>
              </Card.Body>
              </Card>
          </main>
        </div>
      }
      { 
        userRole === "Coach" &&
        <>
          <p>Issue with user role. Are you sure you reached the right place?</p>
          <p>{userRole}</p>
          <LinearProgress />
        </>
      }
    </>
  )
}

export default withAuthenticator(PlayerLandingPage, SignUpConfig);