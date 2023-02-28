import { Types } from "mongoose";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faRemove, faCaretRight, faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from '../../global/GlobalProvider'
import { ActionTypes, FORM_MODES } from "../types";
import { useCategoryContext, useCategoryDispatch } from '../Provider'
import List from "./List";
import Add from "./Add";
import Edit from "./Edit";
import CategoryQuestionsView from "./CategoryQuestionsView";
import { useHover } from '../../common/components/useHover';
import AddQuestion from "../../questions/Components/Add";

import { ICategory } from '../types'

const CategoryRow = ({ category }: { category: ICategory }) => {
    const { _id, title, level, inEditing, inAdding, questions } = category;

    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, viewCategoryQuestions, editCategory, deleteCategory } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    const [isExpanded, setIsExpanded] = useState(false);

    const del = () => {
        deleteCategory(_id!);
    };

    const expand = () => {
        const refresh = isExpanded;
        setIsExpanded(!isExpanded);
        if (refresh)
            dispatch({ type: ActionTypes.CLEAN_SUB_TREE, payload: { category } })
    }

    const edit = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize category
        editCategory(_id);
    }

    
    const onSelectCategory = (_id: Types.ObjectId) => {
        // Load data from server and reinitialize category
        viewCategoryQuestions(_id);
    }


    // console.log({ inEditing, isExpanded, inAdding })

    const [hoverRef, hoverProps] = useHover();

    return (
        <>
            {inAdding ? (
                state.mode === FORM_MODES.ADD_QUESTION
                    ? <AddQuestion category={category} inLine={false} />
                    : <Add category={category} inLine={true} />
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
                                onClick={() => onSelectCategory(_id!)}
                            >
                                {title}
                            </Button>

                            {questions && questions.length > 0 &&
                                <Badge bg="primary" pill>
                                    {questions.length}
                                </Badge>
                            }

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
                                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubCategory" >
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

            {(isExpanded || inEditing) && !inAdding &&
                <ListGroup.Item
                    className="py-0 px-0"
                    variant={variant}
                    as="li"
                >
                    {inEditing ? (
                        // <div class="d-lg-none">hide on lg and wider screens</div>
                        <div className="mx-3 d-md-none">
                            {state.mode === FORM_MODES.EDIT && <Edit />}
                            {state.mode === FORM_MODES.VIEW && <CategoryQuestionsView />}
                        </div>
                    )
                        : (
                            <List level={level + 1} parentCategory={_id!} />
                        )}
                </ListGroup.Item>
            }
        </>
    );
};

export default CategoryRow;
