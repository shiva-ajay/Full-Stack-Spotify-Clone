import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration,
    };

    const song = new songModel(songData);
    await song.save();

    res.json({ success: true, message: "Song Added" });
  } catch (error) {
    res.json({ success: false });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await songModel.find({});
    res.json({ success: true, songs: allSongs });
  } catch (error) {
    res.json({ success: false });
  }
};

const removeSong = async (req, res) => {
  try {
    const song = await songModel.findById(req.body.id);
    if (!song) {
      return res.json({ success: false, message: "Song not found" });
    }

    // Extract the public IDs from the Cloudinary URLs
    const audioUrl = song.file;
    const imageUrl = song.image;
    const audioPublicId = audioUrl.split('/').pop().split('.')[0];
    const imagePublicId = imageUrl.split('/').pop().split('.')[0];

    // Delete the audio and image files from Cloudinary
    await cloudinary.uploader.destroy(audioPublicId, { resource_type: "video" });
    await cloudinary.uploader.destroy(imagePublicId, { resource_type: "image" });

    // Delete the song from the database
    await songModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Song removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addSong, listSong, removeSong };

