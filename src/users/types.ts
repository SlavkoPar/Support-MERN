import { Types } from 'mongoose';

import { IDateAndBy } from '../globalTypes';
import { IOption } from '../common/types';


export interface IUser {
	_id?: Types.ObjectId,
	userName: string,
	role: string,
	isExpanded?: boolean,
	created?: IDateAndBy,
	modified?: IDateAndBy,
	inEditing?: boolean,
	inAdding?: boolean
}
