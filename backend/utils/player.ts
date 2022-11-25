import {
  createAudioPlayer,
  AudioPlayer,
  joinVoiceChannel,
  VoiceConnection,
  AudioPlayerStatus,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import {
  CommandInteraction,
  InternalDiscordGatewayAdapterCreator,
} from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";
import playDl from "play-dl";
import Song from "../types/Song";
import embedCreate from "./embedCreate";
import { error, log } from "./logger";

class Player {
  public audio: AudioPlayer;

  public connection: VoiceConnection | null = null;

  public queue: Song[];

  constructor() {
    this.audio = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });
    this.queue = [];
  }

  private async player() {
    if (this.queue.length <= 0) {
      this.connection?.disconnect();
      this.connection = null;
      return;
    }

    const song = this.queue[0];

    const stream = await playDl.stream(song.url);

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      inlineVolume: true,
    });

    resource.volume?.setVolume(0.5);

    this.audio.play(resource);

    this.connection?.subscribe(this.audio);

    this.audio.once(AudioPlayerStatus.Idle, () => {
      this.queue.shift();
      return this.player();
    });

    this.audio.once("error", (e) => {
      error(e);
    });
  }

  public async play(interaction: CommandInteraction) {
    let url = interaction.options.get("title")?.value as string;

    const user = interaction.guild?.members.cache.get(
      interaction.member?.user.id as string
    );

    const channel = user?.voice.channel;

    log(`User ${interaction.member?.user.username} requested to play ${url}`);

    if (!channel) {
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "There was an error!",
            description: "Reason: Make sure you are in a voice channel.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x880808,
          }),
        ],
      });
      return error(
        `User ${interaction.member?.user.username} failed to play ${url}, reason: Not in a voice channel.`
      );
    }

    if (!url) {
      this.resume(interaction);
      return;
    }

    if (!this.connection) {
      this.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild?.id as string,
        adapterCreator: interaction.guild
          ?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
      });
      log("Joined voice channel.");
    }

    if (!ytdl.validateURL(url)) {
      const search = await ytsr(url, { limit: 1 });
      if (!search.items.length) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: "",
              description: "Reason: Make sure you are in a voice channel.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x880808,
            }),
          ],
        });
      }

      if (!search.items[0].type.includes("video")) {
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: `No results found for ${url}.`,
              description: "Try a different search term.",
              author: "🎶🎶🎶",
              thumbnail:
                `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
                "https://cdn.jacksta.dev/assets/newUser.png",
              color: 0x880808,
            }),
          ],
        });
        return;
      }

      const video = search.items[0] as Video;

      url = video.url;
    }

    const videoInfo = await ytdl.getBasicInfo(url);

    this.queue.push({
      requesterId: interaction.user.id,
      requesterName: interaction.user.username,
      url,
      title: videoInfo.videoDetails.title,
      thumbnail:
        videoInfo.videoDetails.thumbnails[
          videoInfo.videoDetails.thumbnails.length - 1 // Like what the fuck is this?
        ].url,
      author: videoInfo.videoDetails.author.name,
      avatar:
        videoInfo.videoDetails.author.thumbnails?.[0].url ||
        "https://cdn.jacksta.dev/assets/newUser.png",
      duration: videoInfo.videoDetails.lengthSeconds,
      description: videoInfo.videoDetails.description,
    });

    if (this.audio.state.status !== AudioPlayerStatus.Playing) {
      this.player();
    }

    await interaction.editReply({
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
    });
  }

  public async skip(interaction?: CommandInteraction) {
    if (!this.connection || !this.queue.length) return;

    if (interaction)
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: player.queue[0].title,
            description: "Skipped song.",
            author: "🎶🎶🎶",
            image: player.queue[0].avatar,
            thumbnail: player.queue[0].thumbnail,

            color: 0x00ff00,
            url: player.queue[0].url,
          }),
        ],
      });

    this.queue.shift();

    this.player();

    return true;
  }

  public async stop(interaction?: CommandInteraction) {
    if (!this.connection || !this.queue.length) return false;

    if (interaction)
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "Stopped playing the song.",
            description: "Stopped playing the song & cleared the queue.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x00ff00,
          }),
        ],
      });

    this.queue = [];

    this.audio.stop();
    return true;
  }

  public async pause(interaction?: CommandInteraction) {
    if (!this.connection || !this.queue.length) return false;

    if (interaction)
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "Song paused",
            description: "Type /resume at anytime to resume.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x00ff00,
          }),
        ],
      });

    this.audio.pause();
    return true;
  }

  public async resume(interaction?: CommandInteraction) {
    if (!this.connection || !this.queue.length) return false;

    if (interaction)
      await interaction.editReply({
        embeds: [
          embedCreate({
            title: "Song resumed",
            description: "Type /pause at anytime to pause.",
            author: "🎶🎶🎶",
            thumbnail:
              `https://cdn.discordapp.com/avatars/${interaction.member?.user.id}/${interaction.member?.user.avatar}.png` ||
              "https://cdn.jacksta.dev/assets/newUser.png",
            color: 0x00ff00,
          }),
        ],
      });

    this.audio.unpause();
    return true;
  }
}

export default Player;
