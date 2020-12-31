import React from 'react';
import {Button, StyleSheet, Text, View, Alert} from 'react-native';

export default class CardView extends React.Component {
    constructor({data}) {
        super();

        this.state = data;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container2}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Text style={styles.suntitle}>{this.state.subtitle}</Text>
                </View>

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
        padding: 15,
        marginTop: 0,
        borderBottomWidth: 1,
        borderColor: "#efefef",
        alignContent:'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        alignSelf:'flex-start',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    suntitle: {
        marginTop: 2,
        fontSize: 12
    },
    CardContainer: {
        width: 100,
        borderRadius: 4,
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
