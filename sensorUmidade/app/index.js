import React, { Component } from "react";
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground } from "react-native";
import * as firebase from "firebase";
import config from "./config/firebase";
import Images from "./config/images";
import * as Progress from 'react-native-progress';

export default class sensorUmidade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            humidity: 0,
            loading: true
        };
    }

    componentDidMount() {
        firebase.initializeApp(config);
        firebase
            .database()
            .ref("/humidity")
            .on("value", this._getHumidity);
    }

    _getHumidity = humidity => {
        let humidityVal = humidity.val();
        this.setState({ humidity: humidityVal, loading: false });
    };

    _generateColor = humidity => {
        //red -> 1024 -> rgba(255,0,0,1);
        //green -> 0 -> rgba(0,255,0,1);
        let red = humidity / 1024 * 255;
        let green = (1 - humidity / 1025) * 255;
        return `rgba(${red},${green},0,0.5)`
    }

    _getStatus(humidity) {
        if (humidity > 800) {
            return "Solo Seco";
        } else if (humidity > 400) {
            return "Umidade moderada";
        } else {
            return "Solo umido"
        }
    }
    render() {
        if (this.state.loading) {
            return (
                <ImageBackground style={styles.container} source={Images.background}>
                    <ActivityIndicator color={"#00f"} size={"large"} />
                </ImageBackground>
            )
        } else {
            return (
                <ImageBackground style={{ flex: 1 }} source={Images.background}>
                    <View style={[styles.container, { backgroundColor: this._generateColor(this.state.humidity) }]}>
                        <Text style={styles.welcome}>Sensor de Umidade</Text>
                        <Progress.Bar
                            color={"#00f"}
                            height={10}
                            width={300}
                            progress={1 - (this.state.humidity / 1024)} />
                        <Text style={styles.text}>{this._getStatus(this.state.humidity)}</Text>
                    </View>
                </ImageBackground>
            );

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    welcome: {
        fontSize: 25,
        textAlign: "center",
        margin: 10,
        color: "white",
        fontWeight: "bold"
    },
    text: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold"
    }
});
