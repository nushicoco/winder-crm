/**
 * Created by einavcarmon on 06/06/2017.
 */

import FrequentProblemsList from './components/frequent_problems_list';
import FrequentProblem from './components/frequent_problem';
import Ticket from './components/ticket'

export const routes = [

    {
        'path':'/',
        'component': FrequentProblemsList,
        'exact' : true
    },
    {
        'path':'/ticket',
        'component': Ticket,
        'exact' : true
    },
    {
        'path':'/frequent/:id',
        'component': FrequentProblem,
        'exact' : true
    },
]