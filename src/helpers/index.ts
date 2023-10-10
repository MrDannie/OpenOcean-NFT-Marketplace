export const ipfsToHTTPS = (url: string) => {
    console.log(url)

    if (
        !url.startsWith('ipfs://') ||
        !url.includes('https://gateway.pinata.cloud/ipfs')
    )
        throw new Error('Not an IPFS url')

    if (url.includes('https://gateway.pinata.cloud/ipfs')) {
        const cid = url.substring(29)
        return `https://ipfs.io/ipfs/${cid}`
    }
    const cid = url.substring(7)
    return `https://ipfs.io/ipfs/${cid}`
}

export const minifyAddress = (address: string) => {
    const start = address.substring(0, 5)
    const end = address.substring(address.length - 4)
    return `${start}...${end}`
}
// https://ipfs.io/ipfs/bafyreifjchherdyi22wszgyznpwdd5lvodjcmodybc6w44jx6l2o2gw6ry
