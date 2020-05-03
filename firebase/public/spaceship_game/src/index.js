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
if (uid == false) {
    firebase.auth().signInAnonymously().then(function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var isAnonymous = user.isAnonymous;
                uid = user.uid;
                // console.log(uid);
            } 
        });
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode);
        console.error(errorMessage);
    });
}
// Consent form
var check_consent = function (elem) {
    // if ($('#consent_checkbox1').is(':checked') && $('#consent_checkbox2').is(':checked') &&
    //     $('#consent_checkbox3').is(':checked') && $('#consent_checkbox4').is(':checked') &&
    //     $('#consent_checkbox5').is(':checked') && $('#consent_checkbox6').is(':checked') &&
    //     $('#consent_checkbox7').is(':checked')) {
    if (1 == 1) {

        document.getElementById('consent').innerHTML = "";
        window.scrollTo(0,0);

        $.getJSON('./trial_info_v2.json', function (data) {

            // Add brief instructions
            var helperText = document.createElement('div');
            helperText.innerHTML = 'Move the spaceship using the <b>up</b> and <b>down</b> keys to avoid the asteroids<br>' +
            'Use the warning beacons to help you predict where the holes in the asteroid belt will be<br>' +
            'Press <b>S</b> to boost your shields temporarily<br><br>'

            document.getElementById('consent').appendChild(helperText);

            let game = new Phaser.Game(config);

            game.beacon_textures = ['beacon1', 'beacon2'];
            game.beacon_textures = Phaser.Utils.Array.Shuffle(game.beacon_textures);

            game.trial_info = data;
            Phaser.Actions.Shuffle(game.trial_info['post_outcome_durations'])
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

            game.dataKeys = ['health', 'hole1_y', 'hole2_y', 'player_y', 'score', 'subjectID', 'trial', 'trial_type', 'boost_on'];

            // Update firebase data
            var db = firebase.firestore();
            var docRef = db.collection("tasks").doc('virus_study_spaceship_gameT9');

            // docRef.collection('subjects').doc('completed_subs').update({
            //     completed_subs: firebase.firestore.FieldValue.arrayUnion(game.subjectID)
            // })
            
            db.collection("tasks").doc('virus_study_spaceship_gameT9').collection('subjects').doc(uid).set({
                subjectID: game.subjectID,
                subjectID: game.subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                trial_data: [],
                started: true,
                completed: false,
                version:2
              })

            game.db = db;
            game.uid = uid;
            game.start_time = new Date();
            console.log(game.uid);
            

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


// Instructions
var instruction_div = document.createElement('div');

// Preamble
var instructionIntro = document.createElement('div');
instructionIntro.innerHTML = '<b>Thank you for choosing to complete this study!</b><br><br>' + 
'Here we are testing a game that we are planning to use in a big study of how people are responding to the coronavirus situation<br><br>' +
'Because this is just a test run, it is possible that there may be bugs. If you have problems that stop you completing the task' +
', please send us a message on Prolific.<br><br>' +
'Thank you!<br><br>' +
'----------<br><br>' + 


'Next you will play a game where you must fly a spaceship while avoiding asteroids<br><br>' + 
    "<b>You may find this game quite difficult - it is designed to be a challenge!</b><br><br>" +
    "The game will take around 10-15 minutes in total<br><br>" +
    "Please read through the instructions below before starting<br><br>"

instruction_div.appendChild(instructionIntro);

////////////////////////////
// First panel
var instructionPanel1 = document.createElement('div');
instructionPanel1.setAttribute('class', 'instructionPanel');

// Header
var panel1Header = document.createElement('h3');

// Container
var instructionPanel1Container = document.createElement('div');
instructionPanel1Container.setAttribute('class', 'instructionContainer');

// Text
var panel1Text = document.createElement('div');
panel1Text.setAttribute('class', 'instructionText');

// Image
var panel1Image = document.createElement('img');
panel1Image.setAttribute('class', 'instructionImage');
panel1Image.src = "./assets/instructions1.png";

// Add text
panel1Header.innerHTML = 'Flying the spaceship';
panel1Text.innerHTML = 'Your task is to fly a spaceship through space without crashing into asteroids<br><br>' + 
'You will encounter a series of asteroid belts<br><br>' + 
'Most asteroid belts will have holes in them which you can fly through. These are either near the top or bottom of the screen<br><br>' +
'Use the <b>up</b> and <b>down</b> arrow keys to move the spaceship. You can only move up and down'

// Add text and image to container
instructionPanel1Container.appendChild(panel1Text);
instructionPanel1Container.appendChild(panel1Image);

// Add components to panel
instructionPanel1.appendChild(panel1Header);
instructionPanel1.appendChild(instructionPanel1Container);
///////////////////////////////

////////////////////////////
// Second panel
var instructionPanel2 = document.createElement('div');
instructionPanel2.setAttribute('class', 'instructionPanel');

// Header
var panel2Header = document.createElement('h3');

// Container
var instructionPanel2Container = document.createElement('div');
instructionPanel2Container.setAttribute('class', 'instructionContainer');

// Text
var panel2Text = document.createElement('div');
panel2Text.setAttribute('class', 'instructionText');

// Image
var panel2Image = document.createElement('img');
panel2Image.setAttribute('class', 'instructionImage');
panel2Image.src = "./assets/instructions2.png";

// Add text
panel2Header.innerHTML = 'Spaceship shields';
panel2Text.innerHTML = 'Your spaceship is equipped with shields to protect it<br><br>' + 
'When you hit asteroids, these shields become weaker<br><br>' + 
'When the shields are weakened completely, the game will end and you will start playing again'

// Add text and image to container
instructionPanel2Container.appendChild(panel2Text);
instructionPanel2Container.appendChild(panel2Image);

// Add components to panel
instructionPanel2.appendChild(panel2Header);
instructionPanel2.appendChild(instructionPanel2Container);
///////////////////////////////

////////////////////////////
// THIRD panel
var instructionPanel3 = document.createElement('div');
instructionPanel3.setAttribute('class', 'instructionPanel');

// Header
var panel3Header = document.createElement('h3');

// Container
var instructionPanel3Container = document.createElement('div');
instructionPanel3Container.setAttribute('class', 'instructionContainer');

// Text
var panel3Text = document.createElement('div');
panel3Text.setAttribute('class', 'instructionText');

// Image
var panel3Image = document.createElement('img');
panel3Image.setAttribute('class', 'instructionImage');
panel3Image.src = "./assets/instructions4.png";

// Add text
panel3Header.innerHTML = 'Scoring points';
panel3Text.innerHTML = 'The longer you survive, the more points you accumulate<br><br>' + 
'Your aim is to get as many points as possible!<br><br>' 

// Add text and image to container
instructionPanel3Container.appendChild(panel3Text);
instructionPanel3Container.appendChild(panel3Image);

// Add components to panel
instructionPanel3.appendChild(panel3Header);
instructionPanel3.appendChild(instructionPanel3Container);
///////////////////////////////

////////////////////////////
// PANEL 4
var instructionPanel4 = document.createElement('div');
instructionPanel4.setAttribute('class', 'instructionPanel');

// Header
var panel4Header = document.createElement('h3');

// Container
var instructionPanel4Container = document.createElement('div');
instructionPanel4Container.setAttribute('class', 'instructionContainer');

// Text
var panel4Text = document.createElement('div');
panel4Text.setAttribute('class', 'instructionText');

// Image
var panel4Image = document.createElement('img');
panel4Image.setAttribute('class', 'instructionImage');
panel4Image.src = "./assets/instructions3.png";

// Add text
panel4Header.innerHTML = 'Warning beacons';
panel4Text.innerHTML = 'To help you find the holes in the asteroid belt, some helpful aliens have placed warning beacons<br><br>' + 
'Most of the time, one beacon color will mean there will be a hole in that position, while the other color means danger. <b>You will need to learn which is safe</b><br><br>' +
'<b>However, the aliens who placed these did not do a perfect job.</b> The colors indicating danger and safety might change over time. And sometimes they might just be wrong. Sorry about this, the aliens tried their best.<br><br>'

// Add text and image to container
instructionPanel4Container.appendChild(panel4Text);
instructionPanel4Container.appendChild(panel4Image);

// Add components to panel
instructionPanel4.appendChild(panel4Header);
instructionPanel4.appendChild(instructionPanel4Container);
///////////////////////////////


////////////////////////////
// PANEL 5
var instructionPanel5 = document.createElement('div');
instructionPanel5.setAttribute('class', 'instructionPanel');

// Header
var panel5Header = document.createElement('h3');

// Container
var instructionPanel5Container = document.createElement('div');
instructionPanel5Container.setAttribute('class', 'instructionContainer');

// Text
var panel5Text = document.createElement('div');
panel5Text.setAttribute('class', 'instructionText');

// Image
var panel5Image = document.createElement('img');
panel5Image.setAttribute('class', 'instructionImage');
panel5Image.src = "./assets/instructions5.png";

// Add text
panel5Header.innerHTML = 'Shield boost';
panel5Text.innerHTML = 'Sometimes you might find that there are no holes to fly through<br><br>' + 
'Thankfully, the shields can be boosted for a short amount of time. This will reduce the damage taken from hitting asteroids. You can activate the shields by pressing the <b>S</b> key<br><br>' +
'The boost takes 2 seconds to activate, so you need to use it early<br><br>' + 
'It also takes a long time to recharge, so use it carefully!<br><br>' 


// Add text and image to container
instructionPanel5Container.appendChild(panel5Text);
instructionPanel5Container.appendChild(panel5Image);

// Add components to panel
instructionPanel5.appendChild(panel5Header);
instructionPanel5.appendChild(instructionPanel5Container);
///////////////////////////////

// Add panels
instruction_div.appendChild(instructionPanel1);
instruction_div.appendChild(instructionPanel2);
instruction_div.appendChild(instructionPanel3);
instruction_div.appendChild(instructionPanel4);
instruction_div.appendChild(instructionPanel5);

// COMPREHENSION CHECK
var instructionCheck = document.createElement('div');
instructionCheck.setAttribute('class', 'instructionPanel');

var instructionCheckHeader = document.createElement('h3');
instructionCheckHeader.innerHTML = 'Before you start';
instructionCheck.appendChild(instructionCheckHeader);

var instructionCheckText = document.createElement('div');
instructionCheckText.setAttribute('class', 'instructionCheckText');
instructionCheckText.innerHTML = 'To check you have understood the instructions, please answer this question:<br><br>' + 
'<b>Which color warning beacon means there is a hole in the asteroid belt ahead?</b>';
instructionCheck.appendChild(instructionCheckText);

var instructionCheckOutcomeText = document.createElement('div');
instructionCheckText.setAttribute('class', 'instructionCheckText');
instructionCheck.appendChild(instructionCheckOutcomeText);

var instructionForm = document.createElement('form');

// Start button
var startButton = document.createElement('button');
startButton.setAttribute('class', 'submit_button')
startButton.setAttribute('id', 'start');
startButton.innerHTML = 'Start Game';
startButton.onclick = check_consent;

// ANSWER 1
var answer1Container = document.createElement('div');
var checkLabel1 = document.createElement("label");

var checkAnswer1 = document.createElement("input");
checkAnswer1.setAttribute("type", "radio");
checkAnswer1.setAttribute("name", "answer");
checkAnswer1.setAttribute("value", "option A");
checkAnswer1.setAttribute('active', true);

answer1Container.appendChild(checkAnswer1);
checkLabel1.onclick = function () {
    checkLabel1.style.background = '#c71b00';
    checkAnswer1.checked = true;
    instructionCheckOutcomeText.innerHTML = 'Incorrect, check the instructions and try again!'
}
checkLabel1.appendChild(document.createTextNode('The yellow beacon'));
answer1Container.appendChild(checkLabel1);

instructionForm.appendChild(answer1Container);

// ANSWER 2
var answer2Container = document.createElement('div');
var checkLabel2 = document.createElement("label");

var checkAnswer2 = document.createElement("input");
checkAnswer2.setAttribute("type", "radio");
checkAnswer2.setAttribute("name", "answer");
checkAnswer2.setAttribute("value", "option A");
checkAnswer2.setAttribute('active', true);

answer2Container.appendChild(checkAnswer2);
checkLabel2.onclick = function () {
    checkLabel2.style.background = '#c71b00';
    checkAnswer2.checked = true;
    instructionCheckOutcomeText.innerHTML = 'Incorrect, check the instructions and try again!'
}
checkLabel2.appendChild(document.createTextNode('The blue beacon'));
answer2Container.appendChild(checkLabel2);

instructionForm.appendChild(answer2Container);

// ANSWER 3
var answer3Container = document.createElement('div');
var checkLabel3 = document.createElement("label");

var checkAnswer3 = document.createElement("input");
checkAnswer3.setAttribute("type", "radio");
checkAnswer3.setAttribute("name", "answer");
checkAnswer3.setAttribute("value", "option A");
checkAnswer3.setAttribute('active', true);

answer3Container.appendChild(checkAnswer3);
checkLabel3.onclick = function () {
    checkLabel3.style.background = '#28c700';
    checkAnswer3.checked = true;
    instructionCheckOutcomeText.innerHTML = '';
    instructionCheckOutcomeText.appendChild(startButton);
}
checkLabel3.appendChild(document.createTextNode('It can change throughout the game'));
answer3Container.appendChild(checkLabel3);

instructionForm.appendChild(answer3Container);

// Invisible answer
var checkAnswerNULL = document.createElement("input");
checkAnswerNULL.setAttribute("type", "radio");

instructionCheck.appendChild(instructionForm);

instruction_div.appendChild(instructionCheck);

// Add instruction div
document.getElementById('consent').appendChild(instruction_div);




// document.getElementById('consent').innerHTML = 'Next you will play a game where you must fly a spaceship while avoiding asteroids<br><br>' + 
//     "<b>You may find this game quite difficult - it is designed to be a challenge!</b><br><br>" +
//     "The game will take around 10 minutes in total" +

//     "        <br><br>\n" +
//     "        <button type=\"button\" id=\"start\" class=\"submit_button\">Start Game</button>\n" +
//     "        <br><br>";


// document.getElementById("start").onclick = check_consent;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this experiment does not work on mobile devices");
    document.getElementById('consent').innerHTML = "";
}
