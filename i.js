const express = require('express');
const app = express();

const rp = require('request-promise');

app.get('*', (req, res)=>{

  rp('https://votes21.bechirot.gov.il/')
    .then(html => {
      res.end(html);
    });
});

app.listen(4000, ()=> console.log('server running'));
