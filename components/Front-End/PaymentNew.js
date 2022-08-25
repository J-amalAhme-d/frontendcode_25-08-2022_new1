import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Header from './shared/Header';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import Router, { withRouter } from 'next/router';
import { Stack } from '@mui/material';
import "bootstrap/dist/css/bootstrap.min.css";


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function PaymentNew(props) {
  const {
    currency,
    product,
    unit_amount,
    quantity,
    event_id,
    type,
    sender,
    receiver,
    product_id,
    sport
  } = props;

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled.');
    }
  }, []);

  const handleGoBackClick = () => {
    //TODO - Clear event local storage? Let's keep it to do something.
    if(type===1){
      Router.push({pathname:'/EventPage'});
    }
    if(type===2){
      //TODO - Event list page. Make sure this is right. 
      Router.push({pathname:'/EventSearchPage'});
    }
  } 

  return (
    <>
      <Header />
      <div>
        <form action="/api/checkout_sessions" method="POST">
          <input type="hidden" name="currency" value={currency} />
          <input type="hidden" name="product" value={product} />
          <input type="hidden" name="unit_amount" value={unit_amount} />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="sender" value={sender} />
          <input type="hidden" name="receiver" value={receiver} />
          <input type="hidden" name="product_id" value={product_id} />
          <input type="hidden" name="sport" value={sport} />
          
          <Card alignItems="center">
            <Stack alignItems="center">
            <Card.Header
              style={{
                fontSize: "1.50rem",
                fontWeight: "400",
              }}
              >
              Confirm Payment
              </Card.Header>
              {
                type==1? 
                  <Card.Body>
                    <p>You are registering event <strong>{product}</strong>.</p>
                    <p>Your reference id is <strong>{product_id}</strong></p>
                    <p>True Tryouts is going to charge you <strong>{unit_amount/100} {currency}</strong></p>
                    <p>Do you want to confirm and proceed with the payment?</p>
                    <div width="100%">
                      <div alignItems="center">
                        <span>
                          <span style={{margin:5}}>
                            <Button type="submit" role="link" variant="primary">
                              Pay with Stripe now!
                            </Button>
                          </span>
                          <span style={{margin:5}}>
                            <Button variant="danger" onClick={handleGoBackClick}>
                                Go back!
                              </Button>
                          </span>
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                  : 
                  type==2?
                    <Card.Body>
                      <p>You are registering for the True Tryouts event <strong>{product}</strong>.</p>
                      <p>Your reference id is <strong>{product_id}</strong></p>
                      <p>True Tryouts is going to charge you <strong>{unit_amount} {currency}</strong></p>
                      <p>Do you want to confirm and proceed with the payment?</p>
                      <div width="100%">
                        <div alignItems="center">
                          <span>
                            <span style={{margin:5}}>
                              <Button type="submit" role="link" variant="primary">
                                Pay with Stripe now!
                              </Button>
                            </span>
                            <span style={{margin:5}}>
                              <Button variant="danger" onClick={handleGoBackClick}>
                                  Go back!
                                </Button>
                            </span>
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                    :
                    <p>Payment Error. Unable to show the right kind of payment for your transaction.</p>
                  }
            </Stack>
          </Card>
          <style jsx>
            {`
              section {
                background: #ffffff;
                display: flex;
                flex-direction: column;
                width: 400px;
                height: 112px;
                border-radius: 6px;
                justify-content: space-between;
              }
              button {
                height: 36px;
                background: #556cd6;
                border-radius: 4px;
                color: white;
                border: 0;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
              }
              button:hover {
                opacity: 0.8;
              }
              `}
          </style>
        </form>
      </div>
    </>
  );
}

export default withRouter(PaymentNew);