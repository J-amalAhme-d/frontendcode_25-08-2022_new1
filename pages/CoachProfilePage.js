import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import CoachProfileForm from "../components/CoachProfileForm"
import Header from "../components/shared/Header";
import SignUpConfig from '../src/utils/SignUpConfig'

function CoachProfile(){
  
  return (
    <>
      <Header />
      <CoachProfileForm />
    </>
  )

}

export default withAuthenticator(CoachProfile, SignUpConfig);