import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
// formidable containts the form contents.
import formidable, { File } from 'formidable'
import getData from './getVeryfiData'

/* Don't miss that! */
export const config = {
  api: {
    bodyParser: false,
  },
}

// set this type to the 'files' variabe (awaits async)
type ProcessedFiles = Array<[string, File]>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // initiate array for sending to front end */
  let output: any = []

  let status = 200
  let resultBody = {
    status: 'ok',
    message: 'Files were uploaded successfully',
    data: output,
  }

  // Get files using formidable
  const files = await new Promise<ProcessedFiles | undefined>(
    (resolve, reject) => {
      const form = new formidable.IncomingForm()
      const files: ProcessedFiles = []
      form.on('file', function (field, file) {
        files.push([field, file])
      })
      form.on('end', () => resolve(files))
      form.on('error', (err) => reject(err))
      // use req http request and parse it.
      form.parse(req, () => {
        //
      })
    },
  ).catch((e) => {
    console.log(e)
    status = 500
    resultBody = {
      status: 'fail',
      message: 'Upload error',
      data: null,
    }
  })

  if (files?.length) {
    /* Create directory for uploads */
    const targetPath = path.join(process.cwd(), `/uploads/`)
    try {
      await fs.access(targetPath)
    } catch (e) {
      await fs.mkdir(targetPath)
    }

    /* Move uploaded files to directory */
    for (const file of files) {
      const tempPath = file[1].filepath
      await fs.rename(tempPath, targetPath + file[1].originalFilename)

      // Use getVeryfi API | set invoked imported custom function to get async data from getVeryfiData file.
      // connects to OCR API and then return result in res.json(blablabla)
      let returnedFile = await getData(targetPath + file[1].originalFilename)
      if (returnedFile) output.push(returnedFile) // CHECK TODO: THIS COULD BREAK A GOOD RESPONSE.. CHECK..
    }
    // update the body message to reflect that ZERO rows returned from veryfi API
    if (!output.length)
      resultBody.message = "We're sorry, No Images could be processed"

    /* Remove uploaded files */
    for (const file of files) {
      //deletes the file form fs using unlink.
      await fs.unlink(targetPath + file[1].originalFilename)
      console.log(file[1].originalFilename, 'deleted')
    }
  }

  res.status(status).json(resultBody)
}

export default handler
