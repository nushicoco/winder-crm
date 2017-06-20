/**
 * Created by einavcarmon on 06/06/2017.
 */

import FrequentProblemsList from './components/frequentProblems/frequentProblemsList';
import FrequentProblem from './components/frequentProblems/frequentProblem';
import NewTicket from './components/newTicket'
import TicketsAdmin from './components/ticketsAdmin'
import ViewTicket from './components/viewTicket'
import Chat from './components/chat/chat';
export const routes = [

    {
        path: '/',
        component: FrequentProblemsList,
        exact : true
    },
    {
        path:'/frequent',
        component: FrequentProblem,
        exact : true
    },
    {
        path: '/frequent/:id',
        component: FrequentProblem,
        exact: true
    },
    {
        path: '/admin/tickets',
        component: TicketsAdmin,
        exact: true
    },
    {
        path: '/view-ticket/:id',
        component: ViewTicket,
        exact: true
    },
    {
        path: '/new-ticket',
        component: NewTicket,
        exact: true
    },
    {
        path: '/chat/:id/:client',
        component: Chat,
        exact: true
    }

]
