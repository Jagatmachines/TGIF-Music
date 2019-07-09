import React from 'react';
import { Modal } from 'react-bootstrap';
import { Form, Field } from 'react-final-form';

const GroupAddForm = (props) => {
  const onSubmitFunction = async (values) => {
    props.setGroupName(values);
  }
  return (
    <Modal show={props.groupAddForm} onHide={props.handleGroupAddFormModal}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up Group Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <Form
              onSubmit={onSubmitFunction}
              validate={values => {
                const errors = {};
                if (!values.groupName) errors.groupName = "Required"
                if (!values.groupId) errors.groupId = "Required"
                if (!values.createdBy) errors.createdBy = "Required fusemachines email id"
                return errors
              }}
              render={({ handleSubmit, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="groupName">
                    {({ input, meta }) => (
                      <div className="form-group">
                        <label htmlFor="groupName">Group Name</label>
                        <input {...input} type="groupName" id="groupName" className="form-control" placeholder="Enter Group Name" />
                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  <Field name="groupId">
                    {({ input, meta }) => (
                      <div className="form-group">
                        <label htmlFor="groupId">Group ID</label>
                        <input {...input} type="groupId" id="groupId" className="form-control" placeholder="Enter Group ID" />
                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  <Field name="createdBy">
                    {({ input, meta }) => (
                      <div className="form-group">
                        <label htmlFor="createdBy">Your Email</label>
                        <input {...input} type="createdBy" id="createdBy" className="form-control" placeholder="Enter Email" />
                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                      </div>
                    )}
                  </Field>
  
                  <div>
                    {/* <button  className="btn btn-secondary" onClick={props.handleGroupAddFormModal}>
                      Close
                    </button> */}
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
  )
}

export default GroupAddForm