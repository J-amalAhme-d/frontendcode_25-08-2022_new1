import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import Header from "../components/shared/Header";
import EventForm from "../components/EventForm";
import SignUpConfig from '../src/utils/SignUpConfig'

function EventPage(){
  
  return (
    <>
      <Header />
      <EventForm />
    </>
  )
}

export default withAuthenticator(EventPage, SignUpConfig);