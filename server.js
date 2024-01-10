const express = require('express')
const path = require('path')
const app = express()

app.use('/favicon.ico', express.static(__dirname + '/favicon.ico'))
app.use('/images', express.static(__dirname + '/images'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/data', express.static(__dirname + '/data'))
app.use('/js', express.static(__dirname + '/js'))

// 首頁
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})
 
app.listen(3008)
