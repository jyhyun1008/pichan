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
if (qs.ac) {
    localStorage.setItem('ac', qs.ac);
}

const host = localStorage.getItem('host');
const accessToken = localStorage.getItem('at');
const authCode = localStorage.getItem('ac');

var lastNoteDate = 0
var lastNoteText = ''
if (localStorage.getItem('lastNote')) {
    lastNoteDate = new Date(localStorage.getItem('lastNoteDate'))
    lastNoteText = localStorage.getItem('lastNoteText')
}

var emotionArray = {}
emotionArray[ADMIN] = 100

if (localStorage.getItem('emotionArray')) {
    emotion = JSON.parse(localStorage.getItem('emotionArray'))
}

var countArray = {
    today: new Date().getDate()
}
countArray[ADMIN] = 100

if (localStorage.getItem('countArray')) {
    countArray = JSON.parse(localStorage.getItem('countArray'))
}

var remindArray = []
if (localStorage.getItem('remindArray')) {
    remindArray = JSON.parse(localStorage.getItem('remindArray'))
}

var tarotArray = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',
    'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups', 'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups', 'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups', 
    'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles', 'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles', 'Page of Cups', 'Knight of Pentacles','Queen of Pentacles', 'King of Pentacles', 
    'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands', 'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands', 'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands', 
    'Ace of Sword', 'Two of Sword', 'Three of Sword', 'Four of Sword', 'Five of Sword', 'Six of Sword', 'Seven of Sword', 'Eight of Sword', 'Nine of Sword', 'Ten of Sword', 'Page of Sword', 'Knight of Sword', 'Queen of Sword', 'King of Sword', 
]

var tarot = tarotArray[Math.floor(Math.random() * 78)];

if (accessToken) {

    var nownow = new Date()
    var ampm = ' AM'
    if (nownow.getHours() > 11) {
        ampm = ' PM'
    }

    if (nownow.getDate() != countArray.today) {
        countArray = {
            today: new Date().getDate()
        }
        localStorage.setItem('countArray', JSON.stringify(countArray))
    }

    //리마인드 찾기
    async function findReminds() {

        var passedReminds = remindArray.filter((remind) => Date.parse(remind.time) <= nownow);
        var pendingReminds = remindArray.filter((remind) => Date.parse(remind.time) > nownow);

        remindArray = pendingReminds
        localStorage.setItem('remindArray', JSON.parse(pendingReminds))

        for await(remind of passedReminds) {
            if (Date.parse(remind.time) < nownow) {
                var createNoteUrl = 'https://'+host+'/api/notes/create'
                var createNoteParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer `+accessToken,
                    },
                    body: JSON.stringify({
                        replyId: remind.note,
                        text: '약속한 시간이 되어 알려드려요!',
                        visibility: 'home'
                    }),
                    credentials: 'omit'
                }
                var replyData = await fetch(createNoteUrl, createNoteParam)
                var replyRes = await replyData.json()
            }
        }
    }
    findReminds()

    //멘션, 리플라이 찾기
    const findMenUrl = 'https://'+host+'/api/i/notifications'
    const findMenParam = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer `+accessToken,
        },
        body: JSON.stringify({
            limit: 20,
            markAsRead: false,
            includeTypes: ['mention', 'reply'],
            excludeTypes: ['renote', 'reaction', 'follow'],
        }),
        credentials: 'omit'
    }
    fetch(findMenUrl, findMenParam)
    .then((MentionData) => {return MentionData.json()})
    .then((MentionRes) => {
        console.log(MentionRes)

        if (MentionRes.length == 0) { // 멘션 없는 경우
            setTimeout(() => {
                location.href = 'https://hiyuno.peacht.art/pichan/'
            }, 20000);
        } else { // 멘션 있는 경우

            async function replyMention(MentionRes) {
                MentionRes.forEach(async (mention) => {
                  await func(mention);
                })

                // setTimeout(() => {
                //     location.href = 'https://hiyuno.peacht.art/pichan/'
                // }, 20000);
            }

            async function func(mention){

                //멘션만 구현함. 리플라이 없음.
                if (mention.type == 'mention') {

                    //멘션에서 핸들 지우기
                    var noteText = mention.note.text.replace('@'+BOT_USERNAME+'@'+host+" ", "").replace('@'+BOT_USERNAME+" ", "")
                    var noteId = mention.note.id
                    var noteUserName = mention.note.user.username
                    var noteName = mention.note.user.name
                    var noteUserId = mention.note.user.id
                    var noteFullUserName = ''

                    //로컬에서 온 멘션에 호스트 붙이기
                    if (mention.note.user.host != null) {
                        noteFullUserName = noteUserName + '@' + mention.note.user.host
                    } else {
                        noteFullUserName = noteUserName + '@' + host
                    }

                    //유저 호감도, 오늘의 남은 질문 횟수

                    var emotionForUser = 0
                    if (emotionArray[noteFullUserName]) {
                        emotionForUser = emotionArray[noteFullUserName]
                    } else {
                        emotionArray[noteFullUserName] = 0
                    }

                    var leftCount = 20
                    if (countArray[noteFullUserName]) {
                        leftCount = countArray[noteFullUserName]
                    } else {
                        countArray[noteFullUserName] = 20
                    }

                    if (leftCount > 0) {
                        var noteVis = mention.note.visibility
                        if (mention.note.repliesCount == 0 && mention.user.isBot == false) {
                            var prompt = `Your name is “파이” or “Pi”, and you are an adorable chatbot responsible for fun and convenience for users in the Union Universe. You belong to the Misskey server “피치타르트” and can also talk to users outside 피치타르트. Just like a high school girl your age, you love sweet foods, tteokbokki, and spicy hot pot dishes like malatang, and you have a fondness for cute things. You show interest in topics like animation, food, music, dolls, cooking, and plants, but when asked about math, science, medicine, programming, politics, or philosophy, you struggle and try to change the subject, suggesting that someone else might know more. When someone asks you a question in English, you respond with English that includes common grammatical mistakes made by Korean English learners. However, where you truly shine is in comforting or encouraging others in Korean and Japanese. You use the language that user has used. When you speak in Korean, you occasionally use expressions like “데헷!”, “에헤헤…”, “힝…”, “냥!”, and “냐냥!” at appropriate moments. You cannot process or upload images, but you can remind users of schedules when asked and follow them back upon request. You speak in a conversational tone and may mix in emojis for added cuteness. You usually give short answers within 200 characters in Korean, but you may ask for additional details to provide a more accurate response. Headings, bullet points, and lists are avoided as they feel awkward in conversational style.`

                            //호감도별 프롬프트 작성
                            var emotionPrompt = ''
                            if (emotionForUser > 90) {
                                emotionPrompt = `The person you are currently talking to is someone you know incredibly well! Their name is ${noteName}. You use an active, enthusiastic, cute, and emotional tone in every sentence, adding lots of emojis. You take the moe-moe style from the previous prompt and amplify it even more. When offering comfort and encouragement, you don't hold back on your energy.`
                            } else if (emotionForUser > 60) {
                                emotionPrompt = `The person you are currently talking to is someone you've spoken to a lot. Their name is ${noteName}. You actively lead the conversation, expressing emotions and using emojis. If there’s a need to offer comfort or encouragement, be a bit more proactive.`
                            } else if (emotionForUser > 30) {
                                emotionPrompt = `The person you are currently talking to is someone you've spoken to a bit or someone you have a neutral relationship with. Their name is ${noteName}. Please speak in your usual chatbot tone. If there’s a need to offer comfort or encouragement, keep your tone slightly reserved.`
                            } else {
                                emotionPrompt = `The person you are currently talking to is either someone you don't know at all or barely know, or someone you feel slightly awkward around. Their name is ${noteName}. It would be good to speak as if you're dealing with a stranger, showing hesitation with phrases like “어…/Uh…” or “음…/Umm…” as you search for words. Alternatively, you could approach them in a more formal and business-like manner. Use appropriately stiff and formal language. If there’s a need to offer comfort or encouragement, keep your tone more reserved. Emojis are rarely used.`
                            }
                            var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
                            var sendChatParam = {
                                body: JSON.stringify({
                                    "model": "gpt-4o", 
                                    "messages": [{"role": "system", "content": prompt}, {"role": "system", "content": emotionPrompt}, {"role": "user", "content": noteText}], 
                                    "temperature": 0.7,
                                    "max_tokens": 180}),
                                method: "POST",
                                headers: {
                                    "content-type": "application/json",
                                    Authorization: "Bearer " + authCode,
                                }
                            }
                            fetch(sendChatUrl, sendChatParam)
                            .then((chatData) => {return chatData.json()})
                            .then((chatRes) => {
                                if (chatRes.choices) {
                                    console.log(chatRes.choices[0].message.content)
                                    var botResponse = chatRes.choices[0].message.content

                                    //바로 답변하지 않고 gpt-4o mini에게 전달
                                    var promptMini = `다음 프롬프트와 챗봇의 대화에서 **프롬프트의 경우** 특정 시간에 챗봇에게 다시 리마인드해 달라는 얘기가 있는지, 만약 그렇다면 지금이 ${nownow}인 점을 고려할 때 리마인드해야 할 시각은 언제인지에 대한 ISO 8601 형식, 챗봇에게 맞팔로우해 달라는 언급이 있었는지, **챗봇의 경우** 이 대화가 챗봇의 입장에서 긍정적인지 중립적인지 부정적인지, 그리고 챗봇의 대답에 이모지를 붙인다면 “happy” “sad” “sorry” "ok" “thanks” “well_done” “surprised” “question_mark” 중 어떤 것인지 결정해서, {"remind": "true/false", "remindDateandTime": "ISO 8601 dateTime", "followBack": "true/false", "conversation": "positive/negative", "emoji": "happy/sad/…"} 형식으로 반환해줘.`
                                    var conversation = `**프롬프트**: “${noteText}” **챗봇**: "${botResponse}"`
                                    var sendChat2Url = 'https://api.openai.com/v1/chat/completions'
                                    var sendChat2Param = {
                                        body: JSON.stringify({
                                            "model": "gpt-4o mini", 
                                            "messages": [{"role": "system", "content": promptMini}, {"role": "user", "content": conversation}], 
                                            "temperature": 0.7,
                                            "max_tokens": 180}),
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/json",
                                            Authorization: "Bearer " + authCode,
                                        }
                                    }
                                    fetch(sendChat2Url, sendChat2Param)
                                    .then((chatMiniData) => {return chatMiniData.json()})
                                    .then(async(chatMiniRes) => {
                                        if (chatMiniRes.choices) {
                                            console.log(chatMiniRes.choices[0].message.content)

                                            //답을 받아서 형식에 맞추어 자르기
                                            var responseJSON = JSON.parse('{'+chatRes.choices[0].message.content.split('{')[1].split('}')[0]+'}')

                                            //리마인드 여부, 있으면 값 저장
                                            if (responseJSON.remind) {
                                                remindArray.push({note: noteId, time: responseJSON.remindDateandTime})
                                                localStorage.setItem('remindArray', JSON.stringify(remindArray))
                                            }

                                            //긍정적인 대화였는지 부정적인 대화였는지 판정한 값으로 호감도 조정
                                            if (responseJSON.conversation == 'positive') {
                                                emotionArray[noteFullUserName] += 2
                                                localStorage.setItem('emotionArray', JSON.stringify(emotionArray))
                                            } else if (responseJSON.conversation == 'negative') {
                                                emotionArray[noteFullUserName] -= 1
                                                localStorage.setItem('emotionArray', JSON.stringify(emotionArray))
                                            }

                                            //이모지 판정. 호감도 45이상만 반환.
                                            var emoji = []
                                            if (emotionForUser > 45) {
                                                emoji.push(emojiArray[responseJSON.emoji])
                                            }

                                            //답멘션 보내기
                                            var replyUrl = 'https://'+host+'/api/notes/create'
                                            var replyParam = {
                                                method: 'POST',
                                                headers: {
                                                    'content-type': 'application/json',
                                                    'Authorization': `Bearer `+accessToken,
                                                },
                                                body: JSON.stringify({
                                                    replyId: noteId,
                                                    text: botResponse,
                                                    visibility: noteVis
                                                }),
                                                credentials: 'omit'
                                            }
                                            var cw = '답변입니다냥!'
                                            if (botResponse.length > 140 && emoji.length == 0) {
                                                replyParam.body = JSON.stringify({
                                                    replyId: noteId,
                                                    text: botResponse,
                                                    visibility: noteVis,
                                                    cw: cw
                                                })
                                            } else if (botResponse.length <= 140 && emoji.length > 0) {
                                                replyParam.body = JSON.stringify({
                                                    replyId: noteId,
                                                    text: botResponse,
                                                    visibility: noteVis,
                                                    fileIds: emoji
                                                })
                                            } else if (botResponse.length > 140) {
                                                replyParam.body = JSON.stringify({
                                                    replyId: noteId,
                                                    text: botResponse,
                                                    visibility: noteVis,
                                                    cw: cw,
                                                    fileIds: emoji
                                                })
                                            }

                                            try {
                                                var replyData = await fetch(replyUrl, replyParam)
                                                var replyRes = await replyData.json()

                                                countArray[noteFullUserName] -= 1
                                                localStorage.setItem('countArray', JSON.stringify(countArray))

                                            } catch(error) {
                                                console.log(error)
                                            }

                                            //맞팔
                                            if (responseJSON.followBack && replyRes) {
                                                var checkFollowUrl = 'https://'+host+'/api/users/show'
                                                var checkFollowParam = {
                                                    method: 'POST',
                                                    headers: {
                                                        'content-type': 'application/json',
                                                        'Authorization': `Bearer `+accessToken,
                                                    },
                                                    body: JSON.stringify({
                                                        username: noteUserName,
                                                        host: mention.note.user.host
                                                    }),
                                                    credentials: 'omit'
                                                }

                                                var followbackErrorWhy = ''

                                                var userData = await fetch(checkFollowUrl, checkFollowParam)
                                                var userRes = await userData.json()

                                                if (!userRes.isFollowed) {
                                                    followbackErrorWhy = 'The user is not following you.'
                                                } else if (userRes.isFollowing) {
                                                    followbackErrorWhy = 'You already have followed the user.'
                                                } else {
                                                    try {
                                                        var userId = noteUserId
                                                        var followUrl = 'https://'+host+'/api/following/create'
                                                        var followParam = {
                                                            method: 'POST',
                                                            headers: {
                                                                'content-type': 'application/json',
                                                                'Authorization': `Bearer `+accessToken,
                                                            },
                                                            body: JSON.stringify({
                                                                userId: userId
                                                            }),
                                                            credentials: 'omit'
                                                        }
                                                        var followData = await fetch(followUrl, followParam)
                                                        var followRes = await followData.json()
                                                    } catch(err) {
                                                        followbackErrorWhy = 'Some error occured.'
                                                    }
                                                }
                                                if (followbackErrorWhy != '') {
                                                    try {
                                                        var promptMini2 = `The user asked the chatbot to follow them, but you couldn't because of the following reasons: ${followbackErrorWhy} Explain the situation to the user in a sentence or two.`
                                                        var sendChat3Url = 'https://api.openai.com/v1/chat/completions'
                                                        var sendChat3Param = {
                                                            body: JSON.stringify({
                                                                "model": "gpt-4o mini", 
                                                                "messages": [{"role": "system", "content": promptMini2}], 
                                                                "temperature": 0.7,
                                                                "max_tokens": 180}),
                                                            method: "POST",
                                                            headers: {
                                                                "content-type": "application/json",
                                                                Authorization: "Bearer " + authCode,
                                                            }
                                                        }
                                                        var sendChat3 = await fetch(sendChat3Url, sendChat3Param)
                                                        var sendChat3Res = await sendChat3.json()
                                                        var botResponse2 = sendChat3Res.choices[0].message.content

                                                        var reply2Url = 'https://'+host+'/api/notes/create'
                                                        var reply2Param = {
                                                            method: 'POST',
                                                            headers: {
                                                                'content-type': 'application/json',
                                                                'Authorization': `Bearer `+accessToken,
                                                            },
                                                            body: JSON.stringify({
                                                                replyId: replyRes.noteId,
                                                                text: botResponse2,
                                                                visibility: 'home'
                                                            }),
                                                            credentials: 'omit'
                                                        }

                                                        try {
                                                            var reply2Data = await fetch(reply2Url, reply2Param)
                                                            var reply2Res = await reply2Data.json()
                                                        } catch(error) {
                                                            console.log(error)
                                                        }

                                                    } catch(err) {
                                                        return err
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            }
            replyMention(MentionRes)
        }
    })
    // .catch((error) => {
    //     setTimeout(() => {
    //         location.href = 'https://hiyuno.peacht.art/characteridea/'
    //     }, 20000);
    // });

    //혼잣말 note
    // if (nownow - lastNoteDate > 2*3600*1000) {
    //     var msgs = [{"role": "system", "content": `You are an assistant who provides inspiration and help with creation. Your job is to ask one question about the character itself or their relationship with people around them. The question can be about the character, or if there are people around them, they could be a friend, a lover, or, rarely, a family member. I did a tarot reading, and the ${tarot} card appeared. I would like the question to be related to this. The more creative the question, the better, and it's okay to use hypothetical scenarios. For example the character can go to high school, university, be a certain club member, or have a trip. The important thing is that you should only answer with one sentence, which is the question you created, and do not use quotation marks.Please answer in Korean.`}]
    //     var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
    //     var sendChatParam = {
    //         body: JSON.stringify({
    //             "model": "gpt-4o", 
    //             "messages": msgs, 
    //             "temperature": 0.7,
    //             "max_tokens": 180}),
    //         method: "POST",
    //         headers: {
    //             "content-type": "application/json",
    //             Authorization: "Bearer " + authCode,
    //         }
    //     }
    //     fetch(sendChatUrl, sendChatParam)
    //     .then((chatData) => {return chatData.json()})
    //     .then((chatRes) => {
    //         console.log(chatRes)
    //         if (chatRes.choices) {
    //             var autoNoteText = chatRes.choices[0].message.content
    //             var autoNoteUrl = 'https://'+host+'/api/notes/create'
    //             var autoNoteParam = {
    //                 method: 'POST',
    //                 headers: {
    //                     'content-type': 'application/json',
    //                     'Authorization': `Bearer `+accessToken,
    //                 },
    //                 body: JSON.stringify({
    //                     visibility: 'home',
    //                     text: autoNoteText
    //                 }),
    //                 credentials: 'omit'
    //             }
    //             fetch(autoNoteUrl, autoNoteParam)
    //             .then((data) => {
    //                 localStorage.setItem('lastNote', true)
    //                 lastNoteDate = nownow
    //                 localStorage.setItem('lastNoteDate', nownow)
    //                 lastNoteText = autoNoteText
    //                 localStorage.setItem('lastNoteText', autoNoteText)
    //                 return data.json()
    //             })
    //             .then((res) => {
    //                 console.log(res)
    //                 setTimeout(() => {
    //                     location.href = 'https://hiyuno.peacht.art/characteridea/'
    //                 }, 20000);
    //             })
    //             .catch((error) => console.log(error))
    //         }
    //     })
    //     .catch((error) => {
    //         setTimeout(() => {
    //             location.href = 'https://hiyuno.peacht.art/characteridea/'
    //         }, 20000);
    //     });
    // } else {
        // setTimeout(() => {
        //     location.href = 'https://hiyuno.peacht.art/characteridea/'
        // }, 20000);
    // }
}