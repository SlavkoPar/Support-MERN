import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faRemove, faCaretRight, faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from '../../global/GlobalProvider'
import { ActionTypes } from "../types";
import { useQuestionContext, useQuestionDispatch } from '../Provider'
import List from "./List";
import Add from "./Add";
import Edit from "./Edit";
import { Types } from "mongoose";
import { useHover } from '../../common/components/useHover';

import { IQuestion } from '../types'

const QuestionRow = ({ question }: { question: IQuestion }) => {
    const { _id, title, level, inEditing, inAdding } = question;

    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, editQuestion, deleteQuestion } = useQuestionContext();
    const dispatch = useQuestionDispatch();

    const [isExpanded, setIsExpanded] = useState(false);

    const del = () => {
        deleteQuestion(_id!);
    };

    const expand = () => {
        const refresh = isExpanded;
        setIsExpanded(!isExpanded);
        if (refresh)
            dispatch({ type: ActionTypes.CLEAN_SUB_TREE, payload: { question } })
    }

    const edit = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize question
        editQuestion(_id);
    }
    // console.log({ inEditing, isExpanded, inAdding })
    const [hoverRef, hoverProps] = useHover();

    return (
        <>
            {inAdding ? (
                <Add question={question} inLine={true} />
            )
                : (
                    <ListGroup.Item
                        variant={variant}
                        className="py-1 px-1"
                        as="li"
                    >
                        <div ref={hoverRef} className="d-flex justify-content-start align-items-center">
                            <Button
                                variant='link'
                                size="sm"
                                className="py-0 px-1"
                                onClick={expand}
                                title="Expand"
                            >
                                <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} color='orange' size='lg' />
                            </Button>
                            <Button
                                variant='link'
                                size="sm"
                                className="py-0 mx-1 text-decoration-none"
                                title={_id!.toString()}
                            // onClick={() => onSelectQuestion(questionId)}
                            >
                                {title}
                            </Button>
                            <Badge bg="primary" pill>
                                {11}
                            </Badge>

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubQuestion" >
                                    <FontAwesomeIcon icon={faPlus} color='orange' size='lg'
                                        onClick={() => {
                                            dispatch({
                                                type: ActionTypes.ADD,
                                                payload: {
                                                    parentQuestion: question._id,
                                                    level: question.level
                                                }
                                            })
                                            if (!isExpanded)
                                                setIsExpanded(true)
                                        }}
                                    />
                                </Button>
                            }

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-1 py-0 px-1"
                                    //onClick={() => { dispatch({ type: ActionTypes.EDIT, question }) }}>
                                    onClick={() => edit(_id!)}
                                >
                                    <FontAwesomeIcon icon={faEdit} color='orange' size='lg' />
                                </Button>
                            }

                            {canEdit && hoverProps.isHovered &&
                                <Button variant='link' size="sm" className="ms-1 py-0 mx-1" style={{border: '1px solid orange'}}
                                    onClick={del}
                                >
                                    <FontAwesomeIcon icon={faRemove} color='orange' size='sm' />
                                </Button>
                            }
                        </div>
                    </ListGroup.Item>
                )
            }

            {(isExpanded || inEditing) && !inAdding &&
                <ListGroup.Item 
                    className="py-0 px-0"
                    variant={variant} 
                    as="li"
                >
                    {inEditing ? ( // store.mode === FORM_MODES.EDIT &&
                        // <div class="d-lg-none">hide on lg and wider screens</div>
                        <div className="mx-3 d-md-none">
                            <Edit />
                        </div>
                    )
                    : (
                        <List level={level + 1} parentQuestion={_id!} />
                    )}
                </ListGroup.Item>
            }
        </>
    );
};

export default QuestionRow;
