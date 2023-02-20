import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faEdit, faCaretRight, faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Button } from "react-bootstrap";

import { useGlobalStore } from '../../GlobalStoreProvider'
import { ActionTypes } from "../types";
import { useCategoryContext, useCategoryDispatch } from '../Provider'
import TreeView from "./TreeView";
import Add from "./Add";
import Edit from "./Edit";
import { Types } from "mongoose";
import { useHover } from '../../common/components/useHover';

import { ICategory } from '../types'

const CategoryRow = ({ category }: { category: ICategory }) => {
    const { _id, title, level, inEditing, inAdding } = category;

    const { canEdit } = useGlobalStore();
    const { store, editCategory, deleteCategory } = useCategoryContext();
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
    // console.log({ inEditing, isExpanded, inAdding })
    const [hoverRef, hoverProps] = useHover();

    console.log({canEdit})

    return (
        <>
            {inAdding ? (
                <Add category={category} inLine={true} />
            )
                : (
                    <tr>
                        <td>
                            <FontAwesomeIcon color='orange' size='lg'
                                icon={isExpanded ? faCaretDown : faCaretRight}
                                onClick={expand}
                            />
                        </td>
                        <td title={_id!.toString()}>{title}</td>
                        {/* <td>{level} </td> */}
                        <td>
                            <div className="my-0 py-0 row-buttons d-flex justify-content-start align-items-center" ref={hoverRef}>
                                {canEdit && hoverProps.isHovered &&
                                    <>
                                        <Button variant='link' size="sm" className="ms-2 py-0 px-1"
                                            //onClick={() => { dispatch({ type: ActionTypes.EDIT, category }) }}>
                                            onClick={() => edit(_id!)}
                                        >
                                            Edit
                                        </Button>
                                        <Button variant='link' size="sm" className="ms-2 py-0 mx-1"
                                            onClick={del}
                                        >
                                            Delete
                                        </Button>
                                        <Button variant='link' size="sm" className="ms-2 py-0 mx-1" title="Add SubCategory" >
                                            <FontAwesomeIcon icon={faPlus} color='orange' size='sm'
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
                                    </>
                                }
                            </div>
                        </td>
                    </tr>
                )
            }

            {(isExpanded || inEditing) && !inAdding &&
                <tr>
                    <td colSpan={4} className="px-0 py-0">
                        {inEditing ? ( // store.mode === FORM_MODES.EDIT &&
                            // <div class="d-lg-none">hide on lg and wider screens</div>
                            <div className="mx-3 d-md-none">
                                <Edit />
                            </div>
                        )
                            : (
                                <TreeView level={level + 1} parentCategory={_id!} />
                            )}
                    </td>
                </tr>
            }
        </>
    );
};

export default CategoryRow;
