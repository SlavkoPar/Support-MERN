import { Types } from "mongoose";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faRemove, faCaretRight, faCaretDown, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from '../../global/GlobalProvider'
import { ActionTypes, FormModes } from "../types";
import { useCategoryContext, useCategoryDispatch } from '../Provider'
import { useHover } from '../../common/components/useHover';
import { ICategory } from '../types'

import CategoryList from "./CategoryList";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import CategoryView from "./CategoryView";
import AddQuestion from "./questions/AddQuestion";
import QuestionList from "./questions/QuestionList";

const CategoryRow = ({ category }: { category: ICategory }) => {
    const { _id, title, level, inViewing, inEditing, inAdding, questions } = category;

    console.log('C:', title, inViewing, inEditing, inAdding)
    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, viewCategory, editCategory, deleteCategory } = useCategoryContext();
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
        viewCategory(_id);
    }
    const [hoverRef, hoverProps] = useHover();

    const Row1 =
        <>
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
                style={{ color: "orange" }}
                className="py-0 mx-1 text-decoration-none"
                title={_id!.toString()}
                onClick={() => onSelectCategory(_id!)}
            >
                {title}
            </Button>

            {questions && questions.length > 0 &&
                <Badge bg="primary" pill>
                    {questions.length} <FontAwesomeIcon icon={faQuestion} size='sm' />
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
                <Button variant='link' size="sm" className="ms-1 py-0 mx-1"
                    onClick={del}
                >
                    <FontAwesomeIcon icon={faRemove} color='orange' size='lg' />
                </Button>
            }

            {canEdit && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubCategory" >
                    <FontAwesomeIcon icon={faPlus} color='orange' size='lg'
                        onClick={() => {
                            if (!isExpanded)
                                setIsExpanded(true);
                            dispatch({
                                type: ActionTypes.ADD_CATEGORY,
                                payload: {
                                    parentCategory: category._id,
                                    level: category.level
                                }
                            })
                        }}
                    />
                </Button>
            }

            {canEdit && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add Question" >
                    <FontAwesomeIcon icon={faPlus} color='blue' size='lg'
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.ADD_QUESTION,
                                payload: { category }
                            })
                            //if (!isExpanded)
                            //    setIsExpanded(true)
                        }}
                    />
                </Button>
            }
        </>

    return (
        <>
            {inAdding ? (
                // state.mode === FormModes.AddingCategory 
                //     ? <AddCategory category={category} inLine={true} />
                //     : state.mode === FormModes.AddingQuestion
                //         ? <AddQuestion />
                //         : null
                null
            )
                : (
                    <ListGroup.Item
                        variant={variant}
                        className="py-1 px-1"
                        as="li"
                    >
                        <div ref={hoverRef} className="d-flex justify-content-start align-items-center">
                            {Row1}
                        </div>
                    </ListGroup.Item>
                )
            }

            {!inAdding && (isExpanded || inViewing || inEditing) && // row2
                <ListGroup.Item
                    className="py-0 px-0"
                    variant={variant}
                    as="li"
                >
                    {isExpanded &&
                        <>
                            <CategoryList level={level + 1} parentCategory={_id!} />

                            {(inEditing || inViewing) &&
                                // <div class="d-lg-none">hide on lg and wider screens</div>
                                <div className="ms-4 d-md-none border">
                                    {inEditing && state.mode === FormModes.EditingCategory && <EditCategory />}
                                    {inViewing && state.mode === FormModes.ViewingCategory && <CategoryView />}
                                </div>
                            }

                            <QuestionList level={level + 1} parentCategory={_id!} />
                        </>
                    }

                    {!isExpanded && (inEditing || inViewing) &&
                        // <div class="d-lg-none">hide on lg and wider screens</div>
                        <div className="ms-4 d-md-none border">
                            {inEditing && state.mode === FormModes.EditingCategory && <EditCategory />}
                            {inViewing && state.mode === FormModes.ViewingCategory && <CategoryView />}
                        </div>
                    }
                </ListGroup.Item>
            }
        </>
    );
};

export default CategoryRow;
