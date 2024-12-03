import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { showToast } from "../utils/toastConfig";
import { api } from '../services/api';
import { useProjects } from '../hooks/useProjects';

export default function AddProjectForm() {
  AddProjectForm.propTypes = {
    setIsProjectFormOpen: PropTypes.func.isRequired,
    fetchProjects: PropTypes.func.isRequired,
  };
  const { setIsProjectFormOpen, fetchProjects } = useProjects();
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
    try {
      await api.createProject(values);
      await fetchProjects();
      showToast.success("Project added successfully! 🎉");
      setIsProjectFormOpen(false);
    } catch (error) {
      console.error("There was an error!", error);
      showToast.error("Failed to add project!");
    } finally {
      setSubmitting(false);
    }
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
