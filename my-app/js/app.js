
var ipc     = require('ipc')
  , Player  = require('./js/player');

var player = new Player('./my-app/Early Riser.mp3');
player.getID3(displayMP3Title);

player.on('playing',function(item){
  Equalizer.show();
  console.log('im playing... src:' + item);
});

player.on('playend',function(item){
  Equalizer.hide();
  console.log('src:' + item + ' play done');
});

player.on('stopped',function(item){
  Equalizer.hide();
  console.log('src:' + item + ' play stopped');
});

// equalizer
var Equalizer  = {
  init: function(){
    this.bars = new Array();
    this.resize();
    this.addBars();
    this.x = 0;
    this.on = false;
    //setInterval(_.bind(this.render, this), 120);
    setInterval(this.render.bind(this), 120);
    $(window).resize(this.resize);
    $('.bar').css({'width': this.w / 100, 'margin-left': this.w / 50});
  },

  resize: function(){
    //this.h = $(window).height();
    this.h = $('#equalizer').height();
    this.w = $(window).width();
    //$('#equalizer').width(this.w).height(this.h);
    $('.bar').css({'width': this.w / 100, 'margin-left': this.w / 50});
  },

  addBars: function(){
    for (var i = 0; i < 10; i++){
      var b = $('<div class="bar"><div class="fill"></div></div>');
      this.bars.push(b);
      $('#equalizer').append(b);
    }
  },

  render: function(){
    if (this.on) {
      for (var i = 0; i < this.bars.length; i++){
        var b = this.bars[i];
        $(b).height(this.h + 20);
        var height = /*Math.sin(this.x++)*100+180;*/ (this.h-30) / Math.floor((Math.random()*10)+1);
        $(b).find('.fill').css({'height': height, 'top':(this.h-20) - height});
      }
    }
  },

  show: function() {
    this.on = true;
  },

  hide: function() {
    this.on = false;
  }
};

Equalizer.init();

$(window).resize(function(){
  Equalizer.resize();
});

document.getElementById('btn-play').onclick = function() {
  player.play(function (err, player) {
    console.log('playend!');
  });
};

document.getElementById('btn-stop').onclick = function() {
  player.stop();
};

document.getElementById('btn-file').onclick = function() {
  ipc.send('asynchronous-message', 'select-file');
};

ipc.on('asynchronous-reply', function(arg) {
  //TODO : chek if file exists and it is  mp3 file
  player.song = arg;
  player.getID3(displayMP3Title);
});

function displayMP3Title(ID3) {
  $('#lbl-mp3').text(ID3.title);
}

