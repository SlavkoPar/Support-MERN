import { useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import QuestionRow from "./QuestionRow";
import { IQuestion, IParentInfo, Mode } from "categories/types";
import { useCategoryContext } from "categories/Provider";

const QuestionList = ({ parentCategory, level }: IParentInfo) => {
    const { state, getCategoryQuestions } = useCategoryContext();
    const inAdding = state.mode === Mode.AddingCategory || state.mode === Mode.AddingQuestion;
    useEffect(() => {
        getCategoryQuestions({ parentCategory, level, inAdding });
    }, [level, getCategoryQuestions, parentCategory, inAdding]);

    // console.log('level, parentCategory:', level, parentCategory)
    const category = state.categories.find(c => c._id === parentCategory);
    const questions  = category!.questions??[]; 
   
    return (
        <div className={`ms-0`}>
            <>
                <ListGroup as="ul" variant='dark' className={level>1?'mb-0 ms-4':'mb-0'}>
                    {questions.map((question: IQuestion) => 
                        <QuestionRow question={question} key={question._id!.toString()} />) 
                        // category={cat}
                    }
                </ListGroup>

                {state.error && state.error}
                {/* {state.loading && <div>...loading</div>} */}
            </>
        </div>
    );
};

export default QuestionList;
