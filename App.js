import React, { Component } from 'react'
import { Text, View, FlatList, StyleSheet, Image, StatusBar, RefreshControl, Dimensions } from 'react-native'
// import TimerMixin from 'react-timer-mixin'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      isLoading: false,
      refreshing: true,
      timePassed: false,
    }
  }

  setTimePassed() {
    this.setState({ timePassed: true });
  }

  componentDidMount() {
    this.setState({ isLoading: true }, this.getData);
    setTimeout(() => {
      this.setTimePassed();
    }, 4000);
  }

  getData = () => {
    // const apiURL = "https://jsonplaceholder.typicode.com/photos?_limit=5&_page=" + this.state.page
    const apiURL = "https://jsonplaceholder.typicode.com/photos?_limit=10&_page=" + this.state.page
    //https://newsapi.org/v2/top-headlines?country=in&pageSize=5&apiKey=9bb79a77da8348e2b37393ecacdc0596
    fetch(apiURL).then((res) => res.json())
      .then((resJson) => {
        this.setState({
          data: this.state.data.concat(resJson),
          isLoading: false,
          refreshing: false,
        })
      })
  }

  renderRow = ({ item }) => {
    return (
      <View style={styles.itemRow}>
        {/* <Image source={{ uri: item.url }} style={styles.itemImage} resizeMode='cover' /> */}
        <Text style={styles.itemText}>{item.id}</Text>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
    )
  }

  renderFooter = () => {
    return (
      this.state.isLoading ?
        <View style={styles.loader}>
          {/* <ActivityIndicator size="large" /> */}
          <Text>Loading...</Text>
        </View> : null
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
      </View>
    )
  }

  handleLoadMore = ({ item }) => {
    this.setState({ page: this.state.page + 1, isLoading: true }, this.getData)
  }

  onRefresh() {
    //Clear old data of the list
    this.setState({ data: [], page: 1, refreshing: true, }, this.getData);
    //Call the Service to get the latest data
    // this.getData();
  }

  render() {
    // if (!this.state.timePassed) {
    //   return (
    //     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
    //       <Text>LOADANG</Text>
    //     </View>
    //   )
    // } else 
    {
      return (
        <>

          <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor={'transparent'} />
            <FlatList
              style={styles.container}
              data={this.state.data}
              renderItem={this.renderRow}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.handleLoadMore}
              ListHeaderComponent={this.renderHeader}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
            />
            <View style={styles.customStatusBar}><Text style={{ color: 'pink' }}>Hey</Text></View>
            {
              !this.state.timePassed ?
                <View style={{ height: Dimensions.get('window').height - StatusBar.currentHeight, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 0 }}>
                  <Text>LOADANG</Text>
                </View>
                :
                null
            }
          </View>
        </>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5fcff'
  },
  itemRow: {
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    padding: 5,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  loader: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  customStatusBar: {
    width: '100%',
    height: StatusBar.currentHeight,
    backgroundColor: '#000',
    opacity: .2,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  header: {
    height: StatusBar.currentHeight,
    width: '100%',
    backgroundColor: '#FFF',
  }
})
