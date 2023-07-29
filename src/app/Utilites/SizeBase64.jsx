import { Buffer } from 'buffer';

const SizeBase64 = (base64String) => {

    let buf = 0;
    if (base64String) {
        buf = new Buffer.from(base64String, 'base64').length
    }
    return buf
};

export default SizeBase64;