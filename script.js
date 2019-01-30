// initialize library
var api = new MastodonAPI({
  instance: "https://toot.thoughtworks.com",
  api_user_token: ""
});

api.get('instance', {}, function(instance) {
  document.title = instance.title + ' toot wall';
  $('#instance').attr('href', 'https://' + instance.uri).text(instance.uri);
  $('.brand').attr('href', 'https://' + instance.uri)
});

api.get('timelines/public?local=true&limit=10', {}, function(local) {
  let list = $('#toot-list');
  for (var i = 0; i < local.length; i++) {
    list.slick('slickAdd', formatToot(local[i]));
  }
});

api.stream('public:local', function(data) {
  let list =  $('#toot-list');
  if (data.event === 'update') {
    list.slick('slickRemove', 9, false);
    list.slick('slickAdd', formatToot(data.payload), 0, true);
    list.slick('slickGoTo', 0);  
  }
});

var formatToot = function(toot) {
  console.log(toot);
  var media = function(toot) {
    if (toot.media_attachments.length > 0) {
      let media;
      if (toot.media_attachments[0].type === 'gifv') {
        media = '\
          <div data-component=\"MediaGallery\">\
            <div class="media-gallery">\
              <div class="media-gallery__item standalone" style="left: auto; top: auto; right: auto; bottom: auto; max-width: 500px; width: 100%; height: 100%;">\
                <div class="media-gallery__gifv">\
                  <video class=\"media-gallery__item-gifv-thumbnail\" aria-label="' + toot.media_attachments[0].description 
                    + '" title="' + toot.media_attachments[0].description + '" role="application" src="' + toot.media_attachments[0].url + '" loop autoplay >\
                  </video>\
                </div>\
              </div>\
            </div>\
          </div>';    
      } else { 
        media = '\
          <div data-component=\"MediaGallery\">\
            <div class="media-gallery">\
              <div class="media-gallery__item standalone" style="left: auto; top: auto; right: auto; bottom: auto; width: 100%; height: 100%;">\
                <img src="' + toot.media_attachments[0].preview_url + '" alt="' + toot.media_attachments[0].preview_url + '" title="' + toot.media_attachments[0].description + '" style="object-position: 50% 50%;">\
              </div>\
            </div>\
          </div>';
      }
      return media; 
    }
    return '';
  }
  let author = '<div class="p-author h-card">\
      <a class="detailed-status__display-name u-url" rel="noopener" href="' + toot.account.url + '">\
        <div class="detailed-status__display-avatar">\
          <img alt="" class="account__avatar u-photo" src="'+ toot.account.avatar +'" width="64" height="64">\
        </div>\
        <span class="display-name">\
          <bdi>\
            <strong class="display-name__html p-name emojify">' + twemoji.parse(toot.account.display_name, { className: "emojione" }) + '</strong>\
          </bdi>\
          <span class="display-name__account">@' + toot.account.username + '</span>\
        </span>\
      </a>\
    </div>';
  let meta = '<div class="detailed-status__meta">\
      <data class="dt-published" value="' + toot.created_at + '"></data>\
      <a class="detailed-status__datetime u-url u-uid" rel="noopener" href="' + toot.uri + '">\
        <time class="formatted" datetime="' + toot.created_at + '" title="' 
          + moment(toot.created_at).format('MMMM Do YYYY, h:mm a') + '">'
          + moment(toot.created_at).format('MMMM Do YYYY, h:mm a') + '</time>\
      </a>·\
      <a class="modal-button detailed-status__link" href="#">\
        <i class="fa fa-reply"></i><span class="detailed-status__reblogs">' + toot.replies_count + '</span>\
      </a>·\
      <a class="modal-button detailed-status__link" href="#">\
        <i class="fa fa-retweet"></i><span class="detailed-status__reblogs">' + toot.reblogs_count + '</span>\
      </a>·\
      <a class="modal-button detailed-status__link" href="#">\
        <i class="fa fa-star"></i><span class="detailed-status__favorites">' + toot.favourites_count + '</span>\
      </a>\
    </div>';
  let node = '\
    <div class=\"activity-stream h-entry\">\
      <div class="entry entry-center">\
        <div class="detailed-status detailed-status--flex">'
          + author +
          '<div class="status__content emojify">\
            <div class="e-content" style="display: block; direction: ltr" lang="en">' + twemoji.parse(toot.content, { className: "emojione" }) + '</div>\
          </div>'
          + media(toot)
          + meta +
        '</div>\
      </div>\
    </div>';
  return node;
}

$(document).ready(function(){
  $('#toot-list').slick({
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    fade: true
  });
});







