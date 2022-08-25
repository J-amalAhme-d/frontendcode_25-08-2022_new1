import { withAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/router";
import PaymentNew from "../components/PaymentNew";
import SignUpConfig from '../src/utils/SignUpConfig'

function EventPaymentPage(props) {
  
  const router = useRouter();

  return (
    <>
      <PaymentNew 
        currency={router.query.currency}
        quantity={router.query.quantity} 
        product={router.query.product}
        unit_amount={router.query.unit_amount}
        event_id={router.query.event_id}
        type={router.query.type}
        sender={router.query.sender}
        receiver={router.query.receiver}
        product_id={router.query.product_id}
        sport={router.query.sport}
        />
    </>
  )
  


};




export default withAuthenticator(EventPaymentPage, SignUpConfig);
