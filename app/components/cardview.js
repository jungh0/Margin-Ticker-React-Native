import React from 'react';
import {Button, StyleSheet, Text, View, Alert} from 'react-native';

export default class CardView extends React.Component {
    constructor({index, data}) {
        super();

        this.state = data;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.state.title}</Text>
                <Text style={styles.suntitle}>{this.state.subtitle}</Text>
                <View
                    style={[
                        styles.CardContainer, {
                            backgroundColor: this.state.side
                        }
                    ]}>
                    <Text style={styles.CardTitle}>{this.state.price}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 62,
        padding: 10,
        marginTop: 0,
        borderBottomWidth: 1,
        borderColor: "#e2e2e2"
    },
    title: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: 'bold'
    },
    suntitle: {
        marginLeft: 5,
        marginTop: 2,
        fontSize: 12
    },
    CardContainer: {
        position: 'absolute',
        right: 0,
        marginTop: 13,
        width: 100,
        borderRadius: 4,
        marginRight: 10,
        padding: 5
    },
    CardTitle: {
        color: '#ffffff',
        width: '100%',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
        padding: 3
    }
});
