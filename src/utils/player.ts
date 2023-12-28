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
import handleError from "./handleError";

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

  private async playNext() {
    if (this.queue.length <= 0) {
      this.connection?.disconnect();
      this.connection = null;
      return;
    }

    const song = this.queue[0];

    config.cookies &&
      playDl.setToken({
        youtube: {
          cookie: config.cookies,
        },
      });

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

      return this.playNext();
    });

    this.audio.once("error", (e) => {
      error(e);
    });
  }

  public async play(interaction: CommandInteraction) {
    try {
      let url = interaction.options.get("title")?.value as string;

      if (!url) return await this.resume(interaction);

      const user = interaction.guild?.members.cache.get(
        interaction.member?.user.id as string
      );

      const channel = user?.voice.channel;

      log(`User ${interaction.member?.user.username} requested to play ${url}`);

      if (!channel) throw new Error("Make sure you are in a voice channel.");

      if (!url) {
        await this.resume(interaction);
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
        const search = await ytsr(url, {
          limit: 1,
          requestOptions: {
            headers: {
              Cookie: config.cookies,
            },
          },
        });

        if (!search.items.length) throw new Error("No results found.");

        if (url.includes("spotify")) {
          const spotify = await ytsr(url, {
            limit: 1,
            requestOptions: {
              headers: {
                Cookie: config.cookies,
              },
            },
          });
          if (!spotify.items.length) throw new Error("No results found.");
        }

        if (!search.items[0].type.includes("video"))
          throw new Error("No results found.");

        const video = search.items[0] as Video;

        url = video.url;
      }

      const videoInfo = await ytdl.getBasicInfo(
        url,
        config.cookies
          ? {
              requestOptions: {
                headers: {
                  Cookie: config.cookies,
                },
              },
            }
          : {}
      );

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
        this.playNext();
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
      return true;
    } catch (e) {
      let errorString = (e as Error).message;

      if (e instanceof (Error || TypeError)) {
        if (e.message.includes("unavailable"))
          errorString = "This video is unavalable.";
        else if (e.message.includes("private"))
          errorString = "This video is private.";
        else if (e.message.includes("429")) errorString = "Too many requests.";
        else if (e.message.includes("410"))
          errorString =
            "This video is age-restricted or region-locked. Try different search terms or ask the owner to add cookies to the config.";
        else errorString = e.message;

        handleError(
          interaction,
          e,
          "Error occurred while trying to play song.",
          errorString
        );
      }

      return false;
    }
  }

  public async skip(interaction?: CommandInteraction) {
    try {
      if (!this.connection || !this.queue.length)
        throw new Error("No song currently playing.");

      if (interaction)
        await interaction.editReply({
          embeds: [
            embedCreate({
              title: player.queue[0].title,
              description: "Skipped song.",
              author: "🎶🎶🎶",
              image: player.queue[0].thumbnail,
              thumbnail: player.queue[0].avatar,

              color: 0x00ff00,
              url: player.queue[0].url,
            }),
          ],
        });

      this.queue.shift();

      this.playNext();

      return true;
    } catch (e) {
      handleError(
        interaction,
        e,
        "Error occurred while trying to skip song.",
        (e as Error).message
      );
      return false;
    }
  }

  public async stop(interaction?: CommandInteraction) {
    try {
      if (!this.connection || !this.queue.length)
        throw new Error("No song playing.");

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

      this.connection.destroy();

      this.audio.stop();
      return true;
    } catch (e) {
      handleError(
        interaction,
        e,
        "Error occurred while trying to stop the song.",
        (e as Error).message
      );
      return false;
    }
  }

  public async pause(interaction?: CommandInteraction) {
    try {
      if (!this.connection || !this.queue.length)
        throw new Error("No song playing.");

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
    } catch (e) {
      handleError(
        interaction,
        e,
        "Error occurred while trying to pause the song.",
        (e as Error).message
      );
      return false;
    }
  }

  public async resume(interaction?: CommandInteraction) {
    try {
      if (!this.connection || !this.queue.length)
        throw new Error("No songs playing when trying to resume.");

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
    } catch (e) {
      handleError(
        interaction,
        e,
        "Error occurred while trying to resume the song.",
        (e as Error).message
      );
      return false;
    }
  }
}

export default Player;
