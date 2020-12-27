import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chart from './Chart.js';
import StatisticsScreen from './StatisticsScreen.js';
import SettingsScreen from './SettingScreen.js';
import Icon from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

export default class Detail extends React.Component {

    constructor({route, navigation}) {
        super();

        this.state = route.params;
        navigation.setOptions({title: this.state.data.title})
    }

    render() {
        return (
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;

                        if (route.name === 'Chart') {
                            iconName = focused
                                ? 'cellular'
                                : 'cellular-outline';
                        } else if (route.name === 'Orderbook') {
                            iconName = focused
                                ? 'file-tray-full'
                                : 'file-tray-full-outline';
                        } else if (route.name === 'Alert') {
                            iconName = focused
                                ? 'bulb'
                                : 'bulb-outline';
                        } else if (route.name === 'Details') {
                            iconName = focused
                                ? 'globe'
                                : 'globe-outline';
                        }
                        // You can return any component that you like here!
                        return <Icon name={iconName} size={size} color={color}/>;
                    }
                })}
                tabBarOptions={{
                    activeTintColor: 'black',
                    inactiveTintColor: 'gray'
                }}>
                <Tab.Screen name="Chart" children={({navigation})=><Chart data={this.state.data} navigation={navigation}/>}/>
                <Tab.Screen name="Orderbook" component={StatisticsScreen}/>
                <Tab.Screen name="Alert" component={SettingsScreen}/>
                <Tab.Screen name="Details" component={SettingsScreen}/>
            </Tab.Navigator>
        );
    }
}
