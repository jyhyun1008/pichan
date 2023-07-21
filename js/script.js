$("#terminal").terminal(async function (command, terminal) {
    try {
        const prompt = `you are a helpful, knowledge sharing chatbot. I say: ${command}. You reply:`
        const response = await fetch(`https://api.openai.com/v1/chat/completions`,
                  {
                      body: JSON.stringify({"model": "text-davinci-003", "prompt": prompt, "temperature": 0.86, "max_tokens": 256}),
                      method: "POST",
                      headers: {
                          "content-type": "application/json",
                          "Authorization": "Bearer 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",
                      },
                          }
              ).then((response) => {
                  if (response.ok) {
                    console.log(response)
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
