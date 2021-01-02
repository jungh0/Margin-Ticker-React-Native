import React, {useState} from "react"
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator
} from "react-native"
import CardView from '../components/cardview.js';
import {AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync} from 'expo-ads-admob';

function toFixed(x) {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (
                new Array(e)
            ).join('0') + x
                .toString()
                .substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
}


export default class List extends React.Component {

    constructor({navigation}) {
        super();
        this.state = {
            data: [],
            ws: null,
            percent: "---",
            dominance: "---",
            loading: false
        }
    }

    componentDidMount() {
        this.getPostData();
    }

    onUpdate = (val) => {
        this.setState({data: val});
    };

    getPostData = async () => {
        const data = await this.callPostData();
        this.onUpdate(data);

        return;

        try {
            const coingecko = await this.callCoingecko();
            // coingeckoMsgData = JSON.parse(coingecko); const coingeckoMsgData =
            // coingecko.data;
            this.state.percent = coingecko
                .data
                .market_cap_change_percentage_24h_usd
                .toFixed(2);
            this.state.dominance = coingecko
                .data
                .market_cap_percentage
                .btc
                .toFixed(2);
        } catch (e) {}

        const ws = new WebSocket('wss://www.bitmex.com/realtime');
        this.state.ws = ws;

        ws.onopen = () => {
            //ws.send("{\"op\": \"subscribe\", \"args\": [\"trade\":\"XBTUSD\"]}")
            (this.state.data).forEach(element => {
                ws.send(
                    "{\"op\": \"subscribe\", \"args\": [\"trade:" + element.title + "\"]}"
                )
            });
        };

        ws.onmessage = e => {
            try {
                if (e.data != "received bad response code from server 429") {
                    msgData = JSON.parse(e.data);
                    //console.log(msgData);
                    action = msgData.action;
                    if (action == "insert" || action == "partial") {
                        //console.log(msgData.data[0]);
                        tmpData = msgData.data
                        if (tmpData.length > 0) {
                            tmpData.forEach(element2 => {
                                if ("symbol" in element2 && "price" in element2) {
                                    symbol = element2["symbol"].toString();
                                    price = element2["price"];
                                    side = element2["side"].toString();
                                    //console.log(price);
                                    (this.state.data).forEach(element => {
                                        if (element.title == symbol) {
                                            if (price > 1000) {
                                                element.price = price.toFixed(1);
                                                //.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            } else if (price > 1) {
                                                element.price = price.toFixed(4);
                                                //.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            } else {
                                                element.price = toFixed(price.toFixed(8));
                                            }

                                            if (side == "Sell") {
                                                element.side = "#cb595a";
                                            } else if (side == "Buy") {
                                                element.side = "#5ab25f";
                                            }

                                            this.onUpdate(data);
                                            this.state.loading = false;
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        //console.log(msgData);
                    }
                } else {
                    //console.log(e.data);
                }
            } catch (e1) {
                console.log(e.data);
                console.log(e1);
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

    callCoingecko = async () => {
        return fetch('https://api.coingecko.com/api/v3/global?123')
            .then(
                request => request.json()
            )
            .catch(err => console.log(err))
        }

    _renderCancel() {
        if (this.state.loading) {
            return (
                <View style={styles.horizontal}>
                    <ActivityIndicator size="large" color="#ffffff"/>
                </View>
            );
        } else {
            return null;
        }
    }

    header() {
        return (
            <View style={styles.containerBox}>
                <View style={styles.cardContainer}>
                    <Text style={[styles.topText]}>Change Percent : {this.state.percent}%
                    </Text>
                    <Text style={[styles.topText]}>BTC Dominance : {this.state.dominance}%
                    </Text>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={[styles.blue, styles.symbol]}>Symbol</Text>
                    <Text style={[styles.blue, styles.price]}>Price</Text>
                </View>
            </View>
        );
    }

    footer() {
        return (
            <View style={styles.containerBox}>
                
            </View>
        );
    }

    render() {
        const adUnitID = Platform.select({
            ios: 'ca-app-pub-0355430122346055/4327411602',
            android: 'ca-app-pub-0355430122346055/8150913029'
        });

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={(obj) => {
                        return (
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Details', {
                                    onUpdate: this.onUpdate,
                                    current: obj.item,
                                    data: this.state.data,
                                    ws: this.state.ws
                                })}>
                                <CardView key={obj.index} data={obj.item}/>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(_, index) => index.toString()}
                    ListHeaderComponent={this.header()}
                    ListFooterComponent={this.footer()}/>

                <AdMobBanner
                            bannerSize="smartBannerPortrait"
                            adUnitID={adUnitID}
                            servePersonalizedAds="servePersonalizedAds"/>
                            {this._renderCancel()}
            </View>

        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#f9f9f9"
    },
    containerBox: {
        flex: 1,
        justifyContent: "center",
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
    },
    horizontal: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
})