export function crawlContents($: cheerio.Root) {
  let stringContents = '';
  if (
    $('div.se-main-container p.se-text-paragraph').length !== 0 ||
    ($('div.post_ct > div').length !== 0 &&
      $('div#viewTypeSelector').text().length) < 10
  ) {
    if ($('div.se-main-container p.se-text-paragraph').length !== 0) {
      stringContents = $('div.se-main-container p.se-text-paragraph').text();
    } else if ($('div.post_ct > div').length !== 0) {
      stringContents = $('div.post_ct > div').text();
    } else if ($('div.postViewArea > div').length !== 0) {
      stringContents = $('div.postViewArea > div').text();
    } else {
      stringContents = $('#body div._postView div#viewTypeSelector')
        .text()
        .trim();
    }

    if ($('div.__se_code_view').text().length > 0) {
      stringContents += $('div.__se_code_view').text();
    }
  }

  const arrayContents = stringContents
    .split(/ |\(|\)/)
    .filter((el) => el !== '​' && el.length > 0);
  return { arrayContents, stringContents };
}
