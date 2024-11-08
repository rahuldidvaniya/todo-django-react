import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PropTypes from "prop-types";

export default function AddProjectForm({ setIsProjectFormOpen, onAddProject }) {
  AddProjectForm.propTypes = {
    setIsProjectFormOpen: PropTypes.func.isRequired,
    onAddProject: PropTypes.func.isRequired,
  };

  const handleCloseProjectForm = () => setIsProjectFormOpen(false);

  const initialValues = {
    name: "",
    description: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description cannot exceed 200 characters"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("Form data", values);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/projects/create/",
        values
      );
      console.log("Response data", response.data);
      onAddProject(response.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
    setSubmitting(false);
    setIsProjectFormOpen(false);
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
              <img
                src="icons/iteration.png"
                className="icon"
                alt="Project Icon"
              />
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
                {formik.isSubmitting ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseProjectForm}
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
