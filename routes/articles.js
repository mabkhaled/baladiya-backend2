var express = require('express')
const User = require('../models/user')
const Article = require('../models/article')
const multer = require('../multer-config')
const nodemailer = require('nodemailer')
const { find } = require('../models/user')

var router = express.Router()


/*Get all Articles*/
router.get('/', async (req, res, next) => {
    try {
        const articles = await Article.find()
        res.json({ articles: articles })

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
})

/* Creating One */
router.post("/:id", getUser, multer, async (req, res, next) => {
    const user = await res.user
    const article = new Article({
        text: req.body.text,
        photos: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`,
        designation: req.body.designation,
        addresse: req.body.addresse,
        author: user,
    })
    console.log("Posted Successfuly" + article)
    try {
        const newArticle = await article.save();
        res.status(201).json({ newArticle });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
/*Get Posts by author*/
router.get("/byAuthor/:id", async (req, res, next) => {
    try {
        const articles = await Article.find({ author: req.params.id })
        res.json(articles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
/*Get Posts by municipality*/
router.get("/byText/:text", async (req, res, next) => {
    try {
        const articles = await Article.find({ text: req.params.text })
        res.json(articles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/* Getting One by Id*/
router.get("/:id", getArticle, (req, res) => {
    try {
        res.json(res.article)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})
/*Deleting One Article*/
router.delete("/:id", getArticle, async (req, res) => {
    try {
        await res.article.remove()
        res.json({ message: 'Deleted Article' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/*MiddleWares*/
async function getArticle(req, res, next) {
    let article
    try {
        article = await Article.findById(req.params.id)
        if (article == null) {
            return res.status(404).json({ message: 'Cannot find article' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.article = article
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