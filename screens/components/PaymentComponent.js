import React, { useState, useEffect } from "react";
import { StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import {
  CardField,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';
import axios from "axios";
import { basketServices } from "../../_services/basketServices";

export default PaymentScreen = (props) => {
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const { confirmPayment, handleCardAction } = useStripe()
  const API_URL = "http://stripe-apire.uqkx1528.odns.fr";
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: props.total * 100
      })

    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Merchant Name',
    });
    if (!error) {
      setLoading(true);
    }
  };
  const setPaidStatus = async () => {
    var handleToUpdate = props.handleToUpdate;

    axios.post('https://app-benj.com/api/command/' + props.idCommand + '/paiement', {
      id: "Benjamin"
    }).then(response => {
      console.log(response);
      Alert.alert("Votre commande à bien été effectué");
      basketServices.delBasket();
      handleToUpdate(undefined)
      props.navigation.navigate('Commerces')

    }).catch(error => {
      axios.post('https://app-benj.com/api/command/delete/' + props.idCommand).then(data => {
        console.log(data);
      })
    })
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet({ clientSecret: "sk_test_51KDuErCLeLtq3NkeDRRr7rqfW7gRc8mhxz43H2aoZgueZBhpSCmMbmJebFxz8RP2ftCMfrw1jON21pdWGYBfG5sj00qMZdaKBt" });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setPaidStatus()
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);
  const styles = StyleSheet.create({
    buttonPaiement: {
      backgroundColor: loading ? 'black' : 'gray',
      marginLeft: 10,
      color: 'red',
      marginTop: 20
    },
  })

  return (
    <Button style={styles.buttonPaiement} disabled={!loading} onPress={openPaymentSheet}>
      <Text style={{ color: 'white', fontWeight: "200" }}>Procéder au paiement </Text>
    </Button>
  )
}
