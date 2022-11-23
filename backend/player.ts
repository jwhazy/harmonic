import Eris, { InteractionDataOptionsWithValue } from "eris";
import ytdl from "ytdl-core";
import fs from "fs";
import ytsr, { Video } from "ytsr";
import Song from "./types/Song";
import embedCreate from "./utils/embedCreate";

class Player {
  public queue: Song[] = [];

  public connection: Eris.VoiceConnection | null = null;

  private async player() {
    if (!this.connection) return;
    if (!this.queue.length) return;

    this.queue.forEach((song) => {
      const stream = ytdl(song.url, { filter: "audioonly" }).pipe(
        fs.createWriteStream("song.mp3")
      );

      stream.once("finish", () => {
        this.connection?.play("song.mp3", { inlineVolume: true });

        if (this.queue.length > 1) {
          this.queue.shift();
        }
      });
    });
  }

  public async play(interaction: Eris.CommandInteraction) {
    const input = interaction.data
      .options?.[0] as InteractionDataOptionsWithValue;

    if (!input) return interaction.createFollowup("No input");

    const voiceChannel = interaction.member?.voiceState?.channelID;

    if (!voiceChannel) {
      return interaction.createFollowup("You are not in a voice channel!");
    }

    this.connection = await client.joinVoiceChannel(voiceChannel);

    this.connection.updateVoiceState(false, true);

    let url = input.value as string;

    if (!ytdl.validateURL(url)) {
      const search = await ytsr(url, { limit: 1 });

      if (!search.items.length) {
        return interaction.createFollowup("No video found!");
      }

      if (!search.items[0].type.includes("video")) {
        return interaction.createFollowup("No video found!");
      }

      const video = search.items[0] as Video;

      url = video.url;
    }

    const videoInfo = await ytdl.getBasicInfo(url);

    this.queue.push({
      requesterId: interaction.member?.id as string,
      requesterName: interaction.member?.username as string,
      url,
      title: videoInfo.videoDetails.title,
      thumbnail:
        videoInfo.videoDetails.thumbnails[
          videoInfo.videoDetails.thumbnails.length - 1
        ].url,
      author: videoInfo.videoDetails.author.name,
      avatar:
        videoInfo.videoDetails.author.thumbnails?.[0].url ||
        "https://cdn.jacksta.dev/assets/newUser.png",
      duration: videoInfo.videoDetails.lengthSeconds,
      description: videoInfo.videoDetails.description,
    });

    if (!this.connection.playing) {
      this.player();
    }

    return interaction.createFollowup({
      embeds: [
        embedCreate({
          title: videoInfo.videoDetails.title,
          description: "Added to queue.",
          author: "🎶🎶🎶",
          image:
            videoInfo.videoDetails.thumbnails[
              videoInfo.videoDetails.thumbnails.length - 1
            ].url,
          thumbnail: videoInfo.videoDetails.author?.thumbnails?.[0].url,

          color: 0x00ff00,
          url: videoInfo.videoDetails.video_url,
        }),
      ],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 2,
              label: "⏪",
              custom_id: "skip",
            },
            {
              type: 2,
              style: 1,
              label: "⏸️",
              custom_id: "pause",
            },
            {
              type: 2,
              style: 2,
              label: "⏩",
              custom_id: "stop",
            },
          ],
        },
      ],
    });
  }

  public pause() {
    if (!this.connection) return false;

    this.connection.pause();
    return true;
  }

  public resume() {
    if (!this.connection) return false;

    this.connection.resume();
    return true;
  }

  public stop() {
    if (!this.connection) return false;

    this.queue = [];
    this.connection.stopPlaying();

    return true;
  }

  public skip() {
    if (!this.connection) return false;

    this.connection.stopPlaying();
    this.queue.shift();

    this.player();

    return true;
  }
}

export default Player;
