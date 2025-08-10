import qrcode from "qrcode"


export const generateQrCode = ({data = {}} = {}) => {
    const result = qrcode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: 'H' })
    return result
}