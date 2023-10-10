import { UploadIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { useField } from 'formik'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import useNFTMarket from 'state/nft-market'
import useSigner from 'state/signer'

type ImagePickerProps = {
    name: string
    className?: string
}

const ImagePicker = ({ name, className }: ImagePickerProps) => {
    const [, { error, value }, { setValue }] = useField<File>(name)
    const ref = useRef<HTMLInputElement | null>(null)
    const [url, setURL] = useState<string>()
    const { setImageURL } = useSigner()

    const { createNFT } = useNFTMarket()

    useEffect(() => {
        if (value) {
            const newURL = URL.createObjectURL(value)
            setURL(newURL)
            return () => URL.revokeObjectURL(newURL)
        } else setURL(undefined)
    }, [value])

    const style: CSSProperties = {
        backgroundImage: url && `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e: any) {
        const file = e.target.files ? e.target.files[0] : undefined
        file && setValue(file)
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await createNFT(file)
            if (response.success === true) {
                console.log('Uploaded image to Pinata: ', response.pinataURL)
                setImageURL(response.pinataURL)
            }
        } catch (e) {
            console.log('Error during file upload', e)
        }
    }

    return (
        <button
            className={classNames(
                className,
                'group flex h-96 w-72 items-center justify-center rounded-xl border',
                { 'border-black': !error, 'border-red-500': error }
            )}
            style={style}
            onClick={() => {
                if (ref.current) ref.current.click()
            }}
            type="button"
        >
            <input
                className="hidden"
                type="file"
                accept="image/png,image/jpeg"
                ref={ref}
                onChange={OnChangeFile}
            />
            {!url && (
                <div className="flex items-center text-lg font-semibold">
                    <UploadIcon className="mr-2 h-9 w-9" />
                    Upload
                </div>
            )}
        </button>
    )
}

export default ImagePicker
