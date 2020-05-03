class GameOver extends Phaser.Scene {

    init(data) {
        this.scoreVal = data.score;
        this.topScore = data.topScore;
        this.game = data.game;
    }

    create() {

        
        this.cache.game.player_trial += 1;
        this.gameOverText = this.make.text({    
            style: {
            font: '50px Bungee Shade',
            fill: 'white',
        }})
        this.gameOverText.x = 400;
        this.gameOverText.y = 100;
        this.gameOverText.originX = 0.5;
        this.gameOverText.originY = 0.5;
        this.gameOverText.setText('GAME OVER');
        this.gameOverText.setAlign('center');

        this.text = this.make.text({    
            style: {
            font: '15px Rubik',
            fill: 'white',
        }});
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        this.text.setText('Your score: ' + this.scoreVal + '\n\nTop score: ' + this.topScore +
            '\n\n\nPress space to play again!\n\nThe game will continue until you pass 80 asteroid belts\n\nin total, regardless of how many times you see this screen\n\nThis should take about 10 minutes in total');
        this.text.setAlign('center');
        this.saveData();

    }

    update() {

        var cursors = this.input.keyboard.createCursorKeys();

        if (cursors.space.isDown) {
            cursors.space.isDown = false;
            if (this.game == 'game') {
                this.scene.start('GameScene', {score: this.scoreVal});
            }
            else if (this.game == 'avoidance') {
                this.scene.start('AvoidanceScene', {score: this.scoreVal});
            }
        }
    }

    saveData() {

        var docRef = this.cache.game.db.collection("tasks").doc('virus_study_spaceship_gameT9').collection('subjects').doc(this.cache.game.uid);

        docRef.update({
            trial_data: this.cache.game.data
        })

        this.cache.game.db.collection("tasks").doc('virus_study_spaceship_gameT9').collection('subjects').doc('completed_subs').update({
            started_subs: firebase.firestore.FieldValue.arrayUnion(this.cache.game.subjectID),
        })


    }
}

export default GameOver;