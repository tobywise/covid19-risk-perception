// console.log('aa');
$.getJSON('questionnaire_json.json', function(result) {
    // Sentry
    Sentry.init({ dsn: 'https://858581c7c8234dd393241da13da4f94b@sentry.io/1340805' });

    // Firebase
    // firebase.firestore().enablePersistence()
    // .catch(function(err) {
    // if (err.code == 'failed-precondition') {
    //     // Multiple tabs open, persistence can only be enabled
    //     // in one tab at a a time.
    //     // ...
    // } else if (err.code == 'unimplemented') {
    //     // The current browser does not support all of the
    //     // features required to enable persistence
    //     // ...
    // }
    // });

    firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        });
        
    var uid;
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var isAnonymous = user.isAnonymous;
          uid = user.uid;
            } 
        });
        
    var db = firebase.firestore();

    ////////////////
    // Task stuff //
    ////////////////

    // Function to get Prolific ID
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

    if (window.location.search.indexOf('PROLIFIC_PID') > -1) {
        var subjectID = getQueryVariable('PROLIFIC_PID');
    }
    else {
        var subjectID = Math.floor(Math.random() * (2000000 - 0 + 1)) + 0; // if no prolific ID, generate random ID (for testing)
    }

    // GET CONDITION AND PHASE
    var condition = getQueryVariable('CONDITION');
    var phase = 'T1';
    if (window.location.search.indexOf('PHASE') > -1) {
        var phase = getQueryVariable('PHASE');
    }
    var phase_string = '';
    if (phase != 'T1') {
        phase_string = phase;
    }
    var new_questions = [];

    for (var i=0;i<result['questions'].length;i++) {
        if (result['questions'][i].phase.includes('ALL')) {
            new_questions.push(result['questions'][i]);
        }
        else if (result['questions'][i].phase.includes(phase)) {
            new_questions.push(result['questions'][i]);
        }
    }

    var country = '';
    var region = '';
    // var subjectID = '23';


    function ipLookUp () {
        $.get("https://ipinfo.io?token=0531e8937967f1", function(response) {
            country = response.country;
            region = response.region;
            // console.log(region);
          }, "jsonp")
      }
      ipLookUp()


    //


    var instructions = {
        type: 'instructions',
        pages: [
            '<b>Welcome to the study</b><br><br>Thank you for choosing to take part in this study on perceptions of coronavirus. ' +
            'First, we are going to ask you a set of questions. After this, you will be asked to complete two short tasks.<br><br>' +
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {

            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                selectedState: jsPsych.data.get().last(1).select('selectedState').values[0],
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t2 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this follow-up study!<br><br>' +
            'The responses you provided previously have been very helpful and we have learned a lot about how people are responding to the coronavirus situation. We also want to see how ' + 
            'responses change over time as the situation progresses, which is why we are asking to you to complete the survey again.<br><br>We greatly appreciate you taking the time to take part in this research!',
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t4 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this study again!<br><br>' +
            'This is now the fourth week we have run this survey, and your responses are giving us a lot of insight into how people are responding as the situation evolves.' +
            '<br><br>We appreciate you taking the time to take part in this research, particularly at this difficult time - thank you!', 
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t5 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this study again!<br><br>' +
            'This is now the fifth week we have run this survey, and your responses are giving us a lot of insight into how people are responding as the situation evolves.' +
            '<br><br>We appreciate you taking the time to take part in this research, particularly at this difficult time - thank you!', 
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t6 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this study again!<br><br>' +
            'This is now the 6th week we have run this survey, and your responses are giving us a lot of insight into how people are responding as the situation evolves.' +
            '<br><br>We appreciate you taking the time to take part in this research, particularly at this difficult time - thank you!', 
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t7 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this study again!<br><br>' +
            'This is now the 7th week we have run this survey, and your responses are giving us a lot of insight into how people are responding as the situation evolves.' +
            '<br><br>We appreciate you taking the time to take part in this research, particularly at this difficult time - thank you!', 
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    var instructions_t8 = {
        type: 'instructions',
        pages: [
            '<b>Welcome back!</b><br><br>Thank you for returning to take part in this study again!<br><br>' +
            'This is now the 8th week we have run this survey, and your responses are giving us a lot of insight into how people are responding as the situation evolves.' +
            '<br><br>We appreciate you taking the time to take part in this research, particularly at this difficult time - thank you!', 
            'These questions focus on your reactions to the global coronavirus situation. Please try to answer them as best you can, even if you feel that you do not know enough to provide an accurate answer.<br><br>' +
            'Most of these questions will ask you to provide a rating on a scale - just click on the bar to provide your rating. You can then adjust your rating if you wish.'
        ],
        show_clickable_nav: true,
        on_finish: function() {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                condition: condition,
                phase: phase
              })
        }
    }

    //
    var state_select = {
        type: 'state-select',
        show_clickable_nav: true,
        on_finish: function() {
            // console.log(jsPsych.data.get().last(1).select('selectedState').values[0]);
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).set({
                subjectID: subjectID,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                country: country,
                region: region,
                selectedState: jsPsych.data.get().last(1).select('selectedState').values[0],
                condition: condition,
                phase: phase
              })
        }
    }

    var question_trial = {
        type: 'html-multi-response',
        timeline: new_questions,
        on_finish: function () {
            db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).update({
                trial_data: jsPsych.data.get().json(),
              })
        }
    };

    var next_task = {
        type: 'instructions',
        pages: [
            'Now we are going to move on to another task. Click below to begin'
        ],
        show_clickable_nav: true,
    }

    var virus_questionnaire = [];
    if (phase == 'T2' | phase == 'T3') {
        virus_questionnaire.push(instructions_t2);
    }
    else if (phase == 'T4') {
        virus_questionnaire.push(instructions_t4);
    }
    else if (phase == 'T5') {
        virus_questionnaire.push(instructions_t5);
    }
    else if (phase == 'T6') {
        virus_questionnaire.push(instructions_t6);
    }
    else if (phase == 'T7') {
        virus_questionnaire.push(instructions_t7);
    }
    else if (phase == 'T8') {
        virus_questionnaire.push(instructions_t8);
    }
    else {
        virus_questionnaire.push(instructions);
        virus_questionnaire.push(state_select);
    }
    
    
    virus_questionnaire.push(question_trial);

    if (condition == 'BOTHTASKS') {
        virus_questionnaire.push(next_task);
    }
    if (condition == 'T2ONLY') {
        virus_questionnaire.push(next_task);
    }

    $( document ).ready(function() {
        jsPsych.init({
            timeline: virus_questionnaire,
            on_finish: function() {
                db.collection("tasks").doc('virus_study' + phase_string).collection('subjects').doc(uid).update({
                    trial_data: jsPsych.data.get().json()
                })
                if (condition == 'QONLY') {
                    window.location.href = 'end_screen.html'
                }
                else if (condition == 'T2ONLY') {
                    window.location.href = 'gamble_task.html?PROLIFIC_PID=' + subjectID + '&CONDITION=' + condition + '&UID=' + uid;
                }
                else if (condition == 'BOTHTASKS') {
                    window.location.href = 'spaceship_game/index.html?PROLIFIC_PID=' + subjectID + '&CONDITION=' + condition + '&UID=' + uid;
                }
            }
        })
    })

})


