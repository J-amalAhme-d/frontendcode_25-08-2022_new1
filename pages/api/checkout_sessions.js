import APICaller from '../../api/APICaller';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  let successUrl = req.body.type==1? (req.headers.origin+'/CoachLandingPage?st=y&p='+req.body.product_id): (req.body.type==2?(req.headers.origin+'/PlayerLandingPage?st=y&p='+req.body.product_id):(req.headers.origin+'/?st=y'));
  let cancelUrl = req.body.type==1? (req.headers.origin+'/CoachLandingPage?st=n'): (req.body.type==2?(req.headers.origin+'/PlayerLandingPage?st=n'):(req.headers.origin+'/?st=n'));


  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: req.body.quantity,
            name: req.body.product,
            amount: req.body.unit_amount*100,
            currency: req.body.currency,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      APICaller.apiAddPayment({
          status: 'initiated',
          type: parseInt(req.body.type),
          amount: parseInt(req.body.unit_amount),
          amount_units: req.body.currency,
          sender: req.body.sender,
          receiver: req.body.receiver,
          product: req.body.product,
          product_id: req.body.product_id,
          sport: req.body.sport
        })
        .then(r => console.log("Payment Initiation Recorded"))
        .catch(e => console.error("Payment Initiation Failed",e))
      // console.log("Session", session);
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
      
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}