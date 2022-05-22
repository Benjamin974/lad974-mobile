import _ from 'lodash';
import React from 'react';
import { Alert, StyleSheet, Text, View, Image, Modal, Pressable } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { basketServices } from '../../_services/basketServices';



export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      quantite: props.product.quantite
    };
  }
  decrementeQuantite = async () => {
    let _quantite = this.state.quantite;
    this.setState({
      quantite: _quantite -= 1
    })
    if (_quantite == 0) {
      this.setState({
        modalVisible: true
      })

    } else {
      basketServices.updateQuantity(this.props.product, _quantite)

    }
  }

  incrementQuantite = async () => {
    let _quantite = this.state.quantite;
    if (this.state.quantite >= 0) {
      this.setState({
        quantite: _quantite += 1
      })
    }
    basketServices.updateQuantity(this.props.product, _quantite)

  }

  deleteProductBasket = (bool) => {
    var handleToUpdate = this.props.handleToUpdate;
    let _quantite = this.state.quantite;
    if (bool == true) {
      handleToUpdate(this.props.product)
      basketServices.replaceQuantity(this.props.product, _quantite)
    } else {
      this.setState({
        quantite: _quantite + 1
      })
      basketServices.updateQuantity(this.props.product, 1)
    }
    this.setState({
      modalVisible: false
    })

  }

  render() {

    return (
      <View style={styles.prnt}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal a été fermé.");
            this.setState({ modalVisible: false })
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Voulez vous supprimer ce produit du panier ? </Text>
              <View style={{ width: 200, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable
                  style={[styles.buttonNegatif, styles.buttonClose]}
                  onPress={() => this.deleteProductBasket(false)}
                >
                  <Text style={styles.textStyle}>Non</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttonPositif, styles.buttonClose]}
                  onPress={() => this.deleteProductBasket(true)}
                >
                  <Text style={styles.textStyle}>Oui</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={[styles.child, styles.description]} >
          <Text style={{ color: 'white' }}>{this.props.product.name} </Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>
              Quantité :
            </Text>
            <IconButton
              icon="arrow-left-drop-circle"
              color={Colors.green100}
              size={20}
              onPress={() => this.decrementeQuantite()}
            />
            <Text style={{ color: 'white' }}>{this.state.quantite}</Text>
            <IconButton
              icon="arrow-right-drop-circle"
              color={Colors.green100}
              size={20}
              onPress={() => this.incrementQuantite()}
            />
          </View>
          <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ padding: 5, backgroundColor: "#ff6d6d", color: "white", width: 50, height: 30 }}>{this.props.product.price} € </Text>

          </View>
        </View>
        <View style={[styles.child, styles.img]}>
          <Image style={{
            width: "100%",
            height: "90%",
            margin: 4,
            resizeMode: 'contain',
          }} source={require('../../assets/logo_img.png')} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  prnt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  child: {
    backgroundColor: "white",
    width: "45%",
    marginBottom: 4,
    marginTop: 4,
  },
  img: {
  },
  description: {
    width: "48%",
    padding: 10,
    backgroundColor: '#2f53b9'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
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
  buttonPositif: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2f53b9"
  },
  buttonNegatif: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#FF6D6D"
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});