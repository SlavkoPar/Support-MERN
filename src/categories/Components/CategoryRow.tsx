import { Types } from "mongoose";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove, faCaretRight, faCaretDown, faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'

import { ListGroup, Button, Badge } from "react-bootstrap";

import { useGlobalState } from 'global/GlobalProvider'
import { ActionTypes, Mode } from "categories/types";
import { useCategoryContext, useCategoryDispatch } from 'categories/Provider'
import { useHover } from 'common/components/useHover';
import { ICategory } from 'categories/types'

import CategoryList from "./CategoryList";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import ViewCategory from "./ViewCategory";
import QuestionList from "./questions/QuestionList";

const CategoryRow = ({ category }: { category: ICategory }) => {
    const { _id, title, level, inViewing, inEditing, inAdding, numOfQuestions } = category;

    const { canEdit, isDarkMode, variant, bg } = useGlobalState();

    const { state, viewCategory, editCategory, deleteCategory } = useCategoryContext();
    const dispatch = useCategoryDispatch();

    const [isExpanded, setIsExpanded] = useState(false);
    const alreadyAdding = state.mode === Mode.AddingCategory;
    const showQuestions = true; //questions && !questions.find(q => q.inAdding)

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
        <div ref={hoverRef} className="d-flex justify-content-start align-items-center w-100">
            <Button
                variant='link'
                size="sm"
                className="py-0 px-1"
                onClick={expand}
                title="Expand"
                disabled={alreadyAdding}
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
                disabled={alreadyAdding}
            >
                {title}
            </Button>

            {numOfQuestions! > 0 &&
                <Badge bg="secondary" pill>
                    {numOfQuestions!} <FontAwesomeIcon icon={faQuestion} size='sm' />
                </Badge>
            }

            {canEdit && !alreadyAdding && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-1 py-0 px-0"
                    //onClick={() => { dispatch({ type: ActionTypes.EDIT, category }) }}>
                    onClick={() => edit(_id!)}
                >
                    <FontAwesomeIcon icon={faEdit} color='orange' size='lg' />
                </Button>
            }

            {canEdit && !alreadyAdding && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-1 py-0 mx-1"
                    onClick={del}
                >
                    <FontAwesomeIcon icon={faRemove} color='orange' size='lg' />
                </Button>
            }

            {canEdit && !alreadyAdding && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubCategory" >
                    <FontAwesomeIcon icon={faPlus} color='orange' size='lg'
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.ADD_CATEGORY,
                                payload: {
                                    parentCategory: category._id,
                                    level: category.level
                                }
                            })
                            if (!isExpanded)
                                setIsExpanded(true);
                        }}
                    />
                </Button>
            }

            {canEdit && !alreadyAdding && hoverProps.isHovered &&
                <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add Question" >
                    <FontAwesomeIcon icon={faPlus} color='blue' size='lg'
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

    return (
        <>
            <ListGroup.Item
                variant={"primary"}
                className="py-1 px-1 w-100"
                as="li"
            >
                {inAdding && state.mode === Mode.AddingCategory ? (
                    <AddCategory category={category} inLine={true} />
                )
                    : ( (inEditing && state.mode === Mode.EditingCategory) ||
                        (inViewing && state.mode === Mode.ViewingCategory)) ? (
                        <>
                            {/* <div class="d-lg-none">hide on lg and wider screens</div> */}
                            <div className="ms-0 d-md-none w-100">
                                {inEditing && <EditCategory inLine={true} />}
                                {inViewing && <ViewCategory inLine={true} />}
                            </div>
                            <div className="d-none d-md-block">
                                {Row1}
                            </div>
                        </>
                    )
                        : (
                            Row1
                        )
                }
            </ListGroup.Item>

            {/* !inAdding && */}
            {(isExpanded || inViewing || inEditing) && // Row2
                <ListGroup.Item
                    className="py-0 px-0"
                    variant={"primary"}
                    as="li"
                >
                    {isExpanded &&
                        <>
                            <CategoryList level={level + 1} parentCategory={_id!} />
                            {showQuestions &&
                                <QuestionList level={level + 1} parentCategory={_id!} />
                            }
                        </>
                    }

                </ListGroup.Item>
            }
        </>
    );
};

export default CategoryRow;
