//import { Button, Col, Form, Input, Layout, PageHeader, Rate, Row, Slider } from "antd";
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
   PageHeader
 } from "react-bootstrap";
import Router from "next/router";
import { useEffect, useState } from "react";
import APICaller from "../api/APICaller";
import PlayerEvaluationFormHeader from "./PlayerEvaluationFormHeader";

import styles from '../styles/Home.module.css' 
//import {BorderOutlined} from '@ant-design/icons'

function EvaluationHittingForm (props) {

  const {
    event,
    player_bib_id,
    player_name,
    primary_position,
    secondary_position,
    graduation_year
  } = props;

  // const [eHForm] = Form.useForm();
  // const [player, setPlayer] = useState(null);

  
  
  useEffect(() => {
    APICaller.apiGetPlayerEvaluations(event, player_bib_id)
      .then(gpeR => {
        if(gpeR !== null && gpeR.length > 0){
          setPlayer(gpeR[0].registration.player);
        }
      })
  },[])

  const handleFormFilled = (formValues) => {
    console.log("Form Values:", formValues);
    addHittingEvaluation(formValues);
  }

  const addHittingEvaluation = (evaluationForm) => {
    APICaller.apiUpsertPlayerEvaluation(event, player_bib_id,"H",evaluationForm)
      .then(aupeR => {
        console.log("Added evaluation", aupeR);
      })
  }

  const handleBackClick = () => {
    Router.back();
  }

  return(

    <div className={styles.container} align="center">
      <main1 className={styles.submain1} >
          <div>

    <Container className="mt-4 mb-4 shadow p-3 mb-5 bg-white rounded ">
    <Row>
      <Col>
        <Card>
          <Card.Header
            style={{
              fontSize: "1.75rem",
              fontWeight: "500",
            }}
          >
            InField Evaluation
          </Card.Header>
          <Card.Body>
            <Form>
              <Stack>
                <Col>
                  <Form.Group className="mb-4">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      controlId="coachForm.given_name"
                      type="text"
                      placeholder="Enter Given Name"
                      name="given_name"
                      defaultValue={formState.given_name}
                      onChange={(e) => updateState('given_name', e.target.value)}
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

</div>
</main1>
</div>
  )
}

export default EvaluationHittingForm;