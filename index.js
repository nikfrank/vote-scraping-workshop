const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const rp = require('request-promise');
const cheerio = require('cheerio');

const calcTotals = (page)=> {
  let percentages = page('table.TableData')
                     .find('td:nth-child(4)')
                     .map((i, element)=> page(element).text())
                     .get()
                     .map(percentage => parseFloat(percentage));

  const parties = page('table.TableData')
                     .find('td:nth-child(2)')
                     .map((i, element)=> page(element).text())
                     .get();

  percentages = percentages.filter(p => p >= 3.25);

  const total = percentages.reduce((total, percent)=> total + percent, 0);

  let result = {};
  for( let i=0; i< percentages.length; i++){
    result[parties[i]] = Math.round(120 * (percentages[i]/ total));
  }

  return result;
};


app.get('*', (req, res)=> {

  rp('https://votes21.bechirot.gov.il/')
    .then(html => {
      const page = cheerio.load(html);
      const mandatim = calcTotals(page);

      res.json(mandatim);
    });
});

app.listen(port, ()=> console.log('running on '+port));
