/**
 * Created by einavcarmon on 06/06/2017.
 */

import FrequentProblemsList from './components/frequentProblems/frequentProblemsList';
import FrequentProblem from './components/frequentProblems/frequentProblem';
import NewTicket from './components/newTicket'
import TicketsList from './components/ticketsList'
import FrequentProblemAdmin from './components/frequentProblems/frequentProblemAdmin'
import ViewTicket from './components/viewTicket'
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
        path: '/tickets',
        component: TicketsList,
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
        path: '/admin/frequent-problems',
        component: FrequentProblemAdmin,
        exact: true
    }
]
