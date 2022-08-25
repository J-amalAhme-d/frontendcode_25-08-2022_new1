import { Row, Col, Avatar } from "antd";
import { useEffect, useState } from "react";
import APICaller from "../api/APICaller";

function PlayerEvaluationFormHeader(props){

  const {
    plyer,
    player_id,
    player_bib_id,
    event_id,
    player_name,
    primary_position,
    secondary_position,
    graduation_year
  } = props;

  const [player, setPlayer] = useState(plyer);

  useEffect(() => {
    APICaller.apiGetPlayerById(player_id)
      .then(pR => {
        setPlayer(pR);
      })
  }, [])
  

  return(
    <>
      <Row>
        <Col>
          <Avatar 
            type="primary" 
            size={50} 
            style={{backgroundColor:'#290166'}} 
            >
            {player_bib_id}
          </Avatar>
        </Col>
        <Col>
          <Row>{player_name}</Row>
          <Row>
            {graduation_year} - {primary_position} / {secondary_position}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default PlayerEvaluationFormHeader;