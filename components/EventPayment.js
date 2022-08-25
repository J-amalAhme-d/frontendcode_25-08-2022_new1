import { Container, Stack } from 'react-bootstrap';
import StripeCheckout from 'react-stripe-checkout'
// import { API } from 'aws-amplify'

const EventPayment = ({eventInfo}) => {
  
  const stripeConfig = {
    stripe_public_key: 'pk_test_51L0z6eSAyVF7knqYWLzlKenIeUT6LigiNQPYL3q721gIzZDrfEikUbG6T23X3xyliPeVzorz6ev9JZp6DR9Pzsyt00ku8wm1Lx',
  }

  const handlePayment = async token => {

    // try {
    //   const result = await API.post('paymentlambda','/payments',{
    //     body: {
    //       token
    //     }
    //   })
      console.log("Payment confirmation: "+ JSON.stringify(token));
    // } catch (err){
    //   console.error("Error processing payment", error);
    // }
  }

  return (
    <>
      {/* <p>{JSON.stringify(eventInfo)}</p> */}
      <Container align="center">
        <Stack>
          <StripeCheckout 
            token={handlePayment}
            name={eventInfo.title}
            amount={eventInfo.event_registration_price}
            currency={eventInfo.event_registration_price_units}
            stripeKey={stripeConfig.stripe_public_key}
            locale='auto'
            allowRememberMe={false}
            />
        </Stack>
      </Container>
    </>
  );
};

export default EventPayment;
