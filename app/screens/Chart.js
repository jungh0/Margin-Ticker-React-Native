import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from "react-native-webview";

export default class Chart extends React.Component {

    constructor({data}) {
        super();
        this.state = data;
    }

    onBrowserMessage = (event) => {
        console.log(event.nativeEvent.data);
    };

    render() {
        const javascriptCode = `
            const meta = document.createElement('meta'); 
            meta.setAttribute('content', 'width=device-width, initial-scale=1'); 
            meta.setAttribute('name', 'viewport'); 
            document.getElementsByTagName('head')[0].appendChild(meta);`;

        const title = this.state.title;

        return (
            <View style={styles.container}>
                <View style={styles.container2}>
                    <WebView
                        scrollEnabled='false'
                        injectedJavaScript={javascriptCode}
                        onMessage={this.onBrowserMessage}
                        source={{
                            html: `<div class="tradingview-widget-container">
                        <div class="tradingview-widget-container__widget"></div>
                        <script
                            type="text/javascript"
                            src="https://s3.tradingview.com/external-embedding/embed-widget-tickers.js"
                            async="async">
                            {
                                "symbols": [
                                    {
                                        "description": "",
                                        "proName": "BITMEX:` +
                                    title +
                                    `"
                                    }
                                ],
                                "colorTheme": "light",
                                "isTransparent": false,
                                "showSymbolLogo": true,
                                "locale": "uk"
                            }
                        </script>
                    </div>`
                        }}/>
                </View>

                <View style={styles.container3}>
                    <WebView
                        scrollEnabled='false'
                        injectedJavaScript={javascriptCode}
                        onMessage={this.onBrowserMessage}
                        source={{
                            html: `
                        <div class="tradingview-widget-container">
                            <div id="tradingview_560f1"></div>
                            <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
                            <script type="text/javascript">
                                new TradingView.widget({
                                    "autosize": true,
                                    "symbol": "BITMEX:` +
                                    title +
                                    `",
                                    "interval": "60",
                                    "timezone": "exchange",
                                    "theme": "light",
                                    "style": "1",
                                    "locale": "uk",
                                    "toolbar_bg": "#f1f3f6",
                                    "enable_publishing": false,
                                    "hide_legend": true,
                                    "save_image": false,
                                    "container_id": "tradingview_560f1"
                                });
                            </script>
                        </div>`
                        }}/>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container2: {
        height: 80
    },
    container3: {
        flex: 1
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