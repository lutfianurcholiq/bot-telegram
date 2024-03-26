const telegramBot = require('node-telegram-bot-api')

const token = "token dari telegram"

// console.log('bot ready')

// harus ada options untuk mengatur polling
const options = {
    polling: true
}

const seruSekaliBot = new telegramBot(token, options)

// untuk mengaktifkan bot nya
// seruSekaliBot.on("message", (callback) => {
//     const id = callback.from.id
//     seruSekaliBot.sendMessage(id, "haloo jugaa")
// })

// selain menggunakan on, juga bisa menggunakan onText
const prefix = '/'
//const greetings = /^halo$/ // penggunaan regex
const startBot = new RegExp(`^${prefix}start$`)
const sayHi = new RegExp(`^${prefix}halo$`)
const infoGempa = new RegExp(`^${prefix}gempa$`)


// untuk membalas text start
seruSekaliBot.onText(startBot, (callback) => {
    const startText = `
Haiii, haloo selamat datang di bot serusekali
cara cek gempa dengan ${prefix}gempa,
cara cek haloo dengan ${prefix}halo
Terima kasih telah menggunakan bot ini
`
    seruSekaliBot.sendMessage(callback.from.id, startText)
})


// untuk membalas text halo
seruSekaliBot.onText(sayHi, (callback) => {
    seruSekaliBot.sendMessage(callback.from.id, `halooo ${callback.from.first_name} ${callback.from.last_name}`)
})

// untuk membalas text gempa
seruSekaliBot.onText(infoGempa, async(callback) => {
    // mengambil url dari API BMKG
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/"

    const ApiCall = await fetch(BMKG_ENDPOINT + "autogempa.json")
    const { Infogempa : { 
                    gempa : {
                        Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap
                    } 
            }
        } = await ApiCall.json()
    
    const BMKGImage = BMKG_ENDPOINT + Shakemap
    
    const resultText = `
    Waktu : ${Tanggal} | ${Jam}
Besaran : ${Magnitude} SR
Wilayah : ${Wilayah}
Potensi : ${Potensi}
Kedalaman : ${Kedalaman}
`
    // untuk sendMessage hanya bisa mengirimkan text saja
    // seruSekaliBot.sendMessage(callback.from.id, resultText)

    // sendPhoto digunakan untuk mengirimkan foto yang juga bisa ditambahkan caption
    seruSekaliBot.sendPhoto(callback.from.id, BMKGImage, {
        caption: resultText
    })
})