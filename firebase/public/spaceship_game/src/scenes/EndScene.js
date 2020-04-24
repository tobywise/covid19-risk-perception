class EndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'EndScene',
        });
    }

    init(data) {
        this.scoreVal = data.score;
        this.topScore = data.topScore;
        this.game = data.game;
    }


    create() {

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
    
        // GET CONDITION
        var condition = getQueryVariable('CONDITION');
        var uid = getQueryVariable('UID');

        this.text = this.make.text();
        this.text.x = 130;
        this.text.y = 250;
        this.text.setText('End of the task!\n\n\n\nTop score: ' + this.topScore +
            '\n\n\nClick here to finish the task');
        this.text.setAlign('center');
        this.saveData();
        this.text.setInteractive();
        this.text.on('pointerup', function() {
            if (condition == 'SPACESHIP') {
                window.location.href = '../end_screen.html';
            }
            else if (condition == 'BOTHTASKS') {
                window.location.href = '../gamble_task.html?PROLIFIC_PID=' + subjectID + '&CONDITION=' + condition + '&UID=' + uid;
            }
        });
    }

    update() {
    }


    saveData() {

        var docRef = this.cache.game.db.collection("tasks").doc('virus_study_spaceship_game').collection('subjects').doc(this.cache.game.uid);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        console.log(this.cache.game.data);
        this.cache.game.db.collection("tasks").doc('virus_study_spaceship_game').collection('subjects').doc(this.cache.game.uid).update(this.cache.game.data);

    }

}

export default EndScene;