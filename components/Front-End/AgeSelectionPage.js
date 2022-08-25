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
      <a href={link}
      color="grey"
      > 
        <Button variant="outline-primary"
        className="shadow-lg p-3 mb-5 "
        
        >
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

export default function AgeSelectionPage() {


  
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
                      desc="Player Above 18" 
                      srcloc="/images/player.png"
                      link="/PlayerLandingPage"
                      helptxt="Player Role Select Button"  
                      />
                  </Col>
                  <Col>
                    <Item 
                      desc="Player Below 18" 
                      srcloc="/images/player.png"
                      link="/PlayerLandingPage"
                      helptxt="Player Role Select Button"  
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
