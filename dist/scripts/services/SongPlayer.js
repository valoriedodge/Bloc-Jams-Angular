 (function() {
     function SongPlayer() {
          var SongPlayer = {};
         
         
         /**
         * @desc Buzz object audio file
         * @type {Object}
         */
          var currentBuzzObject = null;
         
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
          var setSong = function(song) {
              if(currentBuzzObject){
                  currentBuzzObject.stop();
                  SongPlayer.currentSong.playing = null;
                  song.playing = null;
              }
              
              currentBuzzObject = new buzz.sound(song.audioUrl, {
                  formats: ['mp3'],
                  preload: true
              });
              
              SongPlayer.currentSong = song;
          };
         
         
         /**
        * @function playSong
        * @desc Starts playing currentBuzzObject and sets song playing property to true
        * @param {Object} song
        */
          var playSong = function(song) {
              currentBuzzObject.play();
              song.playing = true;
              SongPlayer.currentSong.playing = true;
          };
         
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
          SongPlayer.currentSong = null;
          
         
        /**
        * @function SongPlayer.play
        * @desc Checks if song is set as current song, if not, calls setSong and playSong with new song, otherwise plays song
        * @param {Object} song
        */
          SongPlayer.play = function(song) {
              song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
                  
              } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                     currentBuzzObject.play();
                 }
              } 
          };
        
        /**
        * @function SongPlayer.pause
        * @desc Pauses currently playing song and sets song playing property to false
        * @param {Object} song
        */
          SongPlayer.pause = function(song){
              song = song || SongPlayer.currentSong;
              currentBuzzObject.pause();
              song.playing = false;
              SongPlayer.currentSong.playing = false;
          }
          
          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', SongPlayer);
 })();