// import { PrismaClient } from '@prisma/client'
const express = require('express')
const bodyParser = require('body-parser')

const path = require('path')
const moment = require('moment')
const {HOST} = require('./src/constants')
const db = require('./src/database')


// const prisma = new PrismaClient()

const PrismaClient = require('@prisma/client').PrismaClient
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000
const cors = require('cors')

const app = express()
    .set('port', PORT)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())
// Static public files
app.use(express.static(path.join(__dirname, 'public')))


app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src *");
    return next();
});

app.get('/', function (req, res) {
    res.send('Get ready for OpenSea!');
})



//get token by id
app.get('/api/token/:token_id', function (req, res) {

    const tokenId = parseInt(req.params.token_id)
    const tokenPromise = prisma.token.findFirst({
        where: {
            id: tokenId
        }
    })
    tokenPromise.then(it => res.send(it))
})

app.post('/api/token', function (req, res) {


    const createdToken = createToken(req.body)
    createdToken.then(it => res.send(it))

})

app.get('/image/:token_id', function (req, res) {
    const tokenId = parseInt(req.params.token_id)
    const tokenPromise = prisma.token.findFirst({
        where: {
            id: tokenId
        }
    })
    tokenPromise.then(it => res.send(it.image))
})


async function createToken(req) {
    console.log(req)
    // ... you will write your Prisma Client queries here
    return prisma.token.create({
        data: {
            id: req.token_id,
            title: req.title,
            artist: req.artist,
            spotify_uri: req.spotify_uri,
            image: req.image,
        },
    })

    // return prisma.token.findFirst({
    //     where: {
    //         id: req.token_id
    //     }
    // })
}

async function main() {
    // ... you will write your Prisma Client queries here
    const allUsers = await prisma.token.findMany()
    console.log(allUsers)
    return allUsers
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
function zodiac(day, month) {
    var zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
    var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
    return (day > last_day[month]) ? zodiac[month * 1 + 1] : zodiac[month];
}

function monthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    return monthNames[month - 1]
}