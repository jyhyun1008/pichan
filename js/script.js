$("#terminal").terminal(async function (command, terminal) {
    try {
        const prompt = `you are a helpful, knowledge sharing chatbot. I say: ${command}. You reply:`
        const response = await fetch(`https://api.openai.com/v1/completions`,
                    {
                        body: JSON.stringify({"model": "text-davinci-003", "prompt": prompt, "temperature": 0.86, "max_tokens": 256}),
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            Authorization: "Bearer sk-"+code1+code2+code3+code4,
                        },
                            }
                ).then((response) => {
                    console.log(response)
                    if (response.ok) {
                        response.json().then((json) => {
                            terminal.echo(json.choices[0].text.trim());
                        });
                    }
                });
        console.log("Completed!");
    } catch (err) { console.error(`Error: ${err}`) }
},
    {
        greetings: 'GPT-3 Chatbot',
        name: 'gpt3_demo',
        height: 400,
        width: 800,
        prompt: '> '
    });
