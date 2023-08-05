
const express = require('express')
const app = express()
const port = 3000
const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');


// Path donde la sesión va a estar guardada
//NO ES NECESARIO
//const SESSION_FILE_PATH = './session.json';

// Cargar sesión en caso de que exista una ya guardada
//NO ES NECESARIO
//let sessionData;
//if(fs.existsSync(SESSION_FILE_PATH)) {
//    sessionData = require(SESSION_FILE_PATH);
//}

// Uso de valores guardados
// ¡LINEA MODIFICADA!
//const client = new Client({
//    authStrategy: new LegacySessionAuth({
//        session: sessionData
//    })
//});
const client = new Client({
     authStrategy: new LocalAuth({
          clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
     })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    //NO ES NECESARIO PERO SI QUIERES AGREGAS UN console.log
    //sessionData = session;
    //fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    //    if (err) {
    //        console.error(err);
    //    }
    //});
});
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})


client.on("ready", () => {
    console.log("Ready")
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/api', async (req, res) => {
  let tujuan = req.query.tujuan;
  let pesan =  req.query.pesan;
  const chatId = tujuan +"@c.us"

  let cekUser = await client.isRegisteredUser(tujuan);

if(cekUser == true){
  client.sendMessage(chatId,pesan);
   res.json({status: true, pesan: pesan, msg : "Pesan berhasil terkirim"});
}else{
    res.json({status: false, pesan: pesan, msg : "Pesan gagal terkirim"});
}

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
