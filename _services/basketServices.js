import EventBus from 'react-native-event-bus';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const basketServices = {
  addProducts,
  quantiteBasketSize,
  getBasket,
  emitBasket,
  replaceQuantity,
  updateQuantity,
  delBasket
}

async function addProducts(product, quantite) {

  let basket = await getBasket();
  if (!_.hasIn(basket, buildkey(product))) {
    basket[buildkey(product)] = {
      id: product.id,
      name: product.name,
      quantite: parseInt(quantite),
      picture: product.picture,
      price: product.price
    }
  }
  else {
    console.log('update quantite')
    basket[buildkey(product)].quantite += parseInt(quantite)
  }
  storeBasket(basket)

}

async function updateQuantity(product, quantite) {

  let basket = await getBasket();
  if (_.hasIn(basket, buildkey(product))) {
    basket[buildkey(product)].quantite = parseInt(quantite)
  }
  else {
    console.log('not update quantite')
  }
  storeBasket(basket)

}

async function replaceQuantity(product, _quantite) {
  let basket = await getBasket()
  if (_.hasIn(basket, buildkey(product))) {
    _.unset(basket, buildkey(product))
  }
  else {
    throw 'err'
  }
  storeBasket(basket)
}

function emitBasketSize(basket) {
  let basketSize = _.toPairs(basket).length;
  EventBus.getInstance().fireEvent('basketLength', basketSize);
}

function emitBasket() {
  let basket = getBasket()
  return basket
}

function quantiteBasketSize() {
  let quantite = getBasket()
  quantite = _.toPairsIn(quantite).length
  return quantite
}

function buildkey(product) {
  return 'product_' + product.id
}

const storeBasket = async (basket) => {
  AsyncStorage.setItem('currentBasket', JSON.stringify(basket));
  EventBus.getInstance().fireEvent('basket', basket)
  emitBasketSize(basket)

}

function delBasket() {
  AsyncStorage.removeItem('currentBasket');
  EventBus.getInstance().fireEvent('basketLength', 0);

}

const getBasket = async () => {
  let basket = await AsyncStorage.getItem('currentBasket');
  if (!basket) {
    basket = {}
  } else {
    basket = JSON.parse(basket)
  }

  return basket
}