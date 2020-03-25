const express = require('express')
const Conversation = require('../models/Conversation')
const auth = require('../middleware/auth')
const Smscode = require('../models/SMSCode');
var map = require('lodash.map');

const router = express.Router()

router.post('/api/v1/conversationstart',auth,async(req, res) =>{
     res.setHeader("Content-Type", "application/json");
    	  const { senderID,recipientID } = req.body
        const conversation = await Conversation.findOneAndUpdate({senderID,recipientID},{updated_at:Date.now() });
        if (conversation != null) { 
                   var conversID = conversation._id
                 res.status(200).send({conversID :conversID});

        }else{
        	try{

        		const conversation = new Conversation(req.body)
                await conversation.save();

                if(conversation){
                	      var conversID = conversation._id
                 res.status(200).send({conversID :conversID});
                }

        	}catch (error) {
                res.status(400).send(error)
            }
        	
        }


});

router.get('/api/v1/conversationlist',auth,async(req,res)=>{
    res.setHeader("Content-Type", "application/json");
       const getuser = req.user[0]._id;
       const conversation = await Conversation.aggregate([{
            $match: {senderID:getuser}
           },{
            $lookup: {
                from: "users", // collection name in db
                localField: "recipientID",
                foreignField: "_id",
                as: "recipients"
            }
        },{
            $project:{
                _id:1,
                senderID:1,
                 "recipients._id":1,
                "recipients.fullname":1,
                "recipients.avatar":1,
                "recipients.phone":1
            }
        }]).exec(function(err, conversationlist) {
            // students contain WorksnapsTimeEntries
         
             res.status(200).send({success:1,data:conversationlist});
            
        });
     

})

module.exports = router