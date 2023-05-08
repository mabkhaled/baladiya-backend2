var express = require('express')
const Claim = require('../models/claim')
const multer = require('../multer-config')
const User = require('../models/user')
var router = express.Router()

/* Getting All */
router.get('/', async (req, res, next) => {
    try {
        const claims = await Claim.find()
        res.json(claims)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Getting One by Id*/
router.get("/:id", getClaim, (req, res) => {
    try {
        res.json(res.claim)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

/* Updating One */
router.patch("/:id", getClaim, async (req, res) => {
    if (req.body.name != null) {
        res.claim.name = req.body.name
    }
    if (req.body.type != null) {
        res.claim.type = req.body.type
    }
    if (req.body.date != null) {
        res.claim.date = req.body.date
    }
    if (req.body.image != null) {
        res.claim.image = req.body.date
    }
    if (req.body.text != null) {
        res.claim.text = req.body.text
    }
    if (req.body.user != null) {
        res.claim.user = req.body.user
    }
    try {
        const updatedClaim = await res.claim.save()
        res.json(updatedClaim)
    } catch (error) {
        res.status(400).json({ message: error.message })

    }
})

/* Deleting One */
router.delete("/:id", getClaim, async (req, res) => {
    try {
        await res.claim.remove()
        res.json({ message: 'Deleted Claim' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Creating One */
/* Creating One */
router.post("/:id",getUser,multer, async (req, res, next) => {
    const user = await res.user
    const claim = new Claim({
        name: req.body.name,
        type: req.body.type,
        date: req.body.date,
        photos: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`,
        text: req.body.text,
        author: req.body.user
    })
    console.log("Posted Successfuly" + claim)

    try {
        const newClaim = await claim.save();
        res.status(201).json({ newClaim });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/*MiddleWare functions*/

async function getClaim(req, res, next) {
    let claim
    try {
        //claim = await Claim.findById(req.params.id)
        if (claim == null) {
            return res.status(404).json({ message: 'Cannot find claim' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.claim = claim
    next()
}

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

