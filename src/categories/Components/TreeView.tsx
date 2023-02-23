import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { ListGroup } from "react-bootstrap";
import CategoryRow from "./CategoryRow";
import { IParentInfo } from "../types";
import { useCategoryContext } from "../Provider";

const TreeView = ({ parentCategory, level }: IParentInfo) => {
    const { store, getCategories } = useCategoryContext();
    useEffect(() => {
        console.log('Zovem getCategories', level, parentCategory)
        getCategories({ parentCategory, level });
    }, [level, getCategories, parentCategory]);

    return (
        <div className={`ms-2`}>
            <>
                {!store.loading && !store.error &&
                    <ListGroup as="ul" variant='dark' className="mb-0">
                        {store.categories
                            .filter(category =>
                                category.parentCategory === parentCategory
                            )
                            .map((category) =>
                                <CategoryRow category={category} key={category._id!.toString()} />
                            )
                        }
                    </ListGroup>
                }

                {store.loading && "Loading"}
                {store.error && store.error}
            </>
        </div>
    );
};

export default TreeView;
