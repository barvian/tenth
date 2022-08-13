import dns from 'dns'

let connected: boolean | null = null

export async function isConnectedToTheInternet() {
  if (connected === null) {
    connected = await new Promise(resolve => {
      dns.lookupService('8.8.8.8', 53, err => {
        resolve(!err)
      })
    })
  }
  return !!connected
}
