import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from "react-native"
import CardView from '../components/cardview.js';

export default class List extends React.Component {

    constructor({navigation}) {
        super();
        this.state = {
            data: [],
            navigation: navigation,
            isLoading: true
        }
        
    }

    componentDidMount() {
        this.getPostData();
    }

    onUpdate = (val) => {
        this.setState({data: val, isLoading: false});
    };

    getPostData = async () => {
        const data = await this.callPostData();
        //console.log(data) this.changeState = this.changeState.bind(this)
        //this.setState({data: data, isLoading: true});
        this.onUpdate(data);

        const ws = new WebSocket('wss://www.bitmex.com/realtime');

        ws.onopen = () => {
            //ws.send("{\"op\": \"subscribe\", \"args\": [\"trade\":\"XBTUSD\"]}")
            (this.state.data).forEach(element => {
                ws.send(
                    "{\"op\": \"subscribe\", \"args\": [\"trade:" + element.title + "\"]}"
                )
            });
        };

        ws.onmessage = e => {
            msgData = JSON.parse(e.data);
            try {
                //console.log(msgData);
                action = msgData.action;
                if (action == "insert" || action == "partial") {
                    //console.log(msgData.data[0]);
                    tmpData = msgData.data
                    if (tmpData.length > 0) {
                        tmpData.forEach(element2 => {
                            if ("symbol" in element2 && "price" in element2) {
                                symbol = element2["symbol"].toString();
                                price = element2["price"].toString();
                                side = element2["side"].toString();
                                //console.log(price);
                                (this.state.data).forEach(element => {
                                    if (element.title == symbol) {
                                        element.price = price;
                                        if (side == "Sell") {
                                            element.side = "#cb595a";
                                        } else if (side == "Buy") {
                                            element.side = "#5ab25f";
                                        }

                                        this.onUpdate(data);
                                    }
                                });
                            }
                        });
                    }
                } else {
                    console.log(msgData);
                }
            } catch (e) {
                console.log(msgData);
                console.log(e);
            }
        };

        ws.onerror = e => {
            console.log(e.message);
        };

        ws.onclose = e => {
            console.log(e.code, e.reason);
        };
    }

    callPostData = async () => {
        return fetch('https://wiffy.io/bitmex/symbol.json?123')
            .then(
                request => request.json()
            )
            .catch(err => console.log(err))
        }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.cardContainer}>
                        <Text style={[styles.topText]}>Change Percent:
                        </Text>
                        <Text style={[styles.topText]}>BTC Dominance:
                        </Text>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={[styles.blue, styles.symbol]}>Symbol</Text>
                        <Text style={[styles.blue, styles.price]}>Price</Text>

                        <FlatList
                            data={this.state.data}
                            renderItem={(obj) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => this.state.navigation.navigate('Details', {data: obj.item})}>
                                        <CardView key={obj.index} data={obj.item}/>
                                    </TouchableOpacity>
                                )
                            }}></FlatList>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text
                            style={{
                                textAlign: "center",
                                margin: 20
                            }}>AD</Text>
                    </View>

                </ScrollView>
            </View>

        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        backgroundColor: "#f9f9f9"
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        flexDirection: 'column',
        width: '100%',
        elevation: 5,
        marginTop: 20
    },
    symbol: {
        height: 25,
        fontWeight: 'bold',
        marginLeft: 15
    },
    blue: {
        fontSize: 13,
        marginTop: 7,
        color: '#1e5ea4'
    },
    topText: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 15,
        color: '#000000'
    },
    price: {
        position: 'absolute',
        right: 15,
        fontWeight: 'bold'
    }
})