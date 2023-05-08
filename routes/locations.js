var express = require('express')
const Location = require('../models/location')
const Address = require('../models/address')
var router = express.Router()

/* Getting All */
router.get('/', async (req, res, next) => {
    try {
        const locations = await Location.find()
        res.json(locations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Getting One by Id*/
router.get("/:id", getLocation, (req, res) => {
    try {
        res.json(res.location)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

/* Updating One */
router.patch("/:id", getLocation, async (req, res) => {
    if (req.body.name != null) {
      res.location.name = req.body.name
    }
    if (req.body.description != null) {
      res.location.description = req.body.description
    }
    if (req.body.address != null) {
      res.location.address = req.body.address
    }
    try {
      const updatedLocation = await res.location.save()
      res.json(updatedLocation)
    } catch (error) {
      res.status(400).json({ message: error.message })
  
    }
  })

/* Deleting One */
router.delete("/:id", getLocation, async (req, res) => {
    try {
        await res.location.remove()
        res.json({ message: 'Deleted Location' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Creating One */
router.post("/", async (req, res, next) => {
    const address = new Address({
        street: req.body.street,
        city: req.body.street,
        state: req.body.street,
        postalCode: req.body.street,
        country: req.body.street,
    })
    const location = new Location({
        name: req.body.name,
        description: req.body.description,
        address: address,
    })
    console.log("Posted Successfuly " + location)

    try {
        const newLocation = await location.save();
        res.status(201).json({ newLocation });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/*MiddleWare functions*/

async function getLocation(req, res, next) {
    let location
    try {
        location = await Location.findById(req.params.id)
        if (location == null) {
            return res.status(404).json({ message: 'Cannot find location' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.location = location
    next()
}

module.exports = router;

