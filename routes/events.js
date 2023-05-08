var express = require('express')
const Event = require('../models/event')
const Address = require('../models/address')
var router = express.Router()

/* Getting All */
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find()
        res.json(events)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Getting One by Id*/
router.get("/:id", getEvent, (req, res) => {
    try {
        res.json(res.event)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

/* Updating One */
router.patch("/:id", getEvent, async (req, res) => {
    if (req.body.name != null) {
        res.event.name = req.body.name
    }
    if (req.body.type != null) {
        res.event.type = req.body.type
    }
    if (req.body.date != null) {
        res.event.date = req.body.date
    }
    if (req.body.address.street != null) {
        res.event.address.street = req.body.address.street
    }
    if (req.body.description != null) {
        res.event.description = req.body.description
    }
    if (req.body.image != null) {
        res.event.image = req.body.image
    }
    try {
        const updatedEvent = await res.event.save()
        res.json(updatedEvent)
    } catch (error) {
        res.status(400).json({ message: error.message })

    }
})

/* Deleting One */
router.delete("/:id", getEvent, async (req, res) => {
    try {
        await res.event.remove()
        res.json({ message: 'Deleted Event' })
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
    const event = new Event({
        name: req.body.name,
        type: req.body.type,
        date: req.body.date,
        address: address,
        description: req.body.description,
        image: req.body.image,
    })
    console.log("Posted Successfuly " + event)

    try {
        const newEvent = await event.save();
        res.status(201).json({ newEvent });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/*MiddleWare functions*/

async function getEvent(req, res, next) {
    let event
    try {
        event = await Event.findById(req.params.id)
        if (event == null) {
            return res.status(404).json({ message: 'Cannot find event' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.event = event
    next()
}

module.exports = router;

