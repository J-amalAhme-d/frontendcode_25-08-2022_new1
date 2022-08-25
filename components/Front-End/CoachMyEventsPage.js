import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import styles from '../styles/Home.module.css' 

import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/shared/Header";
import EventsTable from "../components/EventsTable";
import { useState } from "react";
import SignUpConfig from '../src/utils/SignUpConfig'


function CoachMyEventsPage({ user, signOut }){
  
  const [eventRows, setEventRows] = useState([]);
  return (
    <>
      <Header />

       <div className={styles.container} align="center">
      <main1 className={styles.submain1} >

      <div style={{
          marginRight: "5%",
          marginLeft: "5%"
        }}>
        <h2>Coach Events List</h2>
        <EventsTable 
          isPlayer={false}
          isCoach={true}
          pageName={'CoachMyEventsPage'}
        />
      </div>

       </main1>
    </div> 
    </>
  );
}

export default withAuthenticator(CoachMyEventsPage, SignUpConfig);

