class GameOver extends Phaser.Scene {

    init(data) {
        this.scoreVal = data.score;
        this.topScore = data.topScore;
        this.game = data.game;
    }

    create() {

        
        this.cache.game.player_trial += 1;
        this.text = this.make.text();
        this.text.x = 400;
        this.text.y = 300;
        this.text.originX = 0.5;
        this.text.originY = 0.5;
        this.text.setText('Game Over!\n\nYour score: ' + this.scoreVal + '\n\nTop score: ' + this.topScore +
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

export default GameOver;