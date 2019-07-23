const express = require('express');
const app = express();

const rp = require('request-promise');

const cheerio = require('cheerio');

const calcMandatim = (page)=>{
  const percentages =
    page('table.TableData td:nth-child(4)')
      .map((i, td)=> page(td).text())
      .get();

  const parties =
    page('table.TableData td:nth-child(2)')
      .map((i, td)=> page(td).text())
      .get();


  const madeTheCut = percentages.map(p => parseFloat(p))
                                .filter(p => p >= 3.25);

  const total = madeTheCut.reduce((sum, p)=> sum + p, 0);
  
  let result = {};

  for( let i = 0; i < madeTheCut.length; i++ ){
    result[ parties[i] ] = Math.round( 120 * madeTheCut[i] / total );
  }
  
  return result;
};


app.get('*', (req, res)=>{

  rp('https://votes21.bechirot.gov.il/')
    .then(html => {
      const page = cheerio.load(html);
      const mandatim = calcMandatim(page);
      
      res.json(mandatim);
    });
});

app.listen(4000, ()=> console.log('server running'));
