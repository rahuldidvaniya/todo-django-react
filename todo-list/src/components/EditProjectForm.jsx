import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PropTypes from "prop-types";

export default function EditProjectForm({ setIsEditFormOpen, project, onEditProject }) {
  EditProjectForm.propTypes = {
    setIsEditFormOpen: PropTypes.func.isRequired,
    project: PropTypes.shape({
      project_id: PropTypes.number.isRequired,
      project_name: PropTypes.string.isRequired,
      description: PropTypes.string
    }).isRequired,
    onEditProject: PropTypes.func.isRequired
  };

  const initialValues = {
    name: project.project_name,
    description: project.project_description || ""
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description cannot exceed 200 characters")
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/projects/edit/${project.project_id}/`,
        values
      );
      
      if (response.data) {
        const updatedProject = {
          project_id: project.project_id,
          project_name: values.name,
          description: values.description
        };
        onEditProject(updatedProject);
        setIsEditFormOpen(false);
      }
    } catch (error) {
      console.error("There was an error updating the project!", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="edit-project-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <div className="project-form">
              <h3>Edit Project</h3>
              <div>
                <Field
                  type="text"
                  className="project-input"
                  placeholder="Enter project name"
                  id="name"
                  name="name"
                />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <Field
                  as="textarea"
                  id="description"
                  className="project-input"
                  placeholder="Enter project description"
                  name="description"
                />
                <ErrorMessage name="description" component="div" className="error" />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-add"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Updating..." : "Update Project"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditFormOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
