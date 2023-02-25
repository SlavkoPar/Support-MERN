import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import CategoryRow from "./CategoryRow";
import { IParentInfo } from "../types";
import { useCategoryContext } from "../Provider";

const TreeView = ({ parentCategory, level }: IParentInfo) => {
    const { state, getCategories } = useCategoryContext();
    useEffect(() => {
        console.log('Zovem getCategories', level, parentCategory)
        getCategories({ parentCategory, level });
    }, [level, getCategories, parentCategory]);

        
    return (
        <div className={`ms-2`}>
            <>
                {!state.loading && !state.error &&
                    <ListGroup as="ul" variant='dark' className="mb-0">
                        {state.categories
                            .filter(category =>
                                category.parentCategory === parentCategory
                            )
                            .map((category) =>
                                <CategoryRow category={category} key={category._id!.toString()} />
                            )
                        }
                    </ListGroup>
                }

                {state.error && state.error}
                {state.loading && <div>...loading</div>}
            </>
        </div>
    );
};

export default TreeView;
