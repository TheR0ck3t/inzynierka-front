document.getElementById("msgForm").addEventListener("submit", async(e) => {
    e.preventDefault();
    const message = document.getElementById("msgInput").value;

    axios.post('api/test', { message: message }) // Zmiana endpointu na /api/test
        .then(response => {
            console.log('Odpowiedź z API:', response.data);
        })
        .catch(error => {
            console.error('Błąd:', error);
        });

});