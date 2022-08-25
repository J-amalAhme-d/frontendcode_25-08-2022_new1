import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

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
      <div style={{
          marginRight: "5%",
          marginLeft: "5%"
        }}>
        <h2>Coach Events List</h2>
        <EventsTable isSupportEdit={true} isSupportRegister={false}/>
      </div>
    </>
  );
}

export default withAuthenticator(CoachMyEventsPage, SignUpConfig);

