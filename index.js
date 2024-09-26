var express = require('express');
const cors = require('cors');
require('dotenv').config();


var app = express();

app.use(cors());

app.get('/chatgpt',async function (req, res) {
  let previous = req.query.previous
  
  let InputValue = req.query.current
  
  let phrase =  `Tell me if the current word beats previous one and why(pretend that is a real rock/paper/scissors game but using any word),and each element photo url
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

    try  {

    let word = req.query.word
    console.log('reqphotourl:',req.query)



    const res = await openai.images.generate({
        model: "dall-e-3",
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });



    let url = `https://api.unsplash.com/search/photos?query=${word}&page=1&per_page=10&client_id=${process.env.VITE_PHOTO_KEY}`;
    const response = await fetch(url);

    const data = await response.json();

    if (!data.results[0]){
         console.log("image not found")
         return res.json("https://media.istockphoto.com/id/1055079680/vector/black-linear-photo-camera-like-no-image-available.jpg?s=612x612&w=0&k=20&c=P1DebpeMIAtXj_ZbVsKVvg-duuL0v9DlrOZUvPG6UJk=");
    }

    if(data.results[0].urls.small){
    console.log("photo url" , data.results[0].urls.small)

    res.json(data.results[0].urls.small);
    }
   }
    catch (err) {
        console.log("Error",err)
    }
});


app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});