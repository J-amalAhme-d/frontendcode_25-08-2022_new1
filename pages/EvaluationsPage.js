import 'antd/dist/antd.css';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../src/aws-exports';
import SignUpConfig from '../src/utils/SignUpConfig'
import Header from "../components/shared/Header";
import styles from '../styles/Home.module.css'
import "bootstrap/dist/css/bootstrap.min.css";

import { useRouter } from 'next/router';
import EvaluationHittingForm from '../components/EvaluationHittingForm';

function EvaluationsPage({ user }){

  const router = useRouter();
  
  return(
    <>
      <Header />
      {
        router.query.et === "Hitting" && 
        <EvaluationHittingForm 
          event={router.query.e}
          player_bib_id={router.query.b}
          player_name={router.query.n}
          primary_position={router.query.pp}
          secondary_position={router.query.sp}
          graduation_year={router.query.g}
          />
      }
    </>
  )

}

export default withAuthenticator(EvaluationsPage, SignUpConfig);
