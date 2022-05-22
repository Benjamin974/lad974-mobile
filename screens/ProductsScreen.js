import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import EventBus from 'react-native-event-bus';
import { IconButton, Colors } from 'react-native-paper';
import { basketServices } from '../_services/basketServices'

const Item = ({ product, navigation, badge }) => {
  const [quantite, onChangeNumber] = React.useState(0);

  const decrementeQuantite = async () => {
    let _quantite = quantite;
    onChangeNumber(_quantite -= 1);
    if (quantite == 0) {
      onChangeNumber(_quantite += 1);
    }
  }

  const incrementQuantite = async () => {
    let _quantite = quantite;
    if (quantite >= 0) {
      onChangeNumber(_quantite += 1);
    }
  }

  const addInBasket = async () => {
    basketServices.addProducts(product, quantite)
  }

  const getBasket = async () => {
    // let _badge = parseInt(badge) + 1;
    // EventBus.getInstance().fireEvent('update_badge', _badge)
    // await basketServices.delBasket()
    let bask = await AsyncStorage.getItem('currentBasket')
    console.log(bask);
  }
  return (

    <View style={styles.prnt}>
      <View style={[styles.child, styles.description]} >
        <Text style={{ color: 'white' }}>{product.name} </Text>
        <Text style={{ marginVertical: 5, color: "gray" }}>{product.description} </Text>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>
            Quantité : {product.quantite}
          </Text>
          <IconButton
            icon="arrow-left-drop-circle"
            color={Colors.green100}
            size={20}
            onPress={() => decrementeQuantite()}
          />
          <Text style={{ color: 'white' }}>{quantite}</Text>
          <IconButton
            icon="arrow-right-drop-circle"
            color={Colors.green100}
            size={20}
            onPress={() => incrementQuantite()}
          />
        </View>
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ padding: 5, backgroundColor: "#ff6d6d", color: "white", width: 50, height: 30 }}>{product.price} € </Text>

          <IconButton
            icon="cart-plus"
            color="#ff6d6d"
            size={20}
            onPress={() => addInBasket()}
          />
         </View>
      </View>
      <View style={[styles.child, styles.img]}>
        <Image style={{
          width: "100%",
          height: "90%",
          margin: 4,
          resizeMode: 'contain',
        }} source={require('../assets/logo_img.png')}/>
      </View>
    </View>
  )
};

export default class ProductsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      badge: this.props.route.params.badge
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState({
        products: this.props.route.params != undefined ? this.props.route.params.company.products : []
      });
    });
  }
  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <Item product={item} navigation={this.props.navigation} badge={this.state.badge}  />
  )

  render() {
    return (
      <View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.products}
          renderItem={this.renderItem}
        />
      </View>
    );
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
});