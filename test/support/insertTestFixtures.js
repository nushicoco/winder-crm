const {
    sequelize,
    User,
    Ticket,
    TicketUpdate
} = require('../../models')

const users = [
    {
        id: 1,
        firstName: 'פרודו',
        lastName: 'באגינס',
        email: 'frodob@cybershire.com',
        password: 'itisprecious'
    }
]

const tickets = [
    {
        id: 1,
        subject: 'הטבעת לא נשברת',
        userId: 1
    },
    {
        id: 2,
        subject: 'בעיה באיסוף Unobtainium',
        userId: 1
    }

]

const ticketUpdates = [
    {
        id: 1,
        ticketId: 1,
        text: 'ניסיתי לשבור את טבעת עם סלע, גרזן או חרב אבל עד עכשיו ללא הצלחה'
    },
    {
        id: 2,
        ticketId: 2,
        text: 'המצבור הכי גדול של Unobtainium נמצא מתחת ל-Home Tree והמקומיים לא נותנים לנו לחפור שם משום מה.'
    }
]


sequelize.sync({force: true}).then(function () {
    Promise.all(users.map(User.create.bind(User))).then(function () {
        tickets.map(Ticket.create.bind(Ticket))
        ticketUpdates.map(TicketUpdate.create.bind(TicketUpdate))

    })
})
