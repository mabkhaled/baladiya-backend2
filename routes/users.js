var express = require('express')
const User = require('../models/user')
const Address = require('../models/address')
const Municipality = require('../models/municipality')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const multer = require('../multer-config')
const nodemailer = require('nodemailer')

var router = express.Router()

/*MailSender*/
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ghazi.benhadjyahia@esprit.tn",
    pass: "203JMT5140"
  }
})
const options = {
  from: "gbhy1919@gmail.com",
  to: "ghazi.benhadjyahia@esprit.tn",
  subject: "Sending This from Backend Baladeyti",
  text: "Tanséch bech tna9ess mel dokhan"
}
/* Login Face ID*/
router.post('/loginFace', getUserByMail, async (req, res, next) => {
  if (res.user == null) {
    return res.status(400).send('Incorrect user')
  }
  try {
      const token = jwt.sign({ emailAddress: res.user.email }, "SECRET")
      if (token) {
        /* Login transporter.sendMail(options, function (err, info) {
          if (err) {
            console.log(err)
            return;
          }
          console.log("Sent " + info.response)
        })*/
        res.json({
          token: token,
          user: res.user,
          message: "Succes"
        })
      }
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})
/* Login */

router.post('/login', getUserByMail, async (req, res, next) => {
  if (res.user == null) {
    return res.status(400).send('Incorrect user')
  }
  try {
    if (await bcrypt.compare(req.body.password, res.user.password)) {
      const token = jwt.sign({ emailAddress: res.user.email }, "SECRET")
      if (token) {
        /* Login transporter.sendMail(options, function (err, info) {
          if (err) {
            console.log(err)
            return;
          }
          console.log("Sent " + info.response)
        })*/
        res.json({
          token: token,
          user: res.user,
          message: "Succes"
        })
      }
    } else {
      res.json({ message: "not allowed" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})



/* Getting ALL */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/* Getting One by Id*/
router.get("/:id", getUser, (req, res) => {
  try {
    res.json(res.user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})


/* Updating One */
router.patch("/:id", multer ,getUser, async (req, res) => {
  if (req.body.cin != null) {
    res.user.cin = req.body.cin
  }
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName
  }
  if (req.body.password != null) {
    const hashed = bcrypt.hash(req.body.password)
    res.user.password = hashed
  }
  if (req.file.filename != null) {
    
    res.user.photos = `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    //
  }
  try {
    const updatedUser = await res.user.save()
    res.json({user: updatedUser})
  } catch (error) {
    res.status(400).json({ message: error.message })

  }
})

/* Deleting One */
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({ message: 'Deleted User' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/* Creating One */
router.post("/", multer, async (req, res, next) => {
  const municipality = new Municipality({

  })
  const address = new Address({
    street: req.body.street,
    city: req.body.street,
    state: req.body.street,
    postalCode: req.body.street,
    country: req.body.street,
  })
  /* this is the salt */
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    emailAddress: req.body.email,
    //birthdate: req.body.birthdate,
    //gender: req.body.gender,
    //civilStatus: req.body.civilStatus,
    //cin: req.body.cin,
    password: hashedPassword,
   // photos: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    //address: address
  })
  console.log("Posted Successfuly" + user)
  console.log("this is the fkn salt " + salt)
  console.log("this is the hashedPassword " + hashedPassword)

  try {
    const newUser = await user.save();
    res.status(201).json({ newUser });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})



router.post('/forgotPassword',getUserByMail, (req, res, next) => {

  // user is not found into database
  if (!res.user) {
      return res.status(400).send({ msg: 'The email entred was not found by our system. Make sure your Email is correct!' });
  } else {
      var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
      var token = new Token({ emailAddress: res.user.emailAddress, token: seq });
      token.save(function (err) {
          if (err) {
              return res.status(500).send({ msg: err.message });
          }

      });

      var smtpTrans = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "gbhy1919@gmail.com",
          pass: "hellsinghakuda147"
        }
      });

      var mailOptions = {
          from: 'gbhy1919@gmail.com', to: res.user.emailAddress, subject:
              'Reset Password', text: 'You receive this email from Baladeyti application bellow you will find a link please click on it\n\n' +
                    'The code is  :'+ token.token + '\n\n' +
                  'http:\/\/' + req.headers.host + '\/user\/resetPassword\/' + res.user.emailAddress + '\/' + token.token
                  + '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'
      };
      // Send email (use credintials of SendGrid)

      //  var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
      smtpTrans.sendMail(mailOptions, function (err) {
          if (err) {
              return res.status(500).send({ msg: err });
          }
          else {
              return res.status(200).send({succes:true, 
                  msg:'A reset password  email has been sent to ' + res.user.emailAddress + '. It will be expire after one day. ',
                  token: token.token
              })};

      });

  }

});


router.post('/resetPassword/:emailAddress/:token' ,async (req, res, next) => {
Token.findOne({ token: req.params.token }, function (err, token) {
  // token is not found into database i.e. token may have expired 
  if (!token) {
      return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
  }
  // if token is found then check valid user 
  else {
      User.findOne({emailAddress: req.params.emailAddress }, async function (err, user) {
          // not valid user
          if (!user) {
              return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
          } else {

              const salt = await bcrypt.genSalt(10);
              console.log(salt)
              console.log(req.body.password,"This is the pass")
              const hashedp = await bcrypt.hash(req.body.password, salt);
              

              user.password = hashedp

              user.save(function (err) {
                  // error occur
                  if (err) {
                      return res.status(500).send({ msg: err.message });
                  }
                  // account successfully verified
                  else {
                      return res.status(200).json({reponse:'Your password has been successfully reset'});
                  }

              })

          }

      });
  }});

});




/*MiddleWares*/
/* Token auth
*/
async function authentificateToken(req, res, next) {
  const autHeader = req.headers['authorization']
  const token = autHeader && autHeader.split(' ')[1]

  if (token == null) return res.status(401).json({ reponse: "no token" })

  jwt.verify(token, "SECRET", (err, user) => {
    if (err) return res.status(403).json({ reponse: "token invalide" })
    req.user = user
    next()
  })

}

/*User by email
*/
async function getUserByMail(req, res, next) {
  let user
  try {
    user = await User.findOne({ emailAddress: req.body.email })
    if (user == null) {
      return res.status(404).json({ reponse: "mail non trouve" })
    }

  } catch (error) {
    return res.status(500).json({ reponse: error.message })
  }
  res.user = user
  next()
}



/*User by ID 
*/
async function getUser(req, res, next) {
  let user
  try {
    user = await User.findById(req.params.id)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  res.user = user
  next()
}



module.exports = router;


/*  find by Email and remove

const {email} = req.body
const user = await User.findOne({
  email
})
user.skills = user.skills.filter((el) => {
  return el.label != "JS"

})
await user.save() */


/* find , save , remove */