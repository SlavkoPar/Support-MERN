import { Types } from "mongoose";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faRemove, faCaretRight, faCaretDown, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from '../../../global/GlobalProvider'
import { ActionTypes, Mode } from "../../types";
import { useCategoryContext, useCategoryDispatch } from '../../Provider'
import { useHover } from '../../../common/components/useHover';
import { IQuestion } from '../../types'

import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import ViewQuestion from "./ViewQuestion";

const QuestionRow = ({ question }: { question: IQuestion }) => {
    const { _id, title, level, inViewing, inEditing, inAdding } = question;

    console.log('QuestionRow REDRAW:', title, inViewing, inEditing, inAdding)
    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, viewQuestion, editQuestion, deleteQuestion } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    const [isExpanded, setIsExpanded] = useState(false);
    const alreadyAdding = state.mode === Mode.AddingQuestion;

    const del = () => {
        deleteQuestion(_id!);
    };

    const edit = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize question
        editQuestion(_id);
    }

    const onSelectQuestion = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize question
        viewQuestion(_id);
    }
    const [hoverRef, hoverProps] = useHover();

    return (
        <>
            <ListGroup.Item
                variant={"secondary"}
                className="py-1 px-1"
                as="li"
            >
                {inAdding && state.mode === Mode.AddingQuestion ? (
                    <AddQuestion question={question} inLine={true} />
                )
                    : (inEditing || inViewing) ? (
                        // <div class="d-lg-none">hide on lg and wider screens</div>
                        <div className="ms-0 d-md-none w-100 px-3">
                            {inEditing && <EditQuestion inLine={true} />}
                            {inViewing && <ViewQuestion inLine={true} />}
                        </div>
                    )
                        : (
                            <div ref={hoverRef} className="d-flex justify-content-start align-items-center w-100">
                                <Button
                                    variant='link'
                                    size="sm"
                                    className="py-0 px-1"
                                    title="Expand"
                                    disabled={alreadyAdding}
                                >
                                    <FontAwesomeIcon 
                                        icon={faQuestion}
                                        className="text-primary" 
                                        size='lg'
                                    />
                                </Button>
                                <Button
                                    variant='link'
                                    size="sm"
                                    className="py-0 mx-1 text-decoration-none text-primary"
                                    title={_id!.toString()}
                                    onClick={() => onSelectQuestion(_id!)}
                                    disabled={alreadyAdding}
                                >
                                    {title}
                                </Button>

                                {canEdit && !alreadyAdding && hoverProps.isHovered &&
                                    <Button variant='link' size="sm" className="ms-1 py-0 px-1"
                                        //onClick={() => { dispatch({ type: ActionTypes.EDIT, question }) }}>
                                        onClick={() => edit(_id!)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-primary" size='lg' />
                                    </Button>
                                }

                                {canEdit && !alreadyAdding && hoverProps.isHovered &&
                                    <Button variant='link' size="sm" className="ms-1 py-0 mx-1"
                                        onClick={del}
                                    >
                                        <FontAwesomeIcon icon={faRemove} className="text-primary" size='lg' />
                                    </Button>
                                }
                            </div>
                        )
                }
            </ListGroup.Item>
        </>
    );
};

export default QuestionRow;
