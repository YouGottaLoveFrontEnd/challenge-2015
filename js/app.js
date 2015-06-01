/**
 * Created by Eyal Weiss for the YGLF Challenge
 */

'use strict';

(function ($) {

  $(function () {

    var $messages = $('.messages.bottom'),
      $logo = $('.logo'),
      $video = $('video'),
      $btns = $('button.btn'),
      $canvas = $("#captureCanvas"),
      canvas = $canvas[0],
      video = $video[0];

    // Show notification
    var notify = function (text, $target) {
      $target = $target || $messages;
      $target.children().each(function () {
        var $m = $(this);
        $m.removeClass('zoomInDown').addClass('zoomOutDown');
        setTimeout(function () {
          $m.remove();
        }, 1500);
      });
      if (text) {
        $target.append($('<span />', {class: 'message animated zoomInDown'}).text(text));
      }
    };

    // Reveal logo with animation
    var drawLogo = function () {
      var i = 0,
        initialDelay = 1000,
        letterDuration = 500;
      $logo.find('svg path')
        .each(function () {
          var path = this,
            length = path.getTotalLength();
          path.style.strokeDasharray = length + ' ' + length;
          path.style.strokeDashoffset = length;
          path.getBoundingClientRect();
          path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset ' + letterDuration + 'ms ease-in-out, fill ' + letterDuration + 'ms ' + letterDuration + 'ms linear';
          setTimeout(function () {
            path.style.strokeDashoffset = '0';
            path.style.fill = '#fff';
          }, initialDelay + (letterDuration / 2 * i++));
        });
      $logo.addClass('initialized');
    };

    // Find available video sources
    var getCameras = function (callback) {
      if (window.MediaStreamTrack && MediaStreamTrack.getSources) {
        MediaStreamTrack.getSources(function (sources) {
          var videoSources = sources.filter(function (source) {
            return source.kind === 'video';
          }).map(function (source) {
            return {id: source.id, label: source.label};
          });
          callback(videoSources);
        });
      } else {
        callback(null);
      }
    };

    // Request video stream
    var getVideoStream = function (source, callback) {
      var videoSettings = {
        video: {
          mandatory: {
            minWidth: 640,
            minHeight: 480
          },
          optional: [
            {minWidth: 800},
            {minHeight: 600}
          ]
        }
      };
      if (source) {
        videoSettings.video.optional.push({sourceId: source.id});
      }
      navigator.getUserMedia(videoSettings, function (stream) {
        callback(stream);
      }, function () {
        callback(null);
      });
    };

    // Say something nice about the taken photo
    var getRandomCompliment = function () {
      var compliments = ['So handsome!', 'OMG!!!', 'WOW!', 'Gorgeous!', 'HOT indeed!'];
      return compliments[Math.floor(Math.random() * compliments.length)];
    };

    // Start viewfinder
    var initCamera = function () {
      var cameraInitialized = false,
        availableFilters = 3,
        filterI = -1;

      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      var toggleFilter = function () {
        $logo.removeClass('filter-yglf-' + ((filterI % availableFilters) + 1))
          .addClass('filter-yglf-' + ((++filterI % availableFilters) + 1));
      };

      if (navigator.getUserMedia) {
        getCameras(function (videoSources) {
          var sourceIndex = 0;
          videoSources = videoSources || [];
          if (videoSources.length < 2) {
            $btns.filter('.switch-camera').css('display', 'none');
          }

          getVideoStream(videoSources[sourceIndex], function (stream) {
            cameraInitialized = true;

            if (stream) {
              toggleFilter();
              notify(false);
              $logo.addClass('viewfinder');
              $btns.children().addClass('fadeInRightButton');
              setTimeout(function () {
                $btns.children().removeClass('fadeInRightButton');
              }, 400);

              if (videoSources.length >= 2) {
                $btns.filter('.switch-camera').on('click', function () {
                  getVideoStream(videoSources[(++sourceIndex) % videoSources.length], function (newStream) {
                    if (newStream) {
                      if (stream) {
                        video.src = '';
                        stream.stop();
                      }
                      stream = newStream;
                      video.src = window.URL.createObjectURL(newStream);
                      video.play();
                    }
                  });
                });
              }

              video.src = window.URL.createObjectURL(stream);
              video.play();

              $btns.filter('.toggle-filter').on('click', toggleFilter);
              $btns.filter('.capture').on('click', function () {
                canvas.width = 800;
                canvas.height = 600;
                canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 800, 600);
                $('.captured').removeClass('zoomOutDown').addClass('tada');
                $logo.addClass('reviewing');
                setTimeout(function () {
                  notify(getRandomCompliment());
                }, 800);
              });
              $btns.filter('.close').on('click', function () {
                notify(false);
                $('.captured').removeClass('tada').addClass('zoomOutDown');
                setTimeout(function () {
                  $logo.removeClass('reviewing');
                  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                }, 1000);
              });
              $btns.filter('.download').on('click', function () {
                var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                window.location.href = image;
              });
            } else {
              notify('Your browser is blocking access to the camera =/');
            }
          });

        });
      } else {
        notify('getUserMedia() is not supported in your browser');
      }
      setTimeout(function () {
        if (!cameraInitialized) {
          notify('Please approve access to your camera!');
        }
      }, 6000);
    };

    // Main
    if (!window.chrome) {
      notify('Please run this on Chrome', $('.messages.top'));
    }
    $('#filtersContainer').load('/media/filters.svg', function () {
      $('.caption').load('/media/caption.svg', drawLogo);
      initCamera();
    });

  });

})(jQuery);