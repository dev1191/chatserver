const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const Smscode = require('../models/SMSCode');
var map = require('lodash.map');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('321290ATLzWOKf3XT5e5e8f93P1');


const router = express.Router()


router.post('/api/v1/register', async (req, res) => {
 res.setHeader("Content-Type", "application/json");
         const { phone } = req.body
        const userexists = await User.findOne({phone});
        if (userexists != null) {  
            const token = await userexists.generateAuthToken();
            const code = Math.floor(1000 + Math.random() * 9000);
            const usercode = await Smscode.findByID(code,userexists);
             var userID = userexists._id;
          //  sendOtp.send(phone, "WEBASI",code,function (error, data) {
            //  if(data.type == 'success'){
                 return res.status(200).send({userID,usercode,token});
            //  }
          //  });
        
        
        }
        else{
            // Create a new user
            try {
                 const user = new User(req.body)
                 await user.save()
                 const token = await user.generateAuthToken()
                var smscode = new Smscode({
                        users:user,
                        code: Math.floor(1000 + Math.random() * 9000)
                    })
                    smscode.save(function (err, smscode) {
                      if (err) return console.error(err);
                        var code = smscode.code;
                        var userID = user._id;
                       ///sendOtp.send(phone, "WEBASI",code,function (error, data) {
                          // if(data.type == 'success'){
                             res.status(200).send({ userID, token,code });
                          //  }
                        // })
                    });
        
            } catch (error) {
                res.status(400).send(error)
            }
        }

})


router.post('/api/v1/verify',auth,async(req, res) =>{
     res.setHeader("Content-Type", "application/json");
    try{
          const {code} = req.body;
          const usercode = await Smscode.findByCode(code,req.user);
          if (!usercode) {
            return res.status(400).send({error: 'OTP unmatched. try again.'})
        }
             res.send({success:1,message:usercode});
    } catch (error) {
        res.status(400).send({error: 'OTP unmatched. try again.'})
    }

});

router.post('/api/v1/profile',auth,async(req, res) =>{
     res.setHeader("Content-Type", "application/json");
     try{
          const userupdate = await User.findByIdAndUpdate({_id: req.body.id},{$set:{fullname:req.body.fullname,avatar:req.body.avatar,is_activated:1}},{new:true});
           if (!userupdate) {
            return res.status(400).send({error: 'not uodated.'});
        }
             res.send({success:1,message:userupdate});
     } catch (error) {
        res.status(400).send({error: 'user profile updated failed.'});
    }

});


router.post('/api/v1/contacts',auth,async(req,res) => {
    res.setHeader("Content-Type", "application/json");
     try{
          const {phonenumber} = req.body;
               const userexists = await User.find({'phone': { $in: phonenumber }}, function(err, teamData) {
});
    var contactlist = [];
    var contactobj = {}
        map(userexists,function(elm){

            contactobj = {
                "userID" : elm._id,
                "phone" : elm.phone,
                "avatar" :elm.avatar,
                "givenName":elm.fullname
            }
            contactlist.push(contactobj);
        })

    res.send({success:1,contacts: contactlist});
    } catch (error) {
        res.status(400).send({error: 'OTP unmatched. try again.'})
    }
       
})

router.post('/api/v1/checkcontacts',auth,async(req,res) => {
        res.setHeader("Content-Type", "application/json");
     try{
          const {phone} = req.body;
    const userexists = await User.findOne({phone});

          if (userexists) {
             res.status(200).send({phone:userexists.phone})
        }else{
             res.status(200).send({success:0}); 
        }
   
    } catch (error) {
        res.status(400).send({error: 'OTP unmatched. try again.'})
    }
})

router.post('/api/v1/resendcode',auth, async (req,res) => {
     res.setHeader("Content-Type", "application/json");
    try{
        const newcode = Math.floor(1000 + Math.random() * 9000);
        const resendcode = await Smscode.reSendCode(req.user,newcode);
       /// res.send({success:1,code:newcode,message:'new otp send.'});
console.log(resendcode);
        sendOtp.send(req.user[0].phone, "WEBASI",newcode,function (error, data) {
             res.status(200).send({success:1,code:newcode})
        });
      
    }catch(error){
        res.send(error);
    }
});
router.post('/api/v1/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/api/v1/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.post('/api/v1/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/api/v1/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router