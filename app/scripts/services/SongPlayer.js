 (function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};
         
         /**
         * @desc Current album object with album properties and songs 
         * @type {Object}
         */
          var currentAlbum = Fixtures.getAlbum();
         
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
              
              currentBuzzObject.bind('timeupdate', function() {
                  $rootScope.$apply(function() {
                      SongPlayer.currentTime = currentBuzzObject.getTime();
                  });
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
          };
         
         /**
        * @function stopSong
        * @desc Stops playing currentBuzzObject and sets song playing property to false
        * @param {Object} song
        */
          var stopSong = function(song) {
              currentBuzzObject.stop();
              song.playing = null;
          };
         
         
         /**
        * @function getSongIndex
        * @desc Returns index of song from current album
        * @param {Object} song
        * @returns {Number} song index
        */         
          var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
          };

        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
          SongPlayer.currentSong = null;
         
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
         SongPlayer.currentTime = null;
         
         /**
        * @desc Current volume
        * @type {Number}
        */
         SongPlayer.volume = 10;
         
         /**
        * @desc Boolean if volume is muted
        * @type {Boolean}
        */
         SongPlayer.muted = false;
          
         /**
        * @desc Value to store previous volume
        * @type {Number}
        */
         SongPlayer.previousVolume = 60;
          
         
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
                     playSong(song);
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
          }
          
          /**
        * @function SongPlayer.previous
        * @desc Changes currently playing song to preceding song in current album
        */
          SongPlayer.previous = function(){
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex--;
              
              if (currentSongIndex < 0) {
                 stopSong(SongPlayer.currentSong)
              } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
              }
          }
          
          /**
        * @function SongPlayer.next
        * @desc Changes currently playing song to following song in current album
        */
          SongPlayer.next = function(){
              var currentSongIndex = getSongIndex(SongPlayer.currentSong);
              currentSongIndex++;
              
              if (currentSongIndex >= currentAlbum.songs.length) {
                 stopSong(SongPlayer.currentSong)
              } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
              }
          }
          
          /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
          SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
          };
         
         
          /**
         * @function setVolume
         * @desc Set volume to current song
         * @param {Number} volume
         */
          SongPlayer.setVolume = function(volume) {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(volume);
             }
          };
         
         /**
         * @function muteVolume
         * @desc Set volume to zero for current song
         */
          SongPlayer.muteVolume = function() {
             if (currentBuzzObject) {
                 SongPlayer.previousVolume = SongPlayer.volume;
                 currentBuzzObject.setVolume(0);
                 SongPlayer.volume = 0;
                 SongPlayer.muted = true;
             }
          };
         
         /**
         * @function unmuteVolume
         * @desc Set volume to previous volume for current song
         */
          SongPlayer.unmuteVolume = function() {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(SongPlayer.previousVolume);
                 SongPlayer.volume = SongPlayer.previousVolume;
                 SongPlayer.muted = false;
             }
          };
          
          
          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();