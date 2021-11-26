const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
] });

client.on('ready', async () => {
    console.log("Ik ben gestart")
});


const studies = [
    {
        name: "Elektrotechniek",
        emoji: "⚡"
    },
    {
        name: "Werktuigbouwkunde",
        emoji: "🦾"
    },
    {
        name: "ProductOntwerpen",
        emoji: "🖌️"
    },
    {
        name: "TechnischeBedrijfskunde",
        emoji: "💰"
    },
]
  
const createStudyList = () => studies.map(({name, emoji}) => `- ${name}: ${emoji}`).join("\n")

const sendWelcomeMessage = async (channel, user) => channel.send(`Welkom ${user}🖐\nDit is de de **officiële A-Tech** discord server 🌎 We willen je vragen om je gebruikersnaam 🤴👸 te veranderen naar je echte naam :)`)

const sendStudyMessage = async (channel) => {
    const {guild} = channel

    const message = await channel.send({
        content: `_ _ \nKies je opleiding door op een van de volgende emojis te klikken:\n${createStudyList()}`,
        fetchReply: true
    })

    const emojis = studies.map(({emoji}) => message.react(emoji))

    await Promise.all(emojis)

    const filter = (reaction, user) => studies.find(({emoji}) => emoji === reaction.emoji.name) && !user?.bot;
    const collector = message.createReactionCollector({ 
        filter,
        time: 30000,
        dispose: true
     });

    collector.on('collect', async (reaction, user) => {
        
        const [member, roles] = await Promise.all([
            guild.members.fetch(user.id),
            guild.roles.fetch()
        ]);
        
        const roleName = studies.find(({emoji}) => emoji === reaction.emoji.name)?.name;
        const role = roles.find(({name}) => name === roleName)

        member.roles.add(role)
    });

    collector.on('remove', async (reaction, user) => {
        const [member, roles] = await Promise.all([
            guild.members.fetch(user.id),
            guild.roles.fetch()
        ]);
        
        const roleName = studies.find(({emoji}) => emoji === reaction.emoji.name)?.name;
        const role = roles.find(({name}) => name === roleName)

        member.roles.remove(role)
    });
    
    collector.on('end', () => message.delete());

}

client.on('guildMemberAdd', async (user) => {
    const channelId = user.guild.systemChannelId
    const channel = await client.channels.fetch(channelId)
    await sendWelcomeMessage(channel, user)
    await sendStudyMessage(channel)
});

//process.env.BOT_TOKEN
client.login("OTEzNzQ5NjkyNDEwNjQyNDMy.YaDBtw.g0gO1h33AJaXOVO-lIipC865B1w")