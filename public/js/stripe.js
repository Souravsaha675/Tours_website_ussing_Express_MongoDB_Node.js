/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HUHeODeVDBQ4PVokHSh6SAXojmfWT428jJ4mXTwB1CqhUPZCmz1YiVw4bFe9eXOlbQ5Iv2l9DVbNy2TQtqk2YmI000gqdJ1Wu'
);

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
