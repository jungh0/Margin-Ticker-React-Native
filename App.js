import React from 'react'
import {StyleSheet, Text, View, StatusBar} from 'react-native'
import {Header, Icon} from 'react-native-elements';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Main from './app/screens/Main.js';
import Detail from './app/screens/Detail.js';

const Stack = createStackNavigator();

export default class App extends React.Component {

    render() {
        return (
            <NavigationContainer style={styles.container}>
                <Stack.Navigator initialRouteName="Margin Ticker">
                    <Stack.Screen name="Margin Ticker" component={Main}/>
                    <Stack.Screen name="Details" component={Detail}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
