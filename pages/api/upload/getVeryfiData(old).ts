// TODO: consider keeping this....
const Client = require('@veryfi/veryfi-sdk')
const client_id = process.env.VERYFI_CLIENT_ID
const client_secret = process.env.VERYFI_CLIENT_SECRET
const username = process.env.VERYFI_USERNAME
const api_key = process.env.VERYFI_API_KEY



let categories = ['Grocery', 'Utilities', 'Travel']


// currently gets one
const getData = async (file_path: any) => {
  let veryfi_client = new Client(client_id, client_secret, username, api_key)
  let response = await veryfi_client.process_document(
    file_path,
    (categories = categories),
  )
  console.log(response)
  return response
}

export default getData


// references: https://github.com/veryfi/veryfi-nodejs