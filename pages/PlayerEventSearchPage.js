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

function PlayerEventSearchPage(){
  
  return (
    <>
      <Header />
       <div className={styles.container} align="center">
      <main1 className={styles.submain1} > 

      <div style={{
          marginRight: "5%",
          marginLeft: "5%"
        }}>
        <h2>Events List</h2>
        <EventsTable 
          isPlayer={true}
          isCoach={false}
          pageName={'PlayerEventSearchPage'}
          />
      </div>

       </main1>
    </div> 
    </>
  );
}

export default withAuthenticator(PlayerEventSearchPage, SignUpConfig);

