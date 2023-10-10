import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber, Contract } from 'ethers'
import { ethers } from 'ethers'
import { CreationValues } from 'modules/CreationPage/CreationForm'
import useSigner from 'state/signer'

import NFT_MARKET from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { NFT_MARKET_ADDRESS } from './config'
import { NFT } from './interfaces'
import useListedNFTs from './useListedNFTs'
import useOwnedListedNFTs from './useOwnedListedNFTs'
import useOwnedNFTs from './useOwnedNFTs'

const axios = require('axios')
const FormData = require('form-data')

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY as string
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET as string

const useNFTMarket = () => {
    const { signer } = useSigner()
    const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer)

    const ownedNFTs = useOwnedNFTs()
    const ownedListedNFTs = useOwnedListedNFTs()
    const listedNFTs = useListedNFTs()

    // const createNFT = async (values: CreationValues) => {

    //   try {
    //     const data = new FormData();
    //     data.append("name", values.name);
    //     data.append("description", values.description);
    //     data.append("image", values.image!);
    //     const response = await fetch(`${BASE_URL}`, {
    //       method: "POST",
    //       body: data,
    //       mode: 'no-cors',
    //       headers: {
    //         Authorization: `Bearer ${API_KEY}`
    //       }
    //     });
    //     if (response.status == 201) {
    //       const json = await response.json();
    //       console.log(json.uri);

    //       const transaction: TransactionResponse = await nftMarket.createNFT(
    //         json.uri
    //       );
    //       await transaction.wait();
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };

    //COMMENT
    //COMMENT

    const createNFT = async (file: File) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
        //making axios POST request to Pinata ⬇️

        let data = new FormData()
        // data.append('file', values.image!)
        data.append('file', file)

        const metadata = JSON.stringify({
            name: 'testname',
            keyvalues: {
                exampleKey: 'exampleValue',
            },
        })
        data.append('pinataMetadata', metadata)

        //pinataOptions are optional
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
            customPinPolicy: {
                regions: [
                    {
                        id: 'FRA1',
                        desiredReplicationCount: 1,
                    },
                    {
                        id: 'NYC1',
                        desiredReplicationCount: 2,
                    },
                ],
            },
        })
        data.append('pinataOptions', pinataOptions)

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_API_SECRET,
                },
            })
            .then(function (response: any) {
                console.log('image uploaded', response.data.IpfsHash)
                return {
                    success: true,
                    pinataURL:
                        'https://gateway.pinata.cloud/ipfs/' +
                        response.data.IpfsHash,
                }
            })
            .catch(function (error: any) {
                console.log(error)
                return {
                    success: false,
                    message: error.message,
                }
            })
    }

    const uploadJSONToIPFS = async (JSONBody: any) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
        //making axios POST request to Pinata ⬇️
        return axios
            .post(url, JSONBody, {
                headers: {
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_API_SECRET,
                },
            })
            .then(function (response: any) {
                return {
                    success: true,
                    pinataURL:
                        'https://gateway.pinata.cloud/ipfs/' +
                        response.data.IpfsHash,
                }
            })
            .catch(function (error: any) {
                console.log(error)
                return {
                    success: false,
                    message: error.message,
                }
            })
    }

    const listNFT = async (tokenID: string, price: BigNumber) => {
        const transaction: TransactionResponse = await nftMarket.listNFT(
            tokenID,
            price
        )
        await transaction.wait()
    }

    const cancelListing = async (tokenID: string) => {
        const transaction: TransactionResponse = await nftMarket.cancelListing(
            tokenID
        )
        await transaction.wait()
    }

    const buyNFT = async (nft: NFT) => {
        const transaction: TransactionResponse = await nftMarket.buyNFT(
            nft.id,
            {
                value: ethers.utils.parseEther(nft.price),
            }
        )
        await transaction.wait()
    }
    return {
        createNFT,
        uploadJSONToIPFS,
        listNFT,
        cancelListing,
        buyNFT,
        ...ownedNFTs,
        ...ownedListedNFTs,
        ...listedNFTs,
    }
}

export default useNFTMarket
