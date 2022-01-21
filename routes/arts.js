const router = require('express').Router()
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const Art = require('../model/art')

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path)

    // Create new user
    let art = new Art({
      name: req.body.name,
      description: req.body.description,
      imageUrl: result.secure_url,
      cloudinary_id: result.public_id,
    })
    // Save user
    await art.save()
    res.json(art)
  } catch (err) {
    console.log(err)
  }
})

router.get('/admin/upload', (req, res) => {
  res.render('upload');
})

router.get('/admin/postlist', async (req, res) => {
  try {
    let arts = await Art.find()
    res.render('postlist', { arts })
  } catch (err) {
    console.log(err)
  }
})

router.get('/', async (req, res) => {
  try {
    let arts = await Art.find()
    res.render('projects', { arts })
    console.log('GET request to /art Success')
  } catch (err) {
    console.log(err)
  }
})

router.delete('/admin/delete/:id', async (req, res) => {
  try {
    // Find user by id
    let art = await Art.findById(req.params.id)
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(art.cloudinary_id)
    // Delete user from db
    await art.remove()
    res.json(art)
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let art = await Art.findById(req.params.id)
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(art.cloudinary_id)
    // Upload image to cloudinary
    let result
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path)
    }
    const data = {
      name: req.body.name || art.name,
      name: req.body.description || art.description,
      imageUrl: result?.secure_url || art.imageUrl,
      cloudinary_id: result?.public_id || art.cloudinary_id,
    }
    art = await Art.findByIdAndUpdate(req.params.id, data, { new: true })
    res.json(art)
  } catch (err) {
    console.log(err)
  }
})

router.get('/post/:id', async (req, res) => {
  try {
    // Find user by id
    let art = await Art.findById(req.params.id)
    res.render('confirmation', { art })
  } catch (err) {
    console.log(err)
    res.send('invalid input')
  }
})

module.exports = router
