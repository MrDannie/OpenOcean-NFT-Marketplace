import classNames from 'classnames'
import EmptyState from 'components/EmptyState'
import { toast } from 'react-toastify'
import useNFTMarket from 'state/nft-market'
import useSigner from 'state/signer'
import { Contract } from 'ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider'

import CreationForm, { CreationValues } from './CreationForm'
import NFT_MARKET from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { createContext, useContext } from 'react'

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string

const CreationPage = () => {
    const { imageURL, setImageURL, signer } = useSigner()
    const { uploadJSONToIPFS } = useNFTMarket()
    const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer)
    var metadataURI = ''

    const onSubmit = async (values: CreationValues) => {
        const { name, description } = values
        if (!name || !description || !imageURL) return
        const nftJSON = {
            name,
            description,
            image: imageURL,
        }
        console.log(nftJSON, 'METADATA')

        try {
            const response = await uploadJSONToIPFS(nftJSON)
            if (response.success === true) {
                console.log('Upload JSON to Pinata', response)
                metadataURI = response.pinataURL
                const transaction: TransactionResponse =
                    await nftMarket.createNFT(metadataURI)
                await transaction.wait()
            }
            console.log('NFT CREATED AND METADATA UPLOADED TO IPFS')

            toast.success(
                "You'll see your new NFT here shortly. Refresh the page."
            )
        } catch (e) {
            toast.warn('Something wrong!')
            console.log(e)
        }
    }

    return (
        <div className={classNames('flex h-full w-full flex-col')}>
            {!signer && <EmptyState>Connect your wallet</EmptyState>}
            {signer && <CreationForm onSubmit={onSubmit} />}
        </div>
    )
}

export default CreationPage
