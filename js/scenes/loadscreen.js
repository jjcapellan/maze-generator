class LoadScreen extends Phaser.Scene {
    constructor() {
      super('loadScreen');
    }
  
    preload() {    
  
      this.load.on('complete',function(){
          console.log('load complete');
          this.scene.launch('demo',{tilesize:30});
          this.scene.start('gui');
      }, this);  
      
      this.load.image('floor', 'assets/atlas/floor.png');
      this.load.image('wall', 'assets/atlas/wall.png');  
      this.text_loading = this.add.text(800, 500,'Loading ...');
      this.load.on('progress', this.updateText, this);
      
    }
  
    updateText(progress){
        this.text_loading.text = `Loading ... ${Math.round(progress*100)}%`;
    }
  }