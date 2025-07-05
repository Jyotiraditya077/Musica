import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import * as mm from "music-metadata";

config();

const SONG_PATH = path.resolve("..", "frontend", "public", "songs", "Mrs Magic - Strawberry Guy.mp3");

const seedSingleSong = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to DB");

		// Check if it already exists
		const existing = await Song.findOne({ title: "Mrs Magic" });
		if (existing) {
			console.log("ℹ️ Song already exists. Deleting and replacing...");
			await Song.deleteOne({ _id: existing._id });
		}

		const metadata = await mm.parseFile(SONG_PATH);
		const duration = Math.floor(metadata.format.duration || 0);
		const stats = await fs.stat(SONG_PATH);
		const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

		const song = new Song({
			title: "Mrs Magic",
			artist: "Strawberry Guy",
			imageUrl: "/cover-images/mrs-magic.jpg", // Make sure this file exists
			audioUrl: "/songs/Mrs Magic - Strawberry Guy.mp3",
			duration: duration,
			size: parseFloat(sizeMB)
			// album: not included
		});

		await song.save();
		console.log("✅ Mrs Magic added to DB without album.");
	} catch (err) {
		console.error("❌ Error:", err);
	} finally {
		mongoose.connection.close();
	}
};

seedSingleSong();
