export function crawlTitle($: cheerio.Root) {
  let title = '';
  if ($('div.se-title-text').text().length !== 0) {
    title = $('div.se-title-text').text();
  } else if ($('div.post_ct > h3').text().length !== 0) {
    title = $('div.post_ct > h3').text();
  }
  // 공백 제거
  title = title.replace(/\n/gi, '').replace(/\t/gi, '').trim();
  return title;
}
