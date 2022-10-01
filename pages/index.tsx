import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
// NOTE: Not using the below S3 currently. (for future reference only)
// import { imagesProcessor } from '../uploads/imagesProcessor'

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  //storing the current state of files in the image input on form.
  const inputFileRef = React.useRef<HTMLInputElement | null>(null)

  // ||| - ===============================>> \\\ - ||| - =---->
  //  STATE

  // this is the front end file state
  const [filesState, setFilesState]: any = useState([])
  // Set the server data to state
  const [serverData, setServerData]: any = useState([])
  // store the current mb size
  const [megaBytes, setMegaBytes]: any = useState(0)
  // load useRef()
  const stateRef = useRef()
  // setting current stateRef to custom variable 'megaBytes'
  stateRef.current = megaBytes

  // console logs what setFileState is set to at change of setFileState
  useEffect(() => {
    console.log(filesState)
  }, [setFilesState])

  // on fileState change, run function handleMBCount
  useEffect(() => {
    handleMBCount()
  }, [filesState])

  // capture the current state of the input file objects
  const onChangeHandler = (e: any) => {
    if (e.target.files.length > 0) {
      console.log('hellow world', [e.target.files])
      setFilesState([...e.target.files])
    }
  }

  // ||| - ===============================>> \\\ - ||| - =---->
  // count megabytes. set state setMegaBytes
  const handleMBCount = () => {
    let x = 0.0
    filesState.forEach((file: any) => {
      return (x = x + file.size * 0.000001)
    })
    setMegaBytes(Math.round(x * 100) / 100)
  }

  // ||| - ===============================>> \\\ - ||| - =---->
  // handleOnClick uploads an array of images from the user on the front end and uploads them to the the backend api. 
  const handleOnClick = async (e: React.MouseEvent<HTMLInputElement>) => {
    /* Prevent form from submitting by default */
    e.preventDefault()

    /* If file is not selected, then show alert message */
    if (!inputFileRef.current?.files?.length) {
      alert('Please, select file you want to upload')
      return
    }

    // begin loading indicator
    setIsLoading(true)

    // Add selected user uploaded files to FormData on the front end
    const formData = new FormData()
    console.log(
      'Object.values(inputFileRef.current.files) object values',
      Object.values(inputFileRef.current.files),
    )
    Object.values(inputFileRef.current.files).forEach((file: any) => {
      formData.append('file', file)
    })

    console.log('FORM DATA', formData)

    /* branch update/AWS_S3  --- NOT CURRENTLY USING!!!! */
    // imagesProcessor gets the file urls (array) from s3
    // const test = await imagesProcessor(filesState)
    // console.log('AHAHAHAH', test)

    /* Send request to our api route */
    console.log('test right before sending', formData)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    console.log('RESONSE', response)

    // todo: look into this
    const body = (await response.json()) as {
      status: 'ok' | 'fail'
      message: string
      data: [{}]
    }

    console.log('body dot data', body.data)

    if (body.status === 'ok') {
      inputFileRef.current.value = ''

      // Do some stuff on successfully upload

      // send to api try catch and delete file regardless. (already completed in backend)

      // alert(body.message)

      // return object from API back to front-end.
      setServerData(body.data)
      console.log(
        'SERVER DATAAAAAAA (BODY.DATA) ********************',
        body.data,
      )
      setFilesState([])
    } else {
      console.log(
        'Failed sending to /api/upload from front end. check ',
        body.data,
      )
      alert(body.message)
    }

    setIsLoading(false)
  }

  //
  //
  //  ||| - ==================================>> \\\ - ||| - =---->

  //  ||| - ==================================>> /// - ||| - =---->
  //
  //

  return (
    <>
      {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
      {/* HEADER */}
      <header>
        <div className="w-full border-b">
          <h1 className="p-2 font-bold text-2xl">Upload images of invoices and or receipts</h1>
        </div>
      </header>
      {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
      {/* MAIN SECTION - Image Selector */}
      <section className="w-full mt-6 p-2 max-w-2xl mx-auto">
        {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
        {/* FORM for Image Selector */}
        <form className="p-4 rounded-md mx-auto mb-8 flex flex-col text-center  border-gray-300 border shadow-md">
          <label className="" htmlFor="myfile"></label>
          <input
            onChange={onChangeHandler}
            className="mb-4"
            type="file"
            name="myfile"
            id="myfile"
            ref={inputFileRef}
            multiple
            accept="image/png, image/gif, image/jpeg"
          />
          <div className="flex flex-col items-center">
            {/* <p className="">Drop images here...</p> */}
            <div>
              {filesState.map((file: any) => {
                return (
                  <div key={file.name} className="flex items-center gap-4 mb-4">
                    <img
                      className="w-16 h-16 object-contain"
                      src={URL.createObjectURL(file)}
                      alt=""
                    />
                    <p className="text-xs sm:text-sm text-gray-900 text-start sm:text-center">
                      {file.name}
                    </p>
                    <p className="hidden sm:inline text-gray-400 text-xs sm:text-sm">
                      {'(' +
                        (Math.round(file.size * 0.000001 * 100) / 100).toFixed(
                          2,
                        ) +
                        'Mb' +
                        ')'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex sm:justify-end sm:w-full">
            {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
            {/* MAIN BUTTON !!! */}
            <input
              className=" shadow-md flex w-full sm:w-auto justify-center cursor-pointer bg-sky-300 px-4 py-2 rounded-md hover:bg-sky-400"
              type="submit"
              value={
                filesState.length > 1
                  ? `Upload All (${stateRef.current}Mb)`
                  : 'Upload'
              }
              disabled={isLoading}
              onClick={handleOnClick}
            />
            {isLoading && ` Wait, please...`}
          </div>
          {/* END FORM */}
        </form>

        {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
        {/* CARD DISPLAY AREA for returned Recept/Invoices */}
        {serverData.length > 0 ? (
          <div className="">
            {/* display all documents */}
            {serverData.map((document: any) => {
              return (
                <div
                  key={document.id}
                  className="mb-8 p-2 rounded-md border-gray-300 border shadow-md"
                >
                  <div className=" h-20 flex items-center w-full justify-between">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {document.vendor.raw_name}
                    </h3>
                    <p className="hidden sm:inline text-xs text-gray-500 max-w-[150px]">
                      {document.vendor.address}
                    </p>
                    <div className="w-20 h-20">
                      {document.vendor.vendor_logo && (
                        <img
                          src={document.vendor.vendor_logo}
                          alt=""
                          className="w-20 h-20"
                        />
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="flex items-center pt-1 pb-2 justify-between flex-wrap">
                    <p className="text-xs text-gray-400 text-start md:text-end">
                      Document Type: {document.document_type}
                    </p>
                    <p className="text-xs text-gray-400 text-start md:text-end">
                      Date: {document.date}
                    </p>
                  </div>
                  {/*   //  ||| - ===============================>> \\\ - ||| - =----> */}
                  {/* DOCUMENT LINES */}
                  <div className="altBgGray">
                    {document.line_items.map((item: any) => {
                      if (item.description === '' && item.price === 0) return
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-1 text-gray-800 text-sm md:text-base"
                        >
                          {/* style for quanties and price */}
                          <p>
                            {item.price > 0 && item.quantity > 1 ? (
                              <>
                                <span>{item.description}</span>{' '}
                                <span className="text-gray-400 italic">{`(${item.quantity} @ ${item.price})`}</span>
                              </>
                            ) : (
                              item.description
                            )}
                          </p>
                          <p>{item.total.toFixed(2)}</p>
                        </div>
                      )
                    })}
                    <div className="flex items-center justify-between py-1 font-semibold text-gray-800 text-sm md:text-base">
                      <p>SUBTOTAL</p>
                      <p>{document.subtotal.toFixed(2)}</p>
                    </div>{' '}
                    <div className="flex items-center justify-between py-1 font-semibold text-gray-800 text-sm md:text-base">
                      <p>TAX</p>
                      <p>{document.tax.toFixed(2)}</p>
                    </div>{' '}
                    <div className="flex items-center justify-between py-1 font-bold text-gray-800 text-sm md:text-base border-t border-gray-300">
                      <p>
                        TOTAL{' '}
                        {document.currency_code &&
                          `(${document.currency_code})`}
                      </p>
                      <p>{document.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center py-2 justify-between flex-wrap">
                    <p className="text-xs text-gray-400 text-start md:text-end"></p>
                    <span className="flex text-xs text-gray-400 text-start md:text-end">
                      <p className="mr-1">Phone:</p>
                      <a
                        href={'tel:' + document.vendor.phone_number}
                        className=" underline text-xs text-gray-400 text-start md:text-end"
                      >
                        {document.vendor.phone_number}
                      </a>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <></>
        )}
        {/* END MAIN SECTION  */}
      </section>
    </>
  )
}

export default Home
