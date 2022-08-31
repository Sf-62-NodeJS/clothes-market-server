const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

class ProductImageService {
  async uploadImage (req, res) {
    const image = req.files.image;
    let imageType;

    if (image.mimetype === 'image/jpeg') imageType = 'jpg';
    if (image.mimetype === 'image/png') imageType = 'png';

    const imageName = `${uuidv4()}.${imageType}`;
    const uploadPath = `${process.cwd()}/src/uploads/images/${imageName}`;

    image.mv(uploadPath);

    req.body.image = imageName;

    return req.body.image;
  }

  async deleteImage (imageFile) {
    const fsPath = `${process.cwd()}/src/uploads/images/${imageFile}`;

    fs.unlink(fsPath, (err) => {
      if (err) return console.error(err);
    });

    return true;
  }
}

module.exports = new ProductImageService();
