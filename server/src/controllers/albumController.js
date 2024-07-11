import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColour = req.body.bgColour;
    const imageFile = req.file;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
    });

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    const album = albumModel(albumData);
    await album.save();

    res.json({ success: true, message: 'Album Added' });
  } catch (error) {
    res.json({ success: false  + error });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const album = await albumModel.findById(req.body.id);
    if (!album) {
      return res.json({ success: false, message: 'Album not found' });
    }

    // Extract the public ID from the Cloudinary URL
    const imageUrl = album.image;
    const publicId = imageUrl.split('/').pop().split('.')[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the album from the database
    await albumModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: 'Album removed' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addAlbum, listAlbum, removeAlbum };
