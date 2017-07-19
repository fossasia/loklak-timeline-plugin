/*******************************************************************************
 * loklak-fetcher-client
 * 	by Yago González (C) 2016 - Under MIT license
 * 	Bugs? Questions? Don't know what's the meaning of life?
 * 	Take a look at: github.com/YagoGG/loklak-fetcher-client
 *  Please, keep this header if you want to use this code. Thank you ;)
 ******************************************************************************/

window.loklakFetcher = (function() {
  var script = null;

  var loklakFetcher = {
    /**
     * Fetches tweets from the public loklak API, with the options provided
     * @param  {string}   query    Query string, see loklak.org/api.html
     * @param  {object}   options  Object with allowed GET-attributes, see
     *                             loklak.org/api.html
     * @param  {function} callback Function called after getting the results.
     *                             These are passed as first argument
     */
    getTweets: function(query, options, callback) {
      if(typeof options === 'function') { // A callback has been provided as 2nd
                                          // argument (no options)
        callback = options;
        options = {};
      } else if(callback === undefined) { // No callback has been provided, even
                                          // as 2nd argument
        throw new Error('[LOKLAK-FETCHER] No callback provided');
      }

      var settings = [ 'count', 'source', 'fields', 'limit', 'tzOffset',
        'minified' ];  // Field names for all the possible parameters
      var defaults = [ 100, 'cache', '', '', 0, true ];  // Default values

      // Check if no options have been provided
      if(typeof options === 'undefined') {
        options = {}; // Create 'options' to avoid ReferenceErrors later
      }

      // Write unset options as their default
      for(var index in settings) {
        if(options[settings[index]] === undefined) {
          options[settings[index]] = defaults[index];
        }
      }

      // Create the URL with all the parameters
      var url = 'http://35.188.41.86/api/search.json' +
        '?callback=loklakFetcher.handleData' +
        '&q=' + query +
        '&count=' + options.count +
        '&source=' + options.source +
        '&fields=' + options.fields +
        '&limit=' + options.limit +
        '&timezoneOffset=' + options.tzOffset +
        '&minified=' + options.minified;

      // If the script element for JSONP already exists, remove it
      if(script !== null) {
        document.head.removeChild(script);
      }

      /**
       * Invokes the callback function, passing the data from the server as the
       * first and only argument.
       * @param  {object} data JSON coming from loklak's API
       */
      this.handleData = function(data) {
        callback(data);
      };

      // Create the script tag for JSONP
      script = document.createElement("script");
      script.src = url;
      document.head.appendChild(script);
    }
  };

  return loklakFetcher;
}());



document.addEventListener('DOMContentLoaded', function () {
  function addCss(fileName) {

  var head = document.head
    , link = document.createElement('link')

  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = fileName

  head.appendChild(link)
  }
  addCss('https://sch00lb0y.github.io/loklak-timeline-plugin/style.css')
  let elements = document.getElementsByClassName("loklak-timeline")
  for(let i = 0; i < elements.length; i++) {
    (function (element){
    let query = element.dataset.query;
    if (element.dataset.height !== undefined) {
      element.style.height = element.dataset.height + 'px';
    }
    if (element.dataset.width !== undefined) {
      element.style.width = element.dataset.width + 'px';
    }
    loklakFetcher.getTweets(query, {
      count: 25
    }, function (result) {
      let tweets = result.statuses.map((x) => ({text: x.text, user: x.user, others:x}));
      let html = "";
      tweets.forEach(function (tweet) {
        html += `<div class="tweet"><a href="https://twitter.com/${tweet.user.screen_name}"><img src=${tweet.user.profile_image_url_https}/><span>${tweet.user.name}</span></a><h4>${tweet.text}</h4><br/>${(tweet.others.images_count>0)?'<img class="tweet-image" src=\"'+tweet.others.images[0]+'\"/>':''}</div>`;
      })
      element.innerHTML = html;
    })
    }(elements[i]))
  }
}, false);
