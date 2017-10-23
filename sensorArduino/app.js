var five = require("johnny-five");
var firebase = require("firebase");
var board = new five.Board();

config = {
    apiKey: "AIzaSyAKSR4BH9YGIh2Ub97iM423OsvWhoY4iVs",
    authDomain: "sensor-umidade-ieee.firebaseapp.com",
    databaseURL: "https://sensor-umidade-ieee.firebaseio.com",
    projectId: "sensor-umidade-ieee",
    messagingSenderId: "947144390864"
};
firebase.initializeApp(config);

board.on("ready", function () {
    var pot = new five.Pin("A0");

    var potValue = 0;
    var lastPotValue = 0;
    pot.read(function (error, value) {
        potValue = value;
    });

    setInterval(() => {
        if (lastPotValue != potValue) {
            lastPotValue = potValue;
            firebase
                .database()
                .ref("humidity")
                .set(potValue);
        }
    }, 1000);
});
