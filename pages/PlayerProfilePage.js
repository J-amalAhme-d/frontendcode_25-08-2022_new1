import { Amplify } from 'aws-amplify';

import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../src/aws-exports';
Amplify.configure(awsconfig);

import PlayerProfileForm from '../components/PlayerProfileForm'
import Header from '../components/shared/Header';
import SignUpConfig from '../src/utils/SignUpConfig';

function PlayerProfilePage(){

  return (
    <>
      <Header />
      <PlayerProfileForm />
    </>
  )
}



export default withAuthenticator(PlayerProfilePage, SignUpConfig);