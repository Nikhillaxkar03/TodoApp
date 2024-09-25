import express from "express";
import fs from 'node:fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let fileData = [];
const generateId = () => {
    let charSet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]
    let id = "";
    for(let i=0; i<=14; i++) {
        id = id + charSet[Math.floor(Math.random()*charSet.length)];
    }
    return id;
}

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));

  fs.readFile('./file.json', 'utf-8', (err, data)=> {
        if(err) {
            throw err;
        }
        else{
            if(data.length > 0) {
                fileData = JSON.parse(data);
            }
            else{
                return;
            }
        }
    })


app.get('/', (req,res)=> {
    res.sendFile(__dirname + "/public/index.html")
})

app.get('/get-data', (req, res)=> {
    if(fileData.length > 0) {
    res.send(JSON.stringify(fileData, null, 2));
    }
    else {
        res.redirect('/');
    }
})

app.post('/add-todo', (req,res)=> {
    fileData.push({
        task: req.body.task,
        id: generateId()
    });
    updateFile(fileData);

    res.redirect("/");
})

app.delete('/delete-todo/:taskId' , (req, res)=> {
    const taskId = req.params.taskId;
    fileData = fileData.filter(e => {
        return e.id !== taskId;
    })
    updateFile(fileData);
    res.json({ success: true, message: 'Todo deleted' });
})

app.listen(3000, ()=> {
    console.log("server running at port 3000");
})


const updateFile = (data) => {
    fs.writeFile('./file.json', JSON.stringify(data, null, 2) , (err)=> {
        if(err) {
            throw err;
        }
        else{
            console.log('File updated');
        }
    })
}

