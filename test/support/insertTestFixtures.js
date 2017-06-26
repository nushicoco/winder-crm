process.env.NOTIFICATION_URL = 'false'
require('dotenv-safe').load(); // Load env vars from ./.env

const {
    sequelize,
    User,
    Ticket,
    TicketUpdate,
    Chat,
    ChatMessage
} = require('../../models')

const users = [
    {
        id: 1,
        firstName: 'פרודו',
        lastName: 'באגינס',
        email: 'frodob@cybershire.com',
        password: 'itisprecious'
    },
    {
        id: 2,
        firstName: 'ג׳ק',
        lastName: 'סאלי',
        email: 'sally@pandora.com',
        password: 'iseeyou'
    }
]

const tickets = [
    {
        id: 1,
        subject: 'הטבעת לא נשברת',
        status: 'open',
        userId: 1
    },
    {
        id: 2,
        subject: 'בעיה באיסוף Unobtainium',
        status: 'closed',
        userId: 1
    }

]

const ticketUpdates = [
    {
        id: 1,
        ticketId: 1,
        userId: 1,
        text: 'ניסיתי לשבור את טבעת עם סלע, גרזן או חרב אבל עד עכשיו ללא הצלחה'
    },
    {
        id: 2,
        userId: 1,
        ticketId: 1,
        text: ' top secret Information Terrorism NSCT FAMS sneakers SIG Soviet UNCPCJ HALO explosive bank Meth Lab La Familia Peering Roswell '
    },

    {
        id: 3,
        userId: 1,
        ticketId: 1,
        text: ' Bin Laden FMD import SUN Ft. Bragg Shootout finks AMEMB CDA Planet-1 Recall Tsunami Warning Center TDR Interstate SONANGOL '
    },

    {
        id: 13,
        ticketId: 2,
        userId: 1,
        text: 'המצבור הכי גדול של Unobtainium נמצא מתחת ל-Home Tree והמקומיים לא נותנים לנו לחפור שם משום מה.'
    }
]


sequelize.sync({force: true}).then(function () {
    Promise.all(users.map(User.create.bind(User))).then(function () {
        tickets.map(Ticket.create.bind(Ticket))
        ticketUpdates.map(TicketUpdate.create.bind(TicketUpdate))

    })
})
