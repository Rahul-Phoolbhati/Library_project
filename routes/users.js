const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.send("hellpo this is user router");
})

router.get('/cool', (req,res,next)=>{
    res.send("<h1>You're so cool</h1>");
})

module.exports = router;