import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import _ from 'lodash';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Item from './components/ItemProduct'
import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from "./components/PaymentComponent";
import { basketServices } from '../_services/basketServices';

export default class BasketScreen extends React.Component {

  constructor(props) {
    super(props);
    var handleToUpdate = this.handleToUpdate.bind(this);
    this.state = {
      basket: [],
      total: 0,
      modalCommand: false,
      modalPaiement: false,
      publishableKey: 'pk_test_51KDuErCLeLtq3NkeHRRPq1lxIr4LtN6qs9fOXlSd0Q6a612MStQri7SsUwxC88U3LqkhTJjo5IsjJe46VHDmmvhb007euCXqNc',
      source: null,
      livraisonIsFacturation: true,
      commande: {
        livraison: {
          name: '',
          pays: '',
          ville: '',
          address: '',
          postal_code: '',
        },
        facturation: {
          name: '',
          pays: '',
          ville: '',
          address: '',
          postal_code: '',
        }
      },
      idCommande: 0
    };
  }

  calculTotal = async (basket) => {
    let allPrice = [];

    if (basket.length > 0) {
      await basket.forEach(product => {
        let price = product.price * product.quantite;
        allPrice.push(price);
      })
    }

    const initialValue = 0;
    const sumWithInitial = allPrice.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      initialValue
    );
    this.setState({
      total: sumWithInitial
    })
  }

  handleToUpdate = async (product = undefined) => {
    const _basket = this.state.basket;
    if (product != undefined) {
      alert('Le produit ' + product.name + ' a été supprimé');

      const index = this.state.basket.indexOf(product);
      this.state.basket.splice(index, 1);
      this.setState({ basket: _basket })

    } else if (product == undefined) {
      this.setState({ basket: [] })
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.getBasket();
    })
  }

  getBasket = async () => {
    const getBasketStorage = await AsyncStorage.getItem('currentBasket');
    let basket = JSON.parse(getBasketStorage);
    for (const product in basket) {
      let id = basket[product].id;
      if (this.state.basket.some(product => product.id == id)) {
      } else {
        let joined = this.state.basket.concat(basket[product])
        this.setState({
          basket: joined
        })


      };
    }

    this.calculTotal(this.state.basket);
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => {
    var handleToUpdate = this.handleToUpdate;
    return (
      <Item product={item} handleToUpdate={handleToUpdate.bind(this)} />
    )
  }

  updateName = (text, addressType) => {
    let command = this.state.commande
    if (addressType == 'livraison') {
      command.livraison.name = text;
    } else if (addressType == 'facturation') {
      command.facturation.name = text;
    }
    this.setState({
      command: command
    })
  }
  updateAddress = (text, addressType) => {
    let command = this.state.commande
    if (addressType == 'livraison') {
      command.livraison.address = text;
    } else if (addressType == 'facturation') {
      command.facturation.address = text;
    }
    this.setState({
      command: command
    })
  }
  updatePays = (text, addressType) => {
    let command = this.state.commande
    if (addressType == 'livraison') {
      command.livraison.pays = text;

    } else if (addressType == 'facturation') {
      command.facturation.pays = text;

    }
    this.setState({
      command: command
    })
  }

  updatePostalCode = (text, addressType) => {
    let command = this.state.commande
    if (addressType == 'livraison') {
      command.livraison.postal_code = text;

    } else if (addressType == 'facturation') {
      command.facturation.postal_code = text;
    }
    this.setState({
      command: command
    })
  }
  updateCity = (text, addressType) => {
    let command = this.state.commande
    if (addressType == 'livraison') {
      command.livraison.ville = text;

    } else if (addressType == 'facturation') {
      command.facturation.ville = text;
    }
    this.setState({
      command: command
    })
  }

  passCommand = () => {
    this.setState({
      modalCommand: true
    })
  }

  updateCheckbox = (bool) => {
    this.setState({
      livraisonIsFacturation: bool
    })
  }

  commander = () => {
    let livraison = this.state.commande.livraison;
    let facturation = this.state.commande.facturation;
    let basket = this.state.basket;

    if (this.state.livraisonIsFacturation == true) {
      _.assign(facturation, livraison)

    }
    let command = {
      commandList: basket,
      livraison: livraison,
      facturation: facturation,
      price: this.state.total
    }

    axios.post(`https://app-benj.com/api/command/take-command`, command).then(({ data }) => {
      console.log(data);
      this.setState({
        idCommande: data.id,
        modalCommand: false,
        modalPaiement: true
      });
    })
      .catch(error => {
        console.log(error);
        console.log('erreur dans la commande')
      })

  }

  // process = () => {
  //   axios.post('https://app-benj.com/api/command/' + this.state.idCommande + '/paiement', {
  //     id: self.source.id
  //   }).then(response => {
  //     console.log(response);
  //     Alert.alert("Votre commande à bien été effectué");
  //     basketServices.delBasket();

  //   }).catch(error => {
  //     axios.post('https://app-benj.com/api/command/delete/' + self.idCommande).then(data => {
  //       console.log(data);
  //     })
  //   })
  // }

  render() {

    if (this.state.basket.length > 0) {
      return (
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalCommand}
            onRequestClose={() => {
              this.setState({ modalCommand: false })
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Adresse de livraison </Text>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder={'Nom'}
                      value={this.state.commande.livraison.name}
                      onChangeText={(text) => this.updateName(text, 'livraison')}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder={'Pays'}
                      value={this.state.commande.livraison.pays}
                      onChangeText={(text) => this.updatePays(text, 'livraison')}
                    />
                  </View>
                </View>

                <View>
                  <TextInput
                    style={styles.inputAddress}
                    placeholder={'Adresse'}
                    value={this.state.commande.livraison.address}
                    onChangeText={(text) => this.updateAddress(text, 'livraison')}
                  />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>

                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder={'Code Postal'}
                      value={this.state.commande.livraison.postal_code}
                      onChangeText={(text) => this.updatePostalCode(text, 'livraison')}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder={'Ville'}
                      value={this.state.commande.livraison.ville}
                      onChangeText={(text) => this.updateCity(text, 'livraison')}
                    />
                  </View>
                </View>

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={this.state.livraisonIsFacturation ? 'checked' : 'unchecked'}
                    onPress={() => {
                      this.updateCheckbox(!this.state.livraisonIsFacturation);
                    }}
                  />
                  <Text style={styles.labelCheckbox}>Définir comme adresse de facture ?</Text>
                </View>

                <View style={{ alignItems: 'center', opacity: this.state.livraisonIsFacturation ? 0 : 1 }}>
                  <Text style={styles.modalTitle}>Adresse de facturation </Text>
                  <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder={'Nom'}
                        value={this.state.commande.facturation.name}
                        onChangeText={(text) => this.updateName(text, 'facturation')}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder={'Pays'}
                        value={this.state.commande.facturation.pays}
                        onChangeText={(text) => this.updateName(text, 'facturation')}
                      />
                    </View>
                  </View>

                  <View>
                    <TextInput
                      style={styles.inputAddress}
                      placeholder={'Adresse'}
                      value={this.state.commande.facturation.address}
                      onChangeText={(text) => this.updateAddress(text, 'facturation')}
                    />
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>

                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder={'Code Postal'}
                        value={this.state.commande.facturation.postal_code}
                        onChangeText={(text) => this.updatePostalCode(text, 'facturation')}
                      />
                    </View>
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder={'Ville'}
                        value={this.state.commande.facturation.ville}
                        onChangeText={(text) => this.updateCity(text, 'facturation')}
                      />
                    </View>
                  </View>
                </View>
                <Pressable
                  style={[styles.buttonCommand, { marginTop: 20 }]}
                  onPress={() => this.commander()}
                >
                  <Text style={styles.textStyle}>Continuer</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalPaiement}
            onRequestClose={() => {
              this.setState({ modalPaiement: false })
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalPaiement}>
                <StripeProvider
                  publishableKey="pk_test_51KDuErCLeLtq3NkeHRRPq1lxIr4LtN6qs9fOXlSd0Q6a612MStQri7SsUwxC88U3LqkhTJjo5IsjJe46VHDmmvhb007euCXqNc"
                >
                  <PaymentScreen total={this.state.total} idCommand={this.state.idCommande} navigation={this.props.navigation} handleToUpdate={this.handleToUpdate.bind(this)} />
                </StripeProvider>
              </View>
            </View>
          </Modal>

          <View style={{ padding: 10, marginBottom: 10, marginTop: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ textAlign: "center", fontSize: 30, color: "#2f53b9" }}>Total</Text>
            </View>
            <View>
              <Text style={{ textAlign: "center", fontSize: 30, color: "#2f53b9", fontWeight: "bold" }}>{this.state.total}€</Text>
            </View>
          </View>

          <Pressable
            style={[styles.buttonCommand, styles.buttonClose]}
            onPress={() => this.passCommand()}
          >
            <Text style={styles.textStyle}>PASSER LA COMMANDE</Text>
          </Pressable>

          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.basket}
            renderItem={this.renderItem}
            extraData={this.state}
          />
        </View>
      );
    } return (
      <View style={styles.emptyBasket}>
        <Text style={{ fontWeight: 'bold', color: 'gray', fontSize: 20}}> Pas de produit dans le panier</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fActive: {
    alignItems: "center",
  },
  fInactive: {
    display: 'none'
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  labelCheckbox: {
    margin: 8,
  },
  input: {
    height: 40,
    margin: 2,
    marginHorizontal: 10,
    width: 140,
    borderWidth: 1,
    borderColor: '#2f53b9',
    borderRadius: 10,
    padding: 10,
  },
  inputAddress: {
    height: 40,
    margin: 2,
    width: 300,
    borderWidth: 1,
    borderColor: '#2f53b9',
    borderRadius: 10,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalPaiement: {
    margin: 20,
    width: "100%",
    height: "20%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonCommand: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: "#5CC2C4"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    textAlign: "center"
  },

  emptyBasket: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});