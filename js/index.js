
function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0].replace(/\?/g, "")] = decodeURIComponent(p[1]);
    }
    return b;
}

var qs = getQueryStringObject();

if (qs.h) {
    localStorage.setItem('host', qs.h);
}
if (qs.at) {
    localStorage.setItem('at', qs.at);
}
if (qs.as) {
    localStorage.setItem('as', qs.as);
}
if (qs.ac) {
    localStorage.setItem('ac', qs.ac);
}

const host = localStorage.getItem('host');
const accessToken = localStorage.getItem('at');
const appSecret = localStorage.getItem('as');
const authCode = localStorage.getItem('ac');

if (accessToken && appSecret) {
    const i = CryptoJS.SHA256(accessToken + appSecret).toString(CryptoJS.enc.Hex);
    console.log(i)
    const findIdUrl = 'https://'+host+'/api/i'
    const findIdParam = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            i: i
        }),
        credentials: 'omit'
    }
    fetch(findIdUrl, findIdParam)
    .then((idData) => {return idData.json()})
    .then((idRes) => {
        console.log(idRes)
        if (idRes.username) {
            var  myUserName = idRes.username
            if (myUserName == 'pi') {
                const findMenUrl = 'https://'+host+'/api/i/notifications'
                const findMenParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: i,
                        markAsRead: false
                    }),
                    credentials: 'omit'
                }
                fetch(findMenUrl, findMenParam)
                .then((MentionData) => {return MentionData.json()})
                .then((MentionRes) => {
                    console.log(MentionRes)
                    if (MentionRes.length == 0) {
                        setTimeout(() => {
                            location.href = 'https://yeojibur.in/pichan/'
                        }, 10000);
                    } else {

                        async function replyMention(MentionRes) {
                            MentionRes.forEach(async (mention) => {
                              await func(mention);
                            })
                        }
                          
                        async function func(mention){
                            if (mention.type == 'mention') {
                                var noteText = mention.note.text
                                var noteId = mention.note.id
                                if (mention.note.repliesCount == 0) {
                                    var prompt = `you are a helpful, knowledge sharing chatbot. Your name is '파이'. I say: ${noteText}. You reply:`
                                    var sendChatUrl = 'https://api.openai.com/v1/completions'
                                    var sendChatParam = {
                                        body: JSON.stringify({
                                            "model": "text-davinci-003", 
                                            "prompt": prompt, 
                                            "temperature": 0.86, 
                                            "max_tokens": 256}),
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/json",
                                            Authorization: "Bearer " + authCode,
                                        }
                                    }
                                    fetch(sendChatUrl, sendChatParam)
                                    .then((chatData) => {return chatData.json()})
                                    .then((chatRes) => {
                                        console.log(chatRes)
                                        if (chatRes.choices) {
                                            var response = chatRes.choices[0].text.trim()
                                            var replyUrl = 'https://'+host+'/api/notes/create'
                                            var replyParam = {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    i: i,
                                                    replyId: noteId,
                                                    text: response
                                                }),
                                                credentials: 'omit'
                                            }
                                            fetch(replyUrl, replyParam)
                                            .then((replyData) => {return replyData.json()})
                                            .then((replyRes) => {})
                                            .catch((error) => console.log(error));
                                        }
                                    })
                                    .catch((error) => console.log(error));
                                }
                            }
                        }

                        replyMention(MentionRes)
                    }
                })
                .catch((error) => console.log(error));
            }
        }
    })
    .catch((error) => console.log(error));
}