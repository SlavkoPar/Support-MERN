import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import CategoryRow from "./CategoryRow";
import { IParentInfo } from "../types";
import { useCategoryContext } from "../Provider";

const List = ({ parentCategory, level }: IParentInfo) => {
    const { state, getCategories } = useCategoryContext();
    useEffect(() => {
        console.log('Zovem getCategories', level, parentCategory)
        getCategories({ parentCategory, level });
    }, [level, getCategories, parentCategory]);

    console.log('List')
    console.log('LIst level, parentCategory:', level, parentCategory)

    console.log('parentCategory', parentCategory)
    const cats = state.categories.filter(c => c.parentCategory === parentCategory)
    console.log('length:', cats.length)
    console.log('parentCategory', parentCategory)
    cats.forEach(c => console.log(c.parentCategory, c.title));

    return (
        <div className={`ms-2`}>
            <>
                {!state.loading && !state.error &&
                    <ListGroup as="ul" variant='dark' className="mb-0">
                        {cats.map(category => 
                            <CategoryRow category={category} key={category._id!.toString()} />)
                        }
                    </ListGroup>
                }

                {state.error && state.error}
                {state.loading && <div>...loading</div>}
            </>
        </div>
    );
};

export default List;
