$("#submit-word").on('submit', async function handle_submit(evt){
    evt.preventDefault();
    const word = $("#guessed-word").val();
    const results = await axios.post("http://127.0.0.1:5000/check", {"word": word});
    console.log(results)
})