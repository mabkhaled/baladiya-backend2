var express = require('express')
const Municipality = require('../models/municipality')
const User = require('../models/user')
const Address = require('../models/address')
var router = express.Router()

/* Getting All */
router.get('/', async (req, res, next) => {
    try {
        const municipalitys = await Municipality.find()
        res.json(municipalitys)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Getting One by Id*/
router.get("/:id", getMunicipality, (req, res) => {
    try {
        res.json(res.municipality)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})

/* Updating One */
router.patch("/:id", getMunicipality, async (req, res) => {
    if (req.body.name != null) {
      res.municipality.name = req.body.name
    }
    if (req.body.phoneNumber != null) {
      res.municipality.phoneNumber = req.body.phoneNumber
    }
    if (req.body.emailAddress != null) {
      res.municipality.emailAddress = req.body.emailAddress
    }
    try {
      const updatedMunicipality = await res.municipality.save()
      res.json(updatedMunicipality)
    } catch (error) {
      res.status(400).json({ message: error.message })
  
    }
  })

/* Deleting One */
router.delete("/:id", getMunicipality, async (req, res) => {
    try {
        await res.municipality.remove()
        res.json({ message: 'Deleted Municipality' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Creating One */
router.post("/", async (req, res, next) => {
    

   
    const municipality = new Municipality({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        workSchedule: req.body.workSchedule,
        
    })
    console.log("Posted Successfuly" + municipality)

    try {
        const newMunicipality = await municipality.save();
        res.status(201).json({ newMunicipality });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/*MiddleWare functions*/

async function getMunicipality(req, res, next) {
    let municipality
    try {
        municipality = await Municipality.findById(req.params.id)
        if (municipality == null) {
            return res.status(404).json({ message: 'Cannot find municipality' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.municipality = municipality
    next()
}

module.exports = router;

