const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/search/title/?genres=' + 
    'action&title_type=feature&explore=genres&pf_rd_m=A2FGELUU' + 
    'NOQJNL&pf_rd_p=facfbd0c-6f3d-4c05-9348-22eebd58852e&pf_rd' +
    '_r=778Z7MKE4FC3B6RQ3MH9&pf_rd_s=center-6&pf_rd_t=15051&pf' + 
    '_rd_i=genre&ref_=ft_gnr_mvpop_1');
  
  const movieLinks = await page.evaluate(() => {
    const movieAnchors = document.querySelectorAll("h3 a");
    const movieAnchorsArray = [...movieAnchors];
    const movieLinks = movieAnchorsArray.map(({href}) => href);

    return movieLinks;
  });
 
  for (const link of movieLinks){
    await page.goto(link);

    const movieData = await page.evaluate(() => {
      const titleYear = document.querySelector('.title_wrapper h1') ? 
        document.querySelector('.title_wrapper h1').innerText : 
        'Undefinded (Undefined)'; // Titulo e ano de lançamento
      //Usar regex para separar o ano de lançamento do titulo do filme
      const titleYearSeparatorIndex = titleYear.match(/\(\d{4}\)/).index;
      const title = titleYear.slice(0, titleYearSeparatorIndex-1);
      const year = titleYear.slice(titleYearSeparatorIndex+1, titleYearSeparatorIndex+5);

      const plotSummary = document.querySelector('div.plot_summary') ? 
      document.querySelector('div.plot_summary').innerText.split('\n') : 
      'Undefined';
      const summary = plotSummary[0];
      const director = plotSummary[2].replace('Director: ', '');
      const writers = plotSummary[3].replace('Writers: ', '')
      .replace('Writer: ', '')
      .split(' | ')[0]
      .replace(/\s\(\w+\)/, '')
      .split(', ')
      .map(w => w.replace(/\s\(.+\)/, ''));
      const stars = plotSummary[4].replace('Stars: ', '')
      .split(' | ')[0]
      .split(', ');
      const runtime = document.querySelector('time') ? 
      document.querySelector('time').innerText.slice(0, -1) :
      'Undefined';
      
      return {
        title,
        year,
        summary,
        director,
        writers,
        stars,
        runtime
      };
    });

    fs.appendFile('imdb.txt', JSON.stringify(movieData, null, 2), (err) => {
      if (err) throw err;
      console.log('Movie data was appended to file!')
    })
    // console.log(movieData);
  }

  await browser.close();
})();