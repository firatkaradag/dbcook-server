import { success, notFound } from '../../services/response/'
import { Router } from 'express'
import { uri } from '../../config'

import multer from 'multer'

const upload = multer({ dest: './src/uploads/images/' })
const router = new Router()

router.post('/', upload.single('file'), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  res.status(200).json({
    link: uri + 'images/' + req.file.filename
  })
})

export default router
