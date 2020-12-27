import React from 'react';
import {View, Text} from 'react-native';

export default class Chart extends React.Component {

    constructor({data}) {
        super();
        this.state = data;
    }

    render() {
        return (
            <View >
                <Text>asdsad</Text>
                <Text>{this.state.price}</Text>
            </View>

        );
    }
}
