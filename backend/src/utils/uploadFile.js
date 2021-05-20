const fs = require('fs');
const FileType = require('file-type');
const moment = require('moment');


module.exports.uploadFile = (files) => {
    const extensions = ["image/jpg", "image/jpeg", "image/png"];

    const images = files.filter(async (el) => {
        const fileType = await FileType.fromBuffer(el)
        return extensions.includes(fileType.mime) 
    });

    const urlImagesArr = images.map(async (el) => {
        const date = moment().format("DDMMYYYY-HHmmss SSS");
        const fileType = await FileType.fromBuffer(el)
        const filename = `uploads/${date}-${Math.random() * 1000}.${fileType.ext}`
        fs.writeFileSync(filename,el)
        return filename;
    })

    return Promise.all(urlImagesArr);
}