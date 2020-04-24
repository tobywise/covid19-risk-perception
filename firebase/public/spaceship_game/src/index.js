import './phaser.js';
import GameStart from './scenes/GameStart.js';
import GameScene from './scenes/GameScene.js';
import GameOver from './scenes/GameOver.js';
import EndScene from './scenes/EndScene.js';
import AvoidanceStart from './scenes/AvoidanceStart.js';
import AvoidanceScene from './scenes/AvoidanceScene.js';
import NextPhase from './scenes/NextPhase.js';

Sentry.init({ dsn: 'https://858581c7c8234dd393241da13da4f94b@sentry.io/1340805' });

var game = new GameScene('GameScene');
var avoidance = new AvoidanceScene('AvoidanceScene');
var gameover = new GameOver("GameOver");
var nextphase = new NextPhase("NextPhase");

let config = {
    type: Phaser.AUTO,
    parent: 'consent',
    width: 800,
    height: 600,
    scene: [
        GameStart,
        game,
        gameover,
        nextphase,
        AvoidanceStart,
        avoidance,
        EndScene
    ]
};

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

// Firebase stuff
// firebase.firestore().enablePersistence()
// .catch(function(err) {
//     if (err.code == 'failed-precondition') {
//         // Multiple tabs open, persistence can only be enabled
//         // in one tab at a a time.
//         // ...
//     } else if (err.code == 'unimplemented') {
//         // The current browser does not support all of the
//         // features required to enable persistence
//         // ...
//     }
// });

var uid = getQueryVariable('UID');

// Consent form
var check_consent = function (elem) {
    // if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
    //     $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
    //     $('#consent_checkbox5').is(':checked') && $('#consent_checkbox6').is(':checked') &&
    //     $('#consent_checkbox7').is(':checked')) {
    if (1 == 1) {

        document.getElementById('consent').innerHTML = "";
        window.scrollTo(0,0);

        $.getJSON('./trial_info_optim.json', function (data) {

            let game = new Phaser.Game(config);
            console.log(data);
            game.trial_info = data;
            game.trial = 0;
            game.player_trial = 0;
            if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
                game.subjectID = getQueryVariable('PROLIFIC_PID');
            }
            else {
                game.subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
//                var subject_id = '0000' // for testing
            }

            var condition = getQueryVariable('CONDITION');
            game.condition = condition;

            game.data = {};
            game.n_trials = 8;

            game.dataKeys = ['health', 'hole1_y', 'hole2_y', 'player_y', 'score', 'subjectID', 'trial', 'trial_type'];


            var db = firebase.firestore();
            game.dataKeys.forEach(k => {
                game.data[k] = [];
            });

            db.collection("tasks").doc('virus_study_spaceship_game').collection('subjects').doc(uid).set(game.data);
            
            db.collection("tasks").doc('virus_study_spaceship_game').collection('subjects').doc(uid).update({
                subjectID: game.subjectID,
                subjectID: game.subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
              })


            game.db = db;
            game.uid = uid;

        });
        return true;
    }
    else {
        alert("Unfortunately you will not be unable to participate in this research study if you do " +
            "not consent to the above. Thank you for your time.");
        return false;
    }
};



document.getElementById('header_title').innerHTML = "Spaceship game";
document.getElementById('consent').innerHTML = 'Next you will play a game where you must fly a spaceship while avoiding asteroids<br><br>' + 
    "<b>You may find this game quite difficult - it is designed to be a challenge!</b><br><br>" +
    "The game will take around 10 minutes in total" +
    "        <br><br>\n" +
    "        <button type=\"button\" id=\"start\" class=\"submit_button\">Start Experiment</button>\n" +
    "        <br><br>";


document.getElementById("start").onclick = check_consent;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this experiment does not work on mobile devices");
    document.getElementById('consent').innerHTML = "";
}
