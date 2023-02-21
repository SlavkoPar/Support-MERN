import React  from "react";
import { Button } from "react-bootstrap";

type IProps = {
  cancelForm: () => void,  
  title: string, 
  handleSubmit:  () => void
}

export const FormButtons = ({ cancelForm, title, handleSubmit }: IProps) => {
  return (
    <div className="my-0" 
      style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
    >
      <Button variant="danger" size="sm" type="button" className="ms-2" style={{borderRadius: '3px'}} onClick={cancelForm} >
        Cancel
      </Button>

      <Button variant="primary" size="sm" type="button" className="ms-2" style={{borderRadius: '3px'}} onClick={handleSubmit}>
        {title}
      </Button>

    </div>
  );
};
