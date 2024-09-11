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

// var tarotArray = [
//     'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World',
//     'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups', 'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups', 'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups', 
//     'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles', 'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles', 'Page of Cups', 'Knight of Pentacles','Queen of Pentacles', 'King of Pentacles', 
//     'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands', 'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands', 'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands', 
//     'Ace of Sword', 'Two of Sword', 'Three of Sword', 'Four of Sword', 'Five of Sword', 'Six of Sword', 'Seven of Sword', 'Eight of Sword', 'Nine of Sword', 'Ten of Sword', 'Page of Sword', 'Knight of Sword', 'Queen of Sword', 'King of Sword', 
// ]

// var tarot = tarotArray[Math.floor(Math.random() * 78)];

var menuArray = ["delievered food", "burger", "sandwitch", "컵라면과 김밥", "in the Korean restaurant", "malatang", "엽떡", "맛있는 돈까스", "규동"]
var topicArray = ["server maintainance which is difficult", "anime & games", "Mathematics homework problem", "your secret", "예쁜 카페와 귀여운 소품샵"]

var menu = menuArray[Math.floor(Math.random() * menuArray.length)];
var topic = topicArray[Math.floor(Math.random() * topicArray.length)];

var scheduleArray = [
    ["checking timeline of fediverse users", "checking timeline of fediverse users", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some 아점", "watching anime", "watching anime", "playing games", "playing games", "checking timeline of fediverse users", "checking timeline of fediverse users", "having dinner, which is ${menu}", "chatting with friends", "chatting with friends", "playing games", "playing games", "checking timeline of fediverse users"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "already had breakfast and preparing for school", "class 1: Korean language & literature", "class 2: Math", "class 3: PE class", "having lunch in school, which is Korean 급식", "already had lunch, and class 4: English", "class 5: ethics", "class 6: Biology", "end of school and going to 피치타르트 본부", "having some afternoon tea", "having dinner with 민도아 선배, which is ${menu}", "already had dinner, and checking timeline of fediverse users", "just chatting with 민도아 선배,  talking about ${topic}", "on the way home", "sleep", "sleep"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "already had breakfast and preparing for school", "class 1: Korean history", "class 2: English", "class 3: Chemistry", "having lunch in school, which is Korean 급식", "already had lunch, and class 4: Math", "class 5: Physics", "class 6: Korean language & literature", "end of school and going to 피치타르트 본부", "having some afternoon tea", `having dinner with 민도아 선배, which is ${menu}`, "already had dinner, and checking timeline of fediverse users", `just chatting with 민도아 선배, talking about ${topic}`, "on the way home", "sleep", "sleep"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "already had breakfast and preparing for school", "class 1: Math", "class 2: English", "class 3: music", "having lunch in school, which is Korean 급식", "already had lunch, and class 4: Korean language & literature", "class 5: Computer science", "class 6: PE class", "end of school and going to 피치타르트 본부", "having some afternoon tea", `having dinner with 민도아 선배, which is ${menu}`, "already had dinner, and checking timeline of fediverse users", `just chatting with 민도아 선배, talking about ${topic}`, "on the way home", "sleep", "sleep"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "already had breakfast and preparing for school", "class 1: Ethics", "class 2: Physics", "class 3: Math", "having lunch in school, which is Korean 급식", "already had lunch, and class 4: Chemistry", "class 5: English", "class 6: Korean language & literature", "end of school and going to 피치타르트 본부", "having some afternoon tea", `having dinner with 민도아 선배, which is ${menu}`, "already had dinner, and checking timeline of fediverse users", `just chatting with 민도아 선배, talking about ${topic}`, "on the way home", "sleep", "sleep"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "already had breakfast and preparing for school", "class 1: English", "class 2: Biology", "class 3: Chemistry", "having lunch in school, which is Korean 급식", "already had lunch, and class 4: Math", "class 5: Korean History", "class 6: arts", "end of school and going to 피치타르트 본부", "having some afternoon tea", `having dinner with 민도아 선배, which is ${menu}`, "already had dinner, and checking timeline of fediverse users", `just chatting with 민도아 선배, talking about ${topic}`, "on the way home with happy because it is friday","checking timeline of fediverse users", "checking timeline of fediverse users"],
    ["sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "sleep", "to wake up and having some breakfast", "watching anime", "baking some cookies and cakes for lunch", "having lunch, mostly cookies and cakes", "playing games", "playing games", "checking timeline of fediverse users", "checking timeline of fediverse users", "chatting with friends", "having dinner, which is ${menu}", "chatting with friends", "chatting with friends", "playing games", "playing games", "checking timeline of fediverse users"]]

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
        countArray[ADMIN] = 100
        localStorage.setItem('countArray', JSON.stringify(countArray))
    }

    //리마인드 찾기
    async function findReminds() {

        var passedReminds = remindArray.filter((remind) => Date.parse(remind.time) <= nownow);
        var pendingReminds = remindArray.filter((remind) => Date.parse(remind.time) > nownow);

        remindArray = pendingReminds
        localStorage.setItem('remindArray', JSON.stringify(pendingReminds))

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
                location.href = 'https://page.peacht.art/pichan/'
            }, 20000);
        } else { // 멘션 있는 경우

            async function replyMention(MentionRes) {
                MentionRes.forEach(async (mention) => {
                  await func(mention);
                })

                // setTimeout(() => {
                //     location.href = 'https://page.peacht.art/pichan/'
                // }, 20000);
            }

            async function func(mention){

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

                var noteVis = mention.note.visibility

                if (leftCount > 0) {
                    if (mention.note.repliesCount == 0 && mention.user.isBot == false) {
                        var prompt = GENERAL_PROMPT

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

                        var msgs = [{"role": "system", "content": prompt}, {"role": "system", "content": emotionPrompt}]

                        //리플라이일 때
                        if (mention.type == 'reply') {
                            var noteContextUrl = 'https://'+host+'/api/notes/conversation'
                            var noteContextParam = {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': `Bearer `+accessToken,
                                },
                                body: JSON.stringify({
                                    limit: 100,
                                    noteId: noteId
                                }),
                                credentials: 'omit'
                            }
                            var contextData = await fetch(noteContextUrl, noteContextParam)
                            var contextRes = await contextData.json()

                            for await(cont of contextRes) {
                                var role = ''
                                var content = ''
                                if (cont.user.username == BOT_USERNAME) {
                                    role = 'assistant'
                                } else {
                                    role = 'user'
                                }
                                if (cont.text !== null) {
                                    content = cont.text
                                }
                                msgs.push({"role": role, "content": content})
                            }
                        }

                        msgs.push({"role": "user", "content": noteText})

                        //호감도별 프롬프트 작성
                        var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
                        var sendChatParam = {
                            body: JSON.stringify({
                                "model": "gpt-4o", 
                                "messages": msgs, 
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

                                //바로 답변하지 않고 gpt-4o-mini에게 전달
                                var promptMini = `다음 프롬프트와 챗봇의 대화에서 **프롬프트의 경우** 특정 시간에 챗봇에게 다시 리마인드해 달라는 얘기가 있는지, 만약 그렇다면 지금이 ${nownow}인 점을 고려할 때 리마인드해야 할 시각은 언제인지에 대한 ISO 8601 형식, 챗봇에게 맞팔로우해 달라는 언급이 있었는지, **챗봇의 경우** 이 대화가 챗봇의 입장에서 긍정적인지 중립적인지 부정적인지, 그리고 챗봇의 대답에 이모지를 딱 하나만 고른다면 “joy”, “sad”, “sorry”, "ok", “thanks”, “well_done”, “surprised”, “question_mark” 중 어떤 것인지 결정해서, {"remind": "true/false", "remindDateandTime": "ISO 8601 dateTime", "followBack": "true/false", "conversation": "positive/negative", "emoji": "joy/sad/sorry/ok/thanks/well_done/surprised/question_mark"} 형식으로 반환해줘.`
                                var conversation = `**프롬프트**: “${noteText}” **챗봇**: "${botResponse}"`
                                var sendChat2Url = 'https://api.openai.com/v1/chat/completions'
                                var sendChat2Param = {
                                    body: JSON.stringify({
                                        "model": "gpt-4o-mini", 
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
                                        var responseJSON = JSON.parse('{'+chatMiniRes.choices[0].message.content.split('{')[1].split('}')[0]+'}')

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
                                        if (responseJSON.followBack == "true" && replyRes) {
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
                                                    var promptMini2 = `The user asked the chatbot to follow them, as '${noteText}' but you couldn't because of the following reasons: ${followbackErrorWhy} Explain the situation in to the user in a sentence or two. Please use same language as user.`
                                                    var sendChat3Url = 'https://api.openai.com/v1/chat/completions'
                                                    var sendChat3Param = {
                                                        body: JSON.stringify({
                                                            "model": "gpt-4o-mini", 
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
                                                            replyId: noteId,
                                                            text: botResponse2,
                                                            visibility: 'home'
                                                        }),
                                                        credentials: 'omit'
                                                    }

                                                    try {
                                                        var reply2Data = await fetch(reply2Url, reply2Param)
                                                        var reply2Res = await reply2Data.json()
                                                        console.log(reply2Res)
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
            replyMention(MentionRes)
        }
    })
    .catch((error) => {
        setTimeout(() => {
            location.href = 'https://page.peacht.art/pichan/'
        }, 20000);
    });

    //혼잣말 note
    if (nownow - lastNoteDate > 5*1800*1000) {
        var scheduleNow = scheduleArray[nownow.getDay()][nownow.getHours()]
        if (scheduleNow !== 'sleep') {

            var prompt = GENERAL_PROMPT
            var schedulePrompt = `The date and time now is ${Date.toString(nownow)} and Your schedule is ${scheduleNow}. Please share your experience while doing that schedule.`
            var msgs = [{"role": "system", "content": prompt}, {"role": "system", "content": schedulePrompt}]
            var sendChatUrl = 'https://api.openai.com/v1/chat/completions'
            var sendChatParam = {
                body: JSON.stringify({
                "model": "gpt-4o", 
                    "messages": msgs, 
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
                console.log(chatRes)
                if (chatRes.choices) {
                    var autoNoteText = chatRes.choices[0].message.content
                    var autoNoteUrl = 'https://'+host+'/api/notes/create'
                    var autoNoteParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer `+accessToken,
                        },
                        body: JSON.stringify({
                            visibility: 'home',
                            text: autoNoteText
                        }),
                        credentials: 'omit'
                    }
                    fetch(autoNoteUrl, autoNoteParam)
                    .then((data) => {
                        localStorage.setItem('lastNote', true)
                        lastNoteDate = nownow
                        localStorage.setItem('lastNoteDate', nownow)
                        lastNoteText = autoNoteText
                        localStorage.setItem('lastNoteText', autoNoteText)
                        return data.json()
                    })
                    .then((res) => {
                        console.log(res)
                        setTimeout(() => {
                            location.href = 'https://page.peacht.art/pichan/'
                        }, 20000);
                    })
                    .catch((error) => console.log(error))
                }
            })
        } else {
            localStorage.setItem('lastNote', true)
            lastNoteDate = nownow
            localStorage.setItem('lastNoteDate', nownow)
            lastNoteText = ''
            localStorage.setItem('lastNoteText', '')
            setTimeout(() => {
                location.href = 'https://page.peacht.art/pichan/'
            }, 20000);
        }
    } else {
        setTimeout(() => {
            location.href = 'https://page.peacht.art/pichan/'
        }, 20000);
    }
}