const { Socket } = require("dgram");
const express = require("express")
const http = require("http")
const {Server} = require("socket.io");

const io = new Server(8090, {
    cors: true
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on('connection', socket=>{
    console.log("User Connected with id: ", socket.id);
    socket.on('joining', (msg)=>{
        const {email, room} = msg;
        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmailMap.set(socket.id, email);
        io.to(room).emit('joined', {email, id: socket.id})
        socket.join(room)
        io.to(socket.id).emit('joining', msg)
    })

    socket.on('call', ({to, offer})=> {
        io.to(to).emit("incomingCall", {from: socket.id, offer})
    })

    socket.on('callAccepted', ({to, answer}) => {
        io.to(to).emit('callAccepted', { from: socket.id, answer})
    })

    socket.on("negotiation", ({to, offer}) => {
        io.to(to).emit('negotiation', { from: socket.id, offer})

    })

    socket.on('Nego:done', ({ to, answer}) => {
        io.to(to).emit('nego:final', { from: socket.id, answer})
        
    })
})