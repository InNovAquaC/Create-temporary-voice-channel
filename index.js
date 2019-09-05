var { token, categoryID, voiceID } = require('./config.json');

var { Client } = require('discord.js');
var client = new Client();

client.on('ready', () => console.info(`Script has been started and authorized (${client.user.tag} | ${client.user.id}).`));
client.on('voiceStateUpdate', (Old, New) => {
    if(New.user.bot) return;
    if(Old.user.bot) return;

    if(New.voiceChannelID == voiceID) {
        New.guild.createChannel(New.user.username, 'voice').then((set) => {
            New.setVoiceChannel(New.guild.channels.get(set.id)).then(() => set.setParent(New.guild.channels.get(categoryID)));
            set.overwritePermissions(New.user, {
                'CONNECT': true, 'SPEAK': true,
                'MOVE_MEMBERS': true, 'VIEW_CHANNEL': true,
                'MANAGE_CHANNELS': true, 'MANAGE_ROLES_OR_PERMISSIONS': true,
                'USE_VAD': true, 'PRIORITY_SPEAKER': true
            });
        });
    }

    if(Old.voiceChannel) {
        Old.guild.channels.forEach((channels) => {
                if(channels.parentID == categoryID) {
                    if(channels.id == voiceID) return;
                    if(Old.voiceChannelID == channels.id) {
                        if(Old.voiceChannel.members.size == 0) {
                            channels.delete();
                        }
                    }
                }
        });
    }
});

client.login(token);
