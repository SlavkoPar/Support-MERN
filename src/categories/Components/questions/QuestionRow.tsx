import { Types } from "mongoose";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faRemove, faCaretRight, faCaretDown, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from '../../../global/GlobalProvider'
import { ActionTypes, FORM_MODES, ICategory } from "../../types";
import { useCategoryContext, useCategoryDispatch } from '../../Provider'
//import QuestionQuestionsView from "./QuestionQuestionsView";
import { useHover } from '../../../common/components/useHover';

import { IQuestion } from '../../types'

const QuestionRow = ({ category, question }: { category: ICategory, question: IQuestion }) => {
    const { _id, title, level, inEditing, inAdding  } = question;

    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, viewQuestion, editQuestion, deleteQuestion } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    const [isExpanded, setIsExpanded] = useState(false);

    const del = () => {
        deleteQuestion(_id!);
    };

   
    const edit = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize category
        editQuestion(_id);
    }

    const onSelectQuestion = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize category
        viewQuestion(_id);
    }

    const [hoverRef, hoverProps] = useHover();
    return (
        <>
            {inAdding ? (
                // state.mode === FORM_MODES.ADD_QUESTION
                //     ? <AddQuestion category={category} inLine={false} />
                //     : <Add category={category} inLine={true} />
                <div/>
            )
                : (
                    <ListGroup.Item
                        variant={variant}
                        className="py-1 px-1"
                        as="li"
                        style={{backgroundColor: 'lightcyan'}}
                    >
                        <div ref={hoverRef} className="d-flex justify-content-start align-items-center">
                            <Button
                                variant='link'
                                size="sm"
                                className="py-0 px-1"
                                title="Expand"
                            >
                                <FontAwesomeIcon icon={faQuestion} color='teal' size='sm' />
                            </Button>
                            <Button
                                variant='link'
                                size="sm"
                                className="py-0 mx-1 text-decoration-none"
                                title={_id!.toString()}
                                onClick={() => onSelectQuestion(_id!)}
                            >
                                {title}
                            </Button>

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-1 py-0 px-1"
                                    //onClick={() => { dispatch({ type: ActionTypes.EDIT, category }) }}>
                                    onClick={() => edit(_id!)}
                                >
                                    <FontAwesomeIcon icon={faEdit} color='orange' size='lg' />
                                </Button>
                            }

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-1 py-0 mx-1" style={{ border: '1px solid orange' }}
                                    onClick={del}
                                >
                                    <FontAwesomeIcon icon={faRemove} color='orange' size='sm' />
                                </Button>
                            }

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubQuestion" >
                                    <FontAwesomeIcon icon={faPlus} color='orange' size='lg'
                                        onClick={() => {
                                            dispatch({
                                                type: ActionTypes.ADD,
                                                payload: {
                                                    parentCategory: category._id,
                                                    level: category.level
                                                }
                                            })
                                            if (!isExpanded)
                                                setIsExpanded(true)
                                        }}
                                    />
                                </Button>
                            }

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add Question" >
                                    <FontAwesomeIcon icon={faPlus} color='orange' size='lg'
                                        onClick={() => {
                                            dispatch({
                                                type: ActionTypes.ADD_QUESTION,
                                                payload: { category }
                                            })
                                            if (!isExpanded)
                                                setIsExpanded(true)
                                        }}
                                    />
                                </Button>
                            }

                        </div>
                    </ListGroup.Item>
                )
            }
        </>
    );
};

export default QuestionRow;
