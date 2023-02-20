import React, { useState, useEffect } from "react";
import { Types } from 'mongoose';

import { Table } from "react-bootstrap";
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
        <div className={`table-wrapper ms-2`}>
            <Table striped bordered hover size="sm" className="mb-0">
                {level === 1 &&
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            {/* <th>Level</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                }
                <tbody>
                    {
                        store.categories
                            .filter(category => 
                                category.parentCategory === parentCategory
                            )
                            .map((category) => // inAdding category has no _id
                                <CategoryRow category={category} key={category._id!.toString()} /> 
                            )
                    }
                </tbody>
            </Table>
            {store.loading && "Loading"}
            {store.error && store.error}
        </div>
    );
};

export default TreeView;
