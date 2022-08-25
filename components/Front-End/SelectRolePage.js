import styles from '../styles/Home.module.css'
import BrowserTabHead from '../components/shared/BrowserTabHead'
import Header from '../components/shared/Header'
import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import UserUtils from '../src/utils/UserUtils';
import Router from 'next/router';
import { useEffect } from 'react';


function Item ({desc, srcloc, helptxt, link}) {
  return (
      <a href={link}> 
        <Button variant="outline-primary">
          <h2>{desc}</h2>
          <Image 
            src={srcloc} 
            width="100%"
            height="100%"
            alt={helptxt}
            />
        </Button>
      </a>
  )
}

export default function SelectRole() {

  useEffect(() => {
    UserUtils.getAuthenticatedUser()
      .then(u => {
        if(u && u !== null) {
          UserUtils.getUserRole(u.email)
            .then(r => {
              console.log("Select Role Page:",r);
              if(r==="Player" || r==="Parent"){
                Router.push('/PlayerLandingPage');
              }
              if(r==="Coach"){
                Router.push('/CoachLandingPage');
              }
            })
        }
      })
  
  }, [])
  
  
  return (
    <div>
      <BrowserTabHead />
      <div>
        <Header />
      </div>
      <div className={styles.container} align="center">
        <main className={styles.submain0} >
          <div>
            <Card>
            <Card.Header align="center" className={styles.headingfont}>Are you?</Card.Header> 
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <Item 
                      desc="A Player" 
                      srcloc="/images/player.png"
                      link="/PlayerLandingPage"
                      helptxt="Player Role Select Button"  
                      />
                  </Col>
                  <Col>
                    <Item 
                      desc="A Coach" 
                      srcloc="/images/coach.png" 
                      link="/CoachLandingPage"
                      helptxt="Coach Role Select Button"
                      />
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
