import 'antd/dist/antd.css'; 
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../src/aws-exports';
import { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import styles from '../styles/Home.module.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import UserUtils from "../src/utils/UserUtils";
import StorageUtils from "../src/utils/StorageUtils";
import Link from 'next/link';
import SignUpConfig from '../src/utils/SignUpConfig'
import APICaller from '../api/APICaller';
import Router, { useRouter } from 'next/router';
import { Avatar, Button, Card, Col, Row } from 'antd';
//import { Overlay } from 'antd/lib/popconfirm/PurePanel';


Amplify.configure(awsconfig);

function AvatarItem ({evalPagelink, eventId, bib, evaluationType, pName, primaryPosition, secondaryPosition, gradYear}) {

  //TODO - evaluation action needs to take us to corresponding evaluation page.

  const evalAction = () => {
    Router.push({
      pathname: evalPagelink,
      query: {
        e: eventId,
        b: bib,
        et: evaluationType,
        n: pName,
        pp: primaryPosition,
        sp: secondaryPosition,
        g: gradYear
      }
    },evalPagelink)
  }

  return (
    <Avatar 
      type="primary" 
      size={100} 
      style={{backgroundColor:'#290166'}} 
      onClick={evalAction}
      >
      {bib}
    </Avatar>
  )
}


function EvaluationsLandingPage({ user }){

  const router = useRouter();
  
  const [userRole, setUserRole] = useState("Coach");

  const [eventId, setEventId] = useState(router.query.event_id);
  const [players, setPlayers] = useState([]);
  
  useEffect(() => {
    UserUtils.getUserRole(user.attributes.email) 
      .then(r => {
        if(r===userRole){
          console.log("EvaluationsLandingPage: Role is OK. ",userRole);
          
          let userR = StorageUtils.getLocalStorageObject("UserRole");
          if(!userR || userR === null || userR === ""){
            StorageUtils.setLocalStorageObject("UserRole",r);   
          }

        } else {
          console.error("EvaluationsLandingPage: Role is not OK. Why are you here? ",r);
          setUserRole(r);
        }
      })
      .catch(e => {
        console.error("EvaluationsLandingPage: User Role query failed. Be our guest!");
        setUserRole("Guest");
      })
    
    APICaller.apiGetEventPlayers(eventId)
      .then(psRes => {
        if(psRes !== null) {
          console.log('EvaluationsLandingPage: Event players ', psRes);
          setPlayers(psRes);
        }
      })
      .catch(e => {
        console.warn('EvaluationsLandingPage: Unable to get event players: ',e);
      })

  },[])

  return (
    <>
      <Header />
      <Card title={"Evaluation for "+eventId}>
        <Card type='inner' title="Hitting">
          <Row>
          {
            players.map((player,index) => {
              return (
                <Col key={index}>
                  <AvatarItem 
                    evalPagelink='/EvaluationsPage'
                    bib={player.player_bib_id}
                    eventId={eventId}
                    evaluationType="Hitting"
                    pName={player.player.given_name+" "+player.player.family_name}
                    gradYear={player.player.graduation_year}
                    primaryPosition={player.player.profiles.items[0].playerSportProfile.primary_position}
                    secondaryPosition={player.player.profiles.items[0].playerSportProfile.secondary_position}
                    />
                </Col>
              )
            })
          }
          </Row>
        </Card>
      </Card>

      
    </>
  )
}

export default withAuthenticator(EvaluationsLandingPage, SignUpConfig);