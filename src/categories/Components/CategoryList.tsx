import React, { useState, useEffect } from "react";

import { ListGroup } from "react-bootstrap";
import CategoryRow from "./CategoryRow";
import { IParentInfo } from "../types";
import { useCategoryContext } from "../Provider";

const CategoryList = ({ parentCategory, level }: IParentInfo) => {
    const { state, getSubCategories } = useCategoryContext();
    useEffect(() => {
        console.log('Getting the child categories', level, parentCategory)
        getSubCategories({ parentCategory, level });
    }, [level, getSubCategories, parentCategory]);

    // console.log('level, parentCategory:', level, parentCategory)
    const cats = state.categories.filter(c => c.parentCategory === parentCategory);
    // console.log('length:', cats.length)
    cats.forEach(c => console.log(c._id, c.parentCategory, c.title));

    return (
        <div className={level>1?'ms-4':''}>
            <>
                <ListGroup as="ul" variant='dark' className="mb-0">
                    {cats.map(category => 
                        <CategoryRow category={category} key={category._id!.toString()} />)
                    }
                </ListGroup>

                {state.error && state.error}
                {/* {state.loading && <div>...loading</div>} */}
            </>
        </div>
    );
};

export default CategoryList;
