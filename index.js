var express = require('express');
const cors = require('cors');
require('dotenv').config();



var app = express();

app.use(cors());

app.get('/chatgpt',async function (req, res) {
  let previous = req.query.previous
  
  let InputValue = req.query.current
  
  let phrase =  `Tell me if the current word beats previous one and why(be difficult to be beatten,consistent),and each element photo url
  respone like api respone shcema 
    previous : ${previous},
    previousPhotoUrl :    ,
    current : ${InputValue} ,
    curentPhotoCurrent :   ,
    why :  
    beats(true or false) : `

    const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: phrase }],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VITE_CHAT_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log("Res:" , data.choices[0].message.content);
    res.send(data.choices[0].message.content); 
});

app.get('/photoUrl',async function (req, res) {

    let word = req.query.word
    console.log('reqphotourl:',req.query)

    let url = `https://api.unsplash.com/search/photos?query=${word}&page=1&per_page=10&client_id=${process.env.VITE_PHOTO_KEY}`;
    const response = await fetch(url);

    const data = await response.json();

    console.log("photo url" , data.results[0].urls.small)

    res.json(data.results[0].urls.small);
});


app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});