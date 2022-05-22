import React from 'react';
import axios from 'axios';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Card, Title } from 'react-native-paper';


const Item = ({ company, navigation }) => (
  <Card style={{ margin: 15}} onPress={() => {
    // navigation.setParams('Produits', { companyId: company.id, company: company })
    navigation.navigate('Produits', { companyId: company.id, company: company })
    
    }}>
    <Card.Content>
      <Title style={{ textAlign: 'center' }}>{company.name}</Title>
    </Card.Content>
    <Image style={{
      width: '100%',
      height: 100,
      resizeMode: 'contain',
    }} source={{ uri: 'https://app-benj.com' + company.picture }} />
  </Card>
);

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      companies: [],
    };
  }
  componentDidMount() {
    this.getCompanies();
  }

  getCompanies() {
    let companies = [];
    axios.get(`https://app-benj.com/api/company/get`).then(({ data }) => {
      companies = data.data;
      this.setState({
        companies: companies
      });
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <Item company={item} navigation={this.props.navigation} />
  )

  render() {
    return (
      <View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.companies}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});