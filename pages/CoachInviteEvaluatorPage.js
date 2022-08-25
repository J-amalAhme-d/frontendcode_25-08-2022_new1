import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/shared/Header";
import { useState } from "react";
import SignUpConfig from '../src/utils/SignUpConfig'
import CoachEvaluatorForm from '../components/CoachEvaluatorForm';


function CoachInviteEvaluatorPage({ user, signOut }){
  
  const [evaluatorForm, setEvaluatorForm] = useState([]);
  return (
    <>
      <Header />
      <div style={{
          marginRight: "5%",
          marginLeft: "5%"
        }}>
        <h2>Invite Evaluator Page</h2>
       <CoachEvaluatorForm />
      </div>
    </>
  );
}

export default withAuthenticator(CoachInviteEvaluatorPage, SignUpConfig);

