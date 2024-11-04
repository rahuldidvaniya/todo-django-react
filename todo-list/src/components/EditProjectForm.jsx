import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PropTypes from "prop-types";

export default function EditProjectForm({
  setIsEditFormOpen,
  project,
  onEditProject,
}) {
  EditProjectForm.propTypes = {
    setIsEditFormOpen: PropTypes.func.isRequired,
    project: PropTypes.shape({
      project_id: PropTypes.number.isRequired,
      project_name: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    onEditProject: PropTypes.func.isRequired,
  };

  const initialValues = {
    name: project.project_name,
    description: project.description || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description cannot exceed 200 characters"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/todos/edit/${project.project_id}/`, // Update the URL based on your API
        values
      );
      onEditProject(response.data); // Call the function to refresh the project list
    } catch (error) {
      console.error("There was an error updating the project!", error);
    }
    setSubmitting(false);
    setIsEditFormOpen(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form>
          <div className="project-form">
            <div>
              <Field
                type="text"
                className="project-input"
                placeholder="Enter project name"
                id="name"
                name="name"
              />
            </div>
            <ErrorMessage name="name" component="div" />
            <div>
              <Field
                as="textarea"
                id="description"
                className="project-input"
                placeholder="Enter project description"
                name="description"
              />
              <ErrorMessage name="description" component="div" />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-add"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Updating..." : "Update"}
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
  );
}
