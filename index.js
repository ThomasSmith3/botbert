var config = require('./config');

const { RTMClient, WebClient } = require('@slack/client');

const rtm = new RTMClient(config.token);
rtm.start();

const syn = [
    {regex: /.*what.*status.*of\s(\w+).*$/i,
     handler: require('./handler/gpufree.js')},

    {regex: /^hello.*|good morning.*|^hey.*/gi,
     handler: require('./handler/greeting.js')},

    {regex: /.*the next meeting.*on (.*\w)/gi,
     handler: require('./handler/meeting.js').set},
    {regex: /.*when is the.*meeting/gi,
     handler: require('./handler/meeting.js').get},

    {regex: /^who is (.*)/gi,
     handler: require('./handler/whois.js')},

];

rtm.on('message', (msg) => {
    for (s in syn) {
	var matches = syn[s].regex.exec(msg.text);
	if (matches != null) {
	    syn[s].handler(matches, msg, rtm);
	    break;
	}
    }    
});
