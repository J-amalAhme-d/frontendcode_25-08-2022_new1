import {
    Container,
     Row,
     Col,
     Card,
     Button,
     Dropdown,
     Stack,
     Form,
     Alert,
   } from "react-bootstrap";

   import styles from '../styles/Home.module.css' 
  import { useCallback, useEffect, useReducer, useState } from "react";
  import "bootstrap/dist/css/bootstrap.min.css";
  import Router from "next/router";
  
  import APICaller from "../api/APICaller";
  import FormStateFiller from "../src/utils/FormStateFiller";
  import UserUtils from "../src/utils/UserUtils";
  
  
  //import React from 'react';
  //==================
  
  
  
  function InvitePlayerForm (props) {
  
    let initialState = {
      given_name:'',
      family_name:'',
      phone:'',
      email:''
    };
  
    
  
    const [formState, setFormState] = useState({
      ...initialState,
      isSubmitted:null,
      message:null,
      isFirstUserVisit:true
    }); 
  
    const updateState = (key,value) => {
      console.log(key, value);
      setFormState({...formState, [key]: value });
    }
  
    async function addEvaluator() {
      APICaller.apiUpsertCoach(coachForm)
        .then(r => {
          setFormState({
            isSubmitted: true,
            message: "Invite Player Profile Updated Successfully"
          })
          Router.push('/ViewProfilePage');
        })
        .catch(e => {
          setFormState({
            isSubmitted: false,
            message: "Invite Player Profile Update Failed: " + e.message
          })
        })
    }
  
    const handleBackClick = () => {
      Router.back();
    }
  
  
  
    
  
    return (

         <div className={styles.container} align="center">
     <main1 className={styles.submain1} >
       <Container className="mt-4 mb-4 shadow p-3 mb-5 bg-white rounded">
         <Row>
           <Col>
             <Card>
               <Card.Header
                 style={{
                   fontSize: "1.75rem",
                   fontWeight: "500",
                 }}
               >
                 Please enter evaluator details 
               </Card.Header>
               <Card.Body>
                 <Form>
                   <Stack>
                     <Col>
                       <Form.Group className="mb-4">
                         <Form.Label>First Name</Form.Label>
                         <Form.Control
                           controlId="playerForm.given_name"
                           type="text"
                           placeholder="Enter Given Name"
                           name="given_name"
                           defaultValue={formState.given_name}
                           onChange={(e) => updateState('given_name', e.target.value)}
                           required
                         />
                      </Form.Group>
                     </Col>
                     <Col>
                       <Form.Group className="mb-4">
                         <Form.Label>Last Name</Form.Label>
                         <Form.Control
                           controlId="playerForm.family_name"
                           type="text"
                           placeholder="Enter Last Name"
                           onChange={(e) => updateState('family_name', e.target.value)}
                           name="family_name"
                           defaultValue={formState.family_name}
                           required
                         />
                       </Form.Group>
                     </Col>
                     <Col>
                       <Form.Group className="mb-4">
                         <Form.Label>Mobile</Form.Label>
                         <Form.Control
                           controlId="playerForm.phone"
                           type="text"
                           placeholder="Enter Mobile"
                           onChange={(e) => updateState('phone', e.target.value)}
                           name="phone"
                           defaultValue={formState.phone}
                           required
                         />
                       </Form.Group>
                     </Col>
                     <Col>
                       <Form.Group className="mb-4">
                         <Form.Label>Email</Form.Label>
                         <Form.Control
                           controlId="playerForm.email"
                           type="email"
                           placeholder="Enter E-Mail"
                           onChange={(e) => updateState('email', e.target.value)}
                           name="email"
                           defaultValue={formState.email}
                           required
                         />
                       </Form.Group>
                     </Col>
                     <Row>
                     <Col className="text-center" lg={2}>
                       <Button 
                         variant="primary"
                         onClick={()=>{}} //TODO: 
                         >Submit</Button>
                     </Col>
                     <Col className="text-center" lg={2}>
                       <Button 
                         variant="danger"
                         onClick={handleBackClick} 
                         >Take me back</Button>
                     </Col>
                   </Row>
                   </Stack>
                 </Form>
               </Card.Body>
             </Card>
           </Col>
         </Row>
       </Container>

       </main1>
    </div>
  
  
     
    
         
    );
  }
  
  export default InvitePlayerForm;
  