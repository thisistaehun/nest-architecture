export function crawlVideos($: cheerio.Root) {
  const videos = [];
  const allVideos = $('.__se_module_data').length;
  for (let i = 0; i <= allVideos; i++) {
    const video = $(`.__se_module_data:eq(${i})`).attr('data-module');
    if (video) {
      videos.push(video);
    }
  }
  return videos;
}
