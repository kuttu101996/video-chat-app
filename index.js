const express = require("express");
const { Server } = require("socket.io")
const http = require("http")

const app = express()
const httServer = http.createServer(app)

const io = new Server(httServer)


httServer.listen(9999, ()=>{
    console.log("server at 9999")
})