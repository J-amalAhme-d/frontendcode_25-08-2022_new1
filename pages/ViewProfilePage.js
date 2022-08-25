import "bootstrap/dist/css/bootstrap.min.css";
import  {useEffect, useState} from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import UserUtils from "../src/utils/UserUtils";
import ViewPlayerProfile from "../components/ViewPlayerProfile.js";

import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import Header from "../components/shared/Header";
import ViewCoachProfile from "../components/ViewCoachProfile";
Amplify.configure(awsconfig);

import NProgress from 'nprogress'
import { LinearProgress } from "@mui/material";
import Router from "next/router";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import SignUpConfig from '../src/utils/SignUpConfig'
import APICaller from "../api/APICaller";
// import "../styles/nprogress.css"

const ViewProfilePage = ({user}) => {

    const [role, setRole] = useState(null);

    useEffect(() => {
      NProgress.start();
      UserUtils.getAuthenticatedUser()
        .then(u => {
          UserUtils.getUserRole(u.email)
            .then(r => {
              setRole(r);
              NProgress.done();
            })
        })
        .catch(e => {
          NProgress.done();
        })
    }, [])

    return (
      <>
        <Header />
        <Card>
        {  
          role === "Player" || role === "Parent"?
          <ViewPlayerProfile email={user.attributes.email} />
          :
          role === "Coach"?
            <ViewCoachProfile email={user.attributes.email} />
            :
            <>
              <p>We can&apos;t find your profile! How bad! Build a profile with us now.</p>
              <LinearProgress />
            </>
        }
        </Card>
      </>
    )
    
}

export default withAuthenticator(ViewProfilePage, SignUpConfig);



