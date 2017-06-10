/**
 * Created by einavcarmon on 06/06/2017.
 */

import FrequentProblemsList from './components/frequentProblems/frequentProblemsList';
import FrequentProblem from './components/frequentProblems/frequentProblem';
import Ticket from './components/ticket'

export const routes = [

    {
        path: '/',
        component: FrequentProblemsList,
        exact : true
    },
    {
        path:'/ticket',
        component: Ticket,
        exact : true
    },
    {
        path:'/frequent',
        component: FrequentProblem,
        exact : true
    },
    {
        'path':'/frequent/:id',
        'component': FrequentProblem,
        'exact' : true
    }
]
