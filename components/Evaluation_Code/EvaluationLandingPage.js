import React from "react";
import "./EvaluationLandingPage.css";
import styles from '../styles/Home.module.css' 


function EvalLandingForm (props) {

    const handleBackClick = () => {
        //Router.back();
        Router.push('/EvaluationHittingForm');
      }

async  function Circle() {
  function Button() {
    alert("hello");
  }}
  return (
    <>
    <div className={styles.container} align="center">
      <main1 className={styles.submain1} >
      <div className="main">
        <div className="parent">
          <button className="circle" 
          //onClick={() => alert("hello")}
          onClick={handleBackClick} 
          >

            <p className="text">Hit</p>
          </button>
          <button className="circle">
            <p className="text">Pitch</p>
          </button>
        </div>
        <div className="parent1">
          <button className="circle">
            <p className="text">Catch</p>
          </button>
          <button className="circle">
            <p className="text">INF</p>
          </button>
        </div>
        <div className="parent2">
          <button className="circle">
            <p className="text">Run</p>
          </button>
          <button className="circle">
            <p className="text">Of</p>
          </button>
        </div>
      </div>

      </main1>
    </div>
    
    </>
  );
}

export default EvalLandingForm;
