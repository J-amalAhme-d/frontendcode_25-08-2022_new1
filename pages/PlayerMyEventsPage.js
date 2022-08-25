import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import styles from '../styles/Home.module.css' 

import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/shared/Header";
import EventsTable from "../components/EventsTable";
import APICaller from "../api/APICaller";
import { useEffect, useState } from "react";
import UserUtils from "../src/utils/UserUtils";
import SignUpConfig from '../src/utils/SignUpConfig'

function PlayerMyEventsPage({ user, signOut }){
  
  // const [eventRows, setEventRows] = useState([]);
  // useEffect(() => {
  //   UserUtils.getAuthenticatedUser() 
  //     .then(aUser => {
  //       console.log(aUser);
  //       APICaller.apiGetPlayerEvents(user.attributes.email)
  //         .then((response) => {
  //           console.log("events",response);
  //           setEventRows(response);
  //         })
  //         .catch(e => {
  //           console.error(e);
  //         })
  //     })
  //     .catch(e => {
  //       console.error("Coach is not probably not signed in",e);
  //     })
  // }, [])
  
  return (
    <>
    <Header />
     <div className={styles.container} align="center">
      <main1 className={styles.submain1} > 

    <div style={{
        marginRight: "5%",
        marginLeft: "5%"
      }}>
      <h2>Player Events List</h2>
      <EventsTable 
        isPlayer={true} 
        isCoach={false}
        pageName={"PlayerMyEventsPage"}/>
    </div>

     </main1>
    </div> 

    </>
  );
}

export default withAuthenticator(PlayerMyEventsPage, SignUpConfig);

