# Vote Scraping with node

in this project, we're going to start from absolute scratch

```

to bake a cake from scratch, one must first create the universe

                  -- r p feynman

```

we will get the vote totals from an Israeli government website, and calculate the seats those parties would receive in the knesset


```

garbage in, garbage out

                   -- r p feynman

```

surely I'm joking... time to get started


## getting started

we all have node working from before of course, so we can make a new project very easily


`$ cd ..`

or

`$ cd ~/code`

we're now in our `code` directory

`$ mkdir israel-vote`

`$ cd israel-vote`

`$ npm init -y`

now we have a file called `package.json` which means our directory is a javascript project.


what we'll do next is install all of the other javascript projects (aka npm modules) that ours will use


## installing other javascript projects

we'll use `npm` to install code that other people wrote that we want to use to make our project run

`$ npm i -S express cheerio request request-promise`

let's break that down, see what each of those dependencies do


### express

expressJS is THE framework for making APIs in nodeJS. Basically everyone and their bubbe use express.


### cheerio

cheerio is THE framework for scraping html pages. It gives you most of the power of browser side programming on the server (where we scrape)


### request request-promise

these are THE modules we use to make requests to other servers

express is THE module for people making requests to us... request and request-promise allow us to make requests to other servers



## index.js

let's make a server already!

`$ touch index.js`

great, we have somewhere to write our server

let's open up the file we made eh!

<sub>./index.js</sub>
```js
const express = require('express');
const app = express();

app.get('*', (req, res)=>{
  res.json({ great: 'success' });
});

app.listen(4000, ()=> console.log('server running'));
```


let's break it down:

```js
const express = require('express');
```

this is how we import code on the server (using the `require` function)


```js
const app = express();
```

here we use the `express` module to make a new API application (aka app)

```js
app.get('*', (req, res)=>{
  res.json({ great: 'success' });
});
```

here we say that on any (`'*'`) request to our server with a GET request (`.get`) we will respond by calling a function `(req, res)=> { ... }`

that function is the standard express ROUTE HANDLER signature

we get a `req` request object and `res` and response object from express; using these, we will understand the request being made and respond appropriately

`req.json({ great: 'success' })` is how we respond... now we always respond with something that borat says.

our job now will be to replace this Sasha Baron Cohen IP infringement with an actual javascript function which requests the page with the votes and scrapes the data out of it


## running the server

we want to test that our code works... let's run our server!

`$ node index.js`

now when we go to [localhost:4000](http://localhost:4000) we should see `{ great: 'success' }`



## requesting the page

we should get the government page to grab the vote percentages out of already eh?


<sub>./index.js</sub>
```js
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
```

now we can kill our server (ctrl + c in the shell) and run it again `$ node index.js`

now when we load up [localhost:4000](http://localhost:4000) we'll see the html from the government pull up!


now that we have the html, we ca use cheerio to find (aaaaaaaaand scrape) the data we want from the internet!

let's inpect the page in the browser now to figure out where the data we want is

...


we should find the percentages in `table.TableData td:nth-child(4)`

and the vote slips in `table.TableData td:nth-child(2)`


## cheerio chap!


let's `require` (aka import) the scraping library we installed earlier

<sub>./index.js</sub>
```js
const express = require('express');
const app = express();

const rp = require('request-promise');

const cheerio = require('cheerio');

//...
```

so now we can pass our `html` response from the government site to `cheerio`


<sub>./index.js</sub>
```js
//...

app.get('*', (req, res)=>{

  rp('https://votes21.bechirot.gov.il/')
    .then(html => {
      const page = cheerio.load(html);
      
      res.end(html);
    });
});

//...
```


now we can make a function which will calculate the mandatim and return them in the response


<sub>./index.js</sub>
```js
const express = require('express');
const app = express();

const rp = require('request-promise');

const cheerio = require('cheerio');

const calcMandatim = (page)=>{
  return {};  
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
```


## the actual scraping

now we get to use the cheerio API to grab the data out of the page

### percentages

we want to select the `td`s we found earlier, and grab their text

<sub>./index.js</sub>
```js
//...

const calcMandatim = (page)=>{
  const percentages = page('table.TableData td:nth-child(4)')
                       .map((i, td)=> page(td).text())
                       .get();

  
  return {};  
};

//...
```

let's break that down

```js
 page('table.TableData td:nth-child(4)')
```

here we're using a CSS selector to query for the table divs (td) that we want

```js
   .map((i, td)=> page(td).text())
```

here we use the `.map` function from cheerio (which is backwards) to convert each of the tds

then we use the `.text` function to grab the text out of the td


```js
   .get();
```

here we tell cheerio that we're done querying, and we want a normal JS value back.


### vote slips

we can do almost the exact same thing to get the party vote slips scraped out of the document


<sub>./index.js</sub>
```js
//...

  const parties = page('table.TableData td:nth-child(2)')
                    .map((i, td)=> page(td).text())
                    .get();

//...
```


this time though, we'll grab the second child tds, which have the data we want


### testing the scraped output

if we want to check that our scraping is working, let's return our `percentages` and `parties` and [pull them up in the browser](http://localhost:4000)


<sub>./index.js</sub>
```js
  return { percentages, parties };
```


## calculating the mandates


### cut

first let's apply the 3.25% cut

<sub>./index.js</sub>
```js
  const madeTheCut = percentages.map(p => parseFloat(p))
                                .filter(p => p >= 3.25);

```

first, we map the values (which are strings) into floats (decimal values) using javascript's `parseFloat` function (which will ignore the % sign)

then we filter for only the parties which have more than 3.25%


### total qualifying votes


here we're going to use my favorite function in javascript: reduce

we'll use it to add up all the percentages of qualifying parties

<sub>./index.js</sub>
```js
  const total = madeTheCut.reduce((sum, p)=> sum + p, 0);
```

then we'll use that total as a basis to split the seats


### final results

the math we will use to calculate the number of seats a party gets is

```
120 * percentage party received / total qualifying votes percentage
```

this ignores some vote sharing rules which exist in our system, but that's ok - our job is to provide a good enough estimate on a live site

we will calculate the seat totals and save them into an object to send back to the front end


<sub>./index.js</sub>
```js
  let result = {};

  for( let i = 0; i < madeTheCut.length; i++ ){
    result[ parties[i] ] = Math.round( 120 * madeTheCut[i] / total );
  }
  
  return result;
}
```

now when we run our server, and navigate to [localhost:4000](http://localhost:4000) we should see the results of our election!





```

On these field of friendly strife, are sewn the seeds that on other days, on other fields, shall bear the fruit of victory.

                  --  Douglas .MacArthur

```
