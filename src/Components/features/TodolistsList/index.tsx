import * as taskActions from './task-actions';
import * as todolistsAsyncActions from './todolists-actions'

import {slice} from './todolists-reducer'

const todolistsActions = {
    ...slice.actions,
    ...todolistsAsyncActions
}

export {
    taskActions,
    todolistsActions
}
