require("dotenv").config();
const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(process.env.secret_key); // https://stripe.com/docs/keys#obtain-api-keys
app.use(express.static("."));
app.use(express.json());
// An endpoint for your checkout 
app.post("/checkout", async (req, res) => {
    // Create or retrieve the Stripe Customer object associated with your user.
    let customer = await stripe.customers.create(); // This example just creates a new Customer every time

    // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2020-08-27' },
    );
    // Create a PaymentIntent with the payment amount, currency, and customer
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.price,
        currency: 'eur',
        customer: customer.id,
        payment_method_types: ['card'],
    });
    // Send the object keys to the client
    res.send({
        publishableKey: process.env.publishable_key, // https://stripe.com/docs/keys#obtain-api-keys
        paymentIntent: paymentIntent.client_secret,
        customer: customer.id,
        ephemeralKey: ephemeralKey.secret
    });
});

app.listen(process.env.PORT, () =>
    console.log(`Node server listening on port ${process.env.PORT}!`)
);