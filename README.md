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




```

On these field of friendly strife, are sewn the seeds that on other days, on other fields, shall bear the fruit of victory.

                  --  Douglas .MacArthur

```
